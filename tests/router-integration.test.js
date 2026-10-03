import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CourseRouter } from '../js/ui/router.js';
import { CourseStore } from '../js/core/store.js';
import { ScormAdapter } from '../js/core/scorm-adapter.js';
import { MODULES_DATA } from '../js/data/modules-content.js';
import { THEORY_DATA } from '../js/data/theory-drawers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCORM_DIR = path.resolve(__dirname, '..');
const ROOT_DIR = path.resolve(SCORM_DIR, '..');

test('CourseRouter - Instanciación y métodos exportados', () => {
  assert.strictEqual(typeof CourseRouter, 'function');
  const store = new CourseStore();
  const router = new CourseRouter({ store, rootContainer: '#app' });

  assert.strictEqual(typeof router.navigateTo, 'function');
  assert.strictEqual(typeof router.render, 'function');
  assert.strictEqual(router.currentModuleIndex, 0);

  // Navegación segura sin DOM
  router.navigateTo(2);
  assert.strictEqual(router.currentModuleIndex, 2);
  assert.strictEqual(store.getState().currentModule, 2);

  // Navegación a índice fuera de rango no muta el estado
  router.navigateTo(99);
  assert.strictEqual(router.currentModuleIndex, 2);
});

test('Integridad de Contenidos - 6 Módulos y 6 Espinas Teóricas', () => {
  assert.strictEqual(MODULES_DATA.length, 6);
  for (let i = 0; i < 6; i++) {
    const mod = MODULES_DATA[i];
    assert.strictEqual(mod.number, i);
    assert.strictEqual(mod.id, `mod-${i}`);
    assert.ok(mod.title.length > 5);
    assert.ok(mod.objective.length > 10);
    assert.ok(THEORY_DATA[`mod-${i}-theory`], `Espina teórica mod-${i}-theory requerida`);
  }
});

test('imsmanifest.xml - Validación de recursos y estructura SCORM 1.2', () => {
  const manifestPath = path.join(SCORM_DIR, 'imsmanifest.xml');
  assert.ok(fs.existsSync(manifestPath), 'imsmanifest.xml debe existir');

  const content = fs.readFileSync(manifestPath, 'utf8');
  assert.match(content, /identifier="COURSE_ALLES_METODOLOGIA_2026"/);
  assert.match(content, /<schema>ADL SCORM<\/schema>/);
  assert.match(content, /<schemaversion>1.2<\/schemaversion>/);
  assert.match(content, /<adlcp:masteryscore>100<\/adlcp:masteryscore>/);

  const fileMatches = content.match(/<file\s+href="([^"]+)"\s*\/>/g);
  assert.ok(fileMatches && fileMatches.length >= 14);

  // Verificar que cada archivo referenciado existe en disco
  for (const match of fileMatches) {
    const href = match.match(/href="([^"]+)"/)[1];
    const fullPath = path.join(SCORM_DIR, href);
    assert.ok(fs.existsSync(fullPath), `El archivo referenciado ${href} debe existir físicamente`);
  }
});

test('Paquete ZIP SCORM - Validación de archivo distribuible', () => {
  const zipPath = path.join(ROOT_DIR, 'curso_scorm_metodologia_alles.zip');
  assert.ok(fs.existsSync(zipPath), 'curso_scorm_metodologia_alles.zip debe existir');

  const stats = fs.statSync(zipPath);
  assert.ok(stats.size > 20000, `El archivo zip debe tener contenido real (tamaño: ${stats.size} bytes)`);
});

test('CourseRouter - Validación Estricta de Actividades Requeridas por Módulo (Regla de Completitud)', () => {
  const store = new CourseStore();
  const router = new CourseRouter({ store, rootContainer: '#app' });

  // Módulo 0: Incompleto sin ruta ni preguntas exploradas
  let m0 = router.isModuleActivitiesCompleted(0);
  assert.strictEqual(m0.completed, false);
  assert.ok(m0.missingActivities.length > 0);
  assert.strictEqual(router._checkAndCompleteModule(0), false);
  assert.ok(!store.getState().completedModules.includes(0));

  // Completar ruta en Módulo 0
  store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'mod-0-pathway', passed: true });
  m0 = router.isModuleActivitiesCompleted(0);
  assert.strictEqual(m0.completed, true);
  assert.strictEqual(router._checkAndCompleteModule(0), true);
  assert.ok(store.getState().completedModules.includes(0));

  // Módulo 1: Incompleto sin reto superado
  let m1 = router.isModuleActivitiesCompleted(1);
  assert.strictEqual(m1.completed, false);
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', { moduleId: 'mod-1', passed: false });
  assert.strictEqual(router.isModuleActivitiesCompleted(1).completed, false);
  assert.strictEqual(router._checkAndCompleteModule(1), false);

  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', { moduleId: 'mod-1', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(1).completed, true);
  assert.strictEqual(router._checkAndCompleteModule(1), true);
  assert.ok(store.getState().completedModules.includes(1));

  // Módulo 2: Requiere Challenge 2 Y Practice Builder
  let m2 = router.isModuleActivitiesCompleted(2);
  assert.strictEqual(m2.completed, false);
  // Solo challenge superado
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', { moduleId: 'mod-2', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(2).completed, false);
  assert.strictEqual(router._checkAndCompleteModule(2), false);
  assert.ok(!store.getState().completedModules.includes(2));

  // Completar también el Practice Builder
  store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'builder-mod-2', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(2).completed, true);
  assert.strictEqual(router._checkAndCompleteModule(2), true);
  assert.ok(store.getState().completedModules.includes(2));

  // Módulo 3: Requiere Challenge 3 Y Sorting Block
  let m3 = router.isModuleActivitiesCompleted(3);
  assert.strictEqual(m3.completed, false);
  // Solo sorting completado sin challenge
  store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'sorting-mod-3', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(3).completed, false);
  assert.strictEqual(router._checkAndCompleteModule(3), false);

  // Completar challenge 3
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', { moduleId: 'mod-3', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(3).completed, true);
  assert.strictEqual(router._checkAndCompleteModule(3), true);
  assert.ok(store.getState().completedModules.includes(3));

  // Módulo 4: Requiere Challenge 4 Y Chat Simulator
  let m4 = router.isModuleActivitiesCompleted(4);
  assert.strictEqual(m4.completed, false);
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', { moduleId: 'mod-4', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(4).completed, false);
  assert.strictEqual(router._checkAndCompleteModule(4), false);

  store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'chat-mod-4', passed: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(4).completed, true);
  assert.strictEqual(router._checkAndCompleteModule(4), true);
  assert.ok(store.getState().completedModules.includes(4));

  // Módulo 5: Requiere Rúbrica 100% (c1, c2, c3, c4)
  let m5 = router.isModuleActivitiesCompleted(5);
  assert.strictEqual(m5.completed, false);
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { criterion: 'c1', value: true });
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { criterion: 'c2', value: true });
  assert.strictEqual(router.isModuleActivitiesCompleted(5).completed, false);

  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { rubric: { c1: true, c2: true, c3: true, c4: true } });
  assert.strictEqual(router.isModuleActivitiesCompleted(5).completed, true);
  assert.strictEqual(router._checkAndCompleteModule(5), true);
  assert.ok(store.getState().completedModules.includes(5));
});

test('Validación Estética: leadIntro <= 300 caracteres en todos los módulos', () => {
  for (const mod of MODULES_DATA) {
    assert.ok(mod.leadIntro, `Módulo ${mod.number} debe tener leadIntro definido`);
    assert.ok(
      mod.leadIntro.length <= 300,
      `Módulo ${mod.number} leadIntro excede 300 caracteres (${mod.leadIntro.length} chars)`
    );
    assert.ok(mod.leadIntro.length >= 50, `Módulo ${mod.number} leadIntro demasiado corto`);
  }
});

test('Módulo 0 - Contiene explicación explícita de "Reto Invertido"', () => {
  const m0 = MODULES_DATA[0];
  const qReto = m0.introData.questions.find(q => q.id === 'q3-reto-invertido');
  assert.ok(qReto, 'Debe existir la pregunta específica sobre Reto Invertido');
  assert.ok(qReto.question.includes('Reto Invertido'));
  assert.ok(qReto.details.includes('Fallo Productivo'));
  assert.ok(qReto.details.includes('Quiebre Cognitivo'));
});

test('Módulo 5 & Espina 5.E - Ausencia absoluta de referencias a Moodle', () => {
  const m5 = MODULES_DATA[5];
  const m5Str = JSON.stringify(m5).toLowerCase();
  assert.ok(!m5Str.includes('moodle'), 'Módulo 5 no debe tener ninguna referencia a Moodle');

  const theory5 = THEORY_DATA['mod-5-theory'];
  assert.ok(theory5, 'Espina teórica mod-5-theory debe existir');
  const theoryStr = JSON.stringify(theory5).toLowerCase();
  assert.ok(!theoryStr.includes('moodle'), 'Espina teórica 5.E no debe tener referencias a Moodle');
});

test('CourseRouter - Gating Secuencial y Desbloqueo de Módulos (isModuleUnlocked)', () => {
  const store = new CourseStore();
  const router = new CourseRouter({ store, rootContainer: '#app' });

  // Módulo 0 siempre está desbloqueado
  assert.equal(router.isModuleUnlocked(0), true);

  // Módulos 1 a 5 deben estar bloqueados inicialmente
  for (let i = 1; i <= 5; i++) {
    assert.equal(router.isModuleUnlocked(i), false, `Módulo ${i} debe estar bloqueado al inicio`);
  }

  // Al completar Módulo 0, se debe desbloquear el Módulo 1
  store.dispatchAction('COMPLETE_MODULE', 0);
  assert.equal(router.isModuleUnlocked(1), true, 'Módulo 1 debe desbloquearse tras completar Módulo 0');
  assert.equal(router.isModuleUnlocked(2), false, 'Módulo 2 debe seguir bloqueado');

  // Al completar Módulo 1, se debe desbloquear el Módulo 2
  store.dispatchAction('COMPLETE_MODULE', 1);
  assert.equal(router.isModuleUnlocked(2), true, 'Módulo 2 debe desbloquearse tras completar Módulo 1');
});

test('Tokens CSS - Verificación de Contraste WCAG AA (>= 4.5:1) contra Blanco y Fondos', () => {
  const lum = v => {
    v = v.map(x => x / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  };
  const ratio = (hex1, hex2) => {
    const parse = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const l1 = lum(parse(hex1));
    const l2 = lum(parse(hex2));
    return Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2));
  };

  const cssPairs = [
    ['#0F766E', '#FFFFFF'], // mint-primary / mint-dark sobre blanco (5.47:1)
    ['#115E59', '#FFFFFF'], // mint-primary-hover / mint-darker sobre blanco (7.58:1)
    ['#047857', '#FFFFFF'], // golden-green sobre blanco (badge completado)
    ['#B45309', '#FFFFFF'], // amber-warning sobre blanco (badge pendiente)
    ['#4338CA', '#EEF2FF'], // Nivel A
    ['#0F766E', '#F0FDFA'], // Nivel B
    ['#92400E', '#FFFBEB'], // Nivel C
    ['#334155', '#F1F5F9'], // Nivel D
    ['#64748B', '#FFFFFF'], // slate-400 / slate-500 sobre blanco (4.76:1)
    ['#475569', '#FFFFFF'], // slate-600 sobre blanco (7.58:1)
    ['#475569', '#F1F5F9'], // slate-600 sobre surface-muted (duración módulo)
    ['#475569', '#E2E8F0'], // slate-600 sobre slate-200 (botón bloqueado nav)
    ['#CBD5E1', '#0F172A'], // slate-300 sobre slate-900 (10.9:1)
  ];

  for (const [c1, c2] of cssPairs) {
    const r = ratio(c1, c2);
    assert.ok(r >= 4.5, `Contraste entre ${c1} y ${c2} (${r}:1) debe ser >= 4.5:1 (WCAG AA)`);
  }
});

test('CourseRouter - Reanudación sanitiza y persiste módulo bloqueado contra gating', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();
  adapter.setValue('cmi.core.lesson_location', 'mod-5');
  adapter.setValue('cmi.suspend_data', JSON.stringify({
    courseStoreState: {
      currentModule: 5,
      completedModules: [0],
      challengesState: {},
      activitiesState: {},
      capstoneRubric: { c1: false, c2: false, c3: false, c4: false }
    }
  }));

  const store = new CourseStore(adapter);
  const router = new CourseRouter({ store, rootContainer: null });

  assert.equal(router.currentModuleIndex, 1, 'Router debe normalizar al mayor módulo desbloqueado (1)');
  assert.equal(store.getState().currentModule, 1, 'Store debe actualizarse a módulo normalizado (1)');
  assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-1', 'ScormAdapter lesson_location debe reflejar mod-1');
});

test('Retos Invertidos - Simetría Psicométrica de Reactivos en Módulos 1 a 4', () => {
  for (let m = 1; m <= 4; m++) {
    const mod = MODULES_DATA[m];
    assert.ok(mod.challenge, `Módulo ${m} debe contener reto invertido`);
    assert.equal(mod.challenge.choices.length, 3, `Reto de Módulo ${m} debe tener exactamente 3 opciones`);

    const lengths = mod.challenge.choices.map(c => c.text.length);
    const minLen = Math.min(...lengths);
    const maxLen = Math.max(...lengths);
    const ratio = maxLen / minLen;

    assert.ok(
      ratio <= 1.25,
      `Reto Módulo ${m}: Las opciones deben ser simétricas en longitud (ratio ${ratio.toFixed(2)} <= 1.25, min: ${minLen}, max: ${maxLen})`
    );

    // Verificación de plausibilidad: exactamente 1 correcta y 2 incorrectas
    const correctCount = mod.challenge.choices.filter(c => c.isCorrect).length;
    assert.equal(correctCount, 1, `Reto Módulo ${m} debe tener exactamente 1 opción correcta`);
  }
});

test('Separador Semántico de Transición - Módulos 2, 3 y 4', () => {
  for (const modIndex of [2, 3, 4]) {
    const mod = MODULES_DATA[modIndex];
    assert.ok(mod.exerciseTransition, `Módulo ${modIndex} debe definir exerciseTransition`);
    assert.ok(mod.exerciseTransition.badge.length > 5, `Módulo ${modIndex} badge debe tener contenido`);
    assert.ok(mod.exerciseTransition.title.length > 10, `Módulo ${modIndex} title debe tener contenido`);
    assert.ok(mod.exerciseTransition.description.length > 30, `Módulo ${modIndex} description debe tener contenido`);
    assert.ok(mod.exerciseTransition.focus.length > 15, `Módulo ${modIndex} focus debe tener contenido`);
  }

  // Módulos 0, 1 y 5 no deben tener exerciseTransition (tienen un solo bloque principal o dinámica única)
  for (const modIndex of [0, 1, 5]) {
    const mod = MODULES_DATA[modIndex];
    assert.strictEqual(mod.exerciseTransition, undefined, `Módulo ${modIndex} no debe definir exerciseTransition`);
  }
});

