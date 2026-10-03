import test from 'node:test';
import assert from 'node:assert/strict';

import { getModulesData, MODULES_DATA, MODULES_DATA_EN } from '../js/data/modules-content.js';
import { getTheoryData, THEORY_DATA, THEORY_DATA_EN } from '../js/data/theory-drawers.js';
import { RubricEvaluator } from '../js/services/rubric-evaluator.js';
import { CourseRouter, UI_TRANSLATIONS } from '../js/ui/router.js';
import { CourseStore } from '../js/core/store.js';

test('i18n - Paridad y Completitud de Datasets ES y EN', () => {
  const modulesEs = getModulesData('es');
  const modulesEn = getModulesData('en');

  assert.equal(modulesEs.length, 6, 'Módulos ES debe tener exactamente 6 elementos');
  assert.equal(modulesEn.length, 6, 'Módulos EN debe tener exactamente 6 elementos');

  const theoryEs = getTheoryData('es');
  const theoryEn = getTheoryData('en');

  const expectedTheoryKeys = ['mod-0-theory', 'mod-1-theory', 'mod-2-theory', 'mod-3-theory', 'mod-4-theory', 'mod-5-theory'];
  for (const key of expectedTheoryKeys) {
    assert.ok(theoryEs[key], `Theory ES debe contener ${key}`);
    assert.ok(theoryEn[key], `Theory EN debe contener ${key}`);
    assert.ok(theoryEn[key].title.length > 5, `Theory EN ${key} debe tener título`);
    assert.ok(theoryEn[key].html.length > 50, `Theory EN ${key} debe tener contenido html`);
  }

  for (let i = 0; i < 6; i++) {
    const modEs = modulesEs[i];
    const modEn = modulesEn[i];

    assert.equal(modEn.id, modEs.id, `Módulo ${i} debe tener el mismo ID`);
    assert.ok(modEn.title.length > 5, `Módulo ${i} EN debe tener título`);
    assert.ok(modEn.subtitle.length > 5, `Módulo ${i} EN debe tener subtítulo`);
    assert.ok(modEn.leadIntro.length > 10, `Módulo ${i} EN debe tener leadIntro`);
    assert.ok(modEn.objective.length > 10, `Módulo ${i} EN debe tener objective`);
    if (modEs.keyTakeaways) {
      assert.ok(modEn.keyTakeaways.length >= 2, `Módulo ${i} EN debe tener keyTakeaways`);
    }

    if (modEs.challenge) {
      assert.ok(modEn.challenge, `Módulo ${i} EN debe tener challenge`);
      assert.equal(modEn.challenge.choices.length, modEs.challenge.choices.length);
      assert.equal(modEn.challenge.correctChoiceId, modEs.challenge.correctChoiceId);
      assert.ok(modEn.challenge.jitPill, `Módulo ${i} EN challenge debe tener jitPill`);
    }
  }

  // Módulo 0
  assert.equal(modulesEn[0].introData.questions.length, modulesEs[0].introData.questions.length, 'Intro EN debe tener la misma cantidad de preguntas que ES');
  assert.equal(modulesEn[0].introData.questions.length, 4, 'Intro EN debe tener 4 preguntas');
  assert.ok(modulesEn[0].introData.pathways.practiceChoice.title, 'Intro EN debe tener opción de práctica');
  assert.ok(modulesEn[0].introData.pathways.theoryChoice.title, 'Intro EN debe tener opción de teoría');

  // Módulo 2
  assert.ok(modulesEn[2].practiceBuilder, 'Módulo 2 EN debe tener practiceBuilder');
  assert.equal(modulesEn[2].practiceBuilder.sections.length, 3, 'Practice Builder EN debe tener 3 secciones');

  // Módulo 3
  assert.ok(modulesEn[3].sortingActivity, 'Módulo 3 EN debe tener sortingActivity');
  assert.equal(modulesEn[3].sortingActivity.items.length, 8, 'Sorting Activity EN debe tener 8 items');

  // Módulo 4
  assert.ok(modulesEn[4].chatSimulator, 'Módulo 4 EN debe tener chatSimulator');
  assert.equal(modulesEn[4].chatSimulator.turns.length, 3, 'Chat Simulator EN debe tener 3 turnos');

  // Módulo 5
  assert.ok(modulesEn[5].capstoneCase, 'Módulo 5 EN debe tener capstoneCase');
  assert.ok(modulesEn[5].submissionBlueprint, 'Módulo 5 EN debe tener submissionBlueprint');
  assert.equal(modulesEn[5].submissionBlueprint.bbiQuestions.length, 3, 'Capstone Blueprint EN debe tener 3 preguntas BBI');
});

test('i18n - Simetría Psicométrica de Reactivos en Inglés (Ratio <= 1.25)', () => {
  const modulesEn = getModulesData('en');

  for (let i = 1; i <= 4; i++) {
    const mod = modulesEn[i];
    assert.ok(mod.challenge, `Módulo ${i} debe tener challenge`);
    const lengths = mod.challenge.choices.map(c => c.text.length);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const ratio = maxLen / minLen;

    assert.ok(
      ratio <= 1.25,
      `Módulo ${i} EN excede ratio de longitud psicométrica (1.25): ratio=${ratio.toFixed(3)} [${lengths.join(', ')}]`
    );
  }
});

test('i18n - Ausencia Absoluta de Términos Prohibidos y Marca Moodle en EN y ES', () => {
  const modulesEs = getModulesData('es');
  const modulesEn = getModulesData('en');
  const theoryEs = getTheoryData('es');
  const theoryEn = getTheoryData('en');

  const checkNoMoodle = (obj, context) => {
    const jsonStr = JSON.stringify(obj).toLowerCase();
    assert.ok(!jsonStr.includes('moodle'), `${context} contiene la palabra prohibida "moodle"`);
  };

  checkNoMoodle(modulesEs[5], 'Módulo 5 ES');
  checkNoMoodle(modulesEn[5], 'Módulo 5 EN');
  checkNoMoodle(theoryEs['mod-5-theory'], 'Espina Teórica 5.E ES');
  checkNoMoodle(theoryEn['mod-5-theory'], 'Espina Teórica 5.E EN');
});

test('i18n - Aislamiento Estricto de Idioma (Zero String Mixing)', () => {
  const modulesEs = getModulesData('es');
  const modulesEn = getModulesData('en');

  // Marcadores exclusivos de inglés no deben aparecer en ES
  const enOnlyPhrases = [
    'Integrative Case',
    'Conceptual Definition',
    'Essential Keys Before You Begin',
    'Start with Practice',
    'Organizational Change Management'
  ];

  const jsonEs = JSON.stringify(modulesEs);
  for (const phrase of enOnlyPhrases) {
    assert.ok(!jsonEs.includes(phrase), `El dataset ES contiene frase inglesa no traducida: "${phrase}"`);
  }

  // Marcadores exclusivos de español no deben aparecer en EN
  const esOnlyPhrases = [
    'Caso Integrador',
    'Definición Conceptual',
    'Claves Esenciales antes de Comenzar',
    'Comenzar con la Práctica',
    'Gestión del Cambio Organizacional'
  ];

  const jsonEn = JSON.stringify(modulesEn);
  for (const phrase of esOnlyPhrases) {
    assert.ok(!jsonEn.includes(phrase), `El dataset EN contiene frase española residual: "${phrase}"`);
  }
});

test('i18n - RubricEvaluator Soporte Bilingüe y Validación de Antiprones en Inglés', () => {
  const evaluator = new RubricEvaluator();
  evaluator.setLanguage('en');

  const modulesEn = getModulesData('en');
  const blueprintEn = modulesEn[5].submissionBlueprint;

  // Blueprint calibrado en inglés debe pasar al 100%
  const resultPass = evaluator.evaluateSubmission({
    definition: blueprintEn.definition,
    levels: blueprintEn.levels,
    bbiQuestions: blueprintEn.bbiQuestions
  });

  assert.equal(resultPass.passed, true, 'El blueprint de referencia en EN debe aprobar la rúbrica');
  assert.equal(resultPass.score, 100, 'El score debe ser 100 en EN');
  assert.equal(resultPass.checklist.length, 4, 'Checklist debe tener 4 criterios evaluados');
  for (const item of resultPass.checklist) {
    assert.equal(item.passed, true, `Criterio ${item.name} debe estar aprobado`);
  }

  // Criterio 1: Rechazo de términos morales en inglés (good, bad, loyal, honest)
  const resultMoral = evaluator.evaluateSubmission({
    definition: 'Promote honest and good behavior when facing difficult company transitions.',
    levels: blueprintEn.levels,
    bbiQuestions: blueprintEn.bbiQuestions
  });
  assert.equal(resultMoral.checklist[0].passed, false, 'Debe fallar Criterio 1 ante moral terms en inglés');

  // Criterio 2: Rechazo de escala adjetival en inglés (communicates well / very well / excellent)
  const badLevelsEn = {
    A: 'Communicates excellent all strategic directives across the enterprise.',
    B: 'Communicates very well with departmental leaders.',
    C: 'Communicates well within immediate work team.',
    D: 'Communicates with difficulty or frequent errors.'
  };
  const resultAdj = evaluator.evaluateSubmission({
    definition: blueprintEn.definition,
    levels: badLevelsEn,
    bbiQuestions: blueprintEn.bbiQuestions
  });
  assert.equal(resultAdj.checklist[1].passed, false, 'Debe fallar Criterio 2 ante escala adjetival en inglés');

  // Criterio 4: Rechazo de preguntas hipotéticas en inglés (what would you do, how would you act)
  const resultHypo = evaluator.evaluateSubmission({
    definition: blueprintEn.definition,
    levels: blueprintEn.levels,
    bbiQuestions: [
      'What would you do if your team resisted a new tool?',
      'How would you act to persuade someone to adopt the change?',
      'What do you think about managing organizational transitions?'
    ]
  });
  assert.equal(resultHypo.checklist[3].passed, false, 'Debe fallar Criterio 4 ante preguntas hipotéticas en inglés');
});

test('i18n - UI_TRANSLATIONS Simetría de Claves entre ES y EN', () => {
  const esKeys = Object.keys(UI_TRANSLATIONS.es).sort();
  const enKeys = Object.keys(UI_TRANSLATIONS.en).sort();

  assert.deepEqual(esKeys, enKeys, 'Las claves de UI_TRANSLATIONS.es y UI_TRANSLATIONS.en deben ser idénticas');
});

test('i18n - CourseRouter Cambio Dinámico de Idioma y Renderizado Seguro', () => {
  const store = new CourseStore();
  const router = new CourseRouter({ store, lang: 'es' });

  assert.equal(router.currentLanguage, 'es');
  assert.equal(router.modules.length, 6);
  assert.equal(router.modules[0].title, 'Introducción al Programa Metodológico');
  assert.equal(router.modules[1].title, 'El Síndrome del Diccionario Copiado');

  router.setLanguage('en');
  assert.equal(router.currentLanguage, 'en');
  assert.equal(router.modules.length, 6);
  assert.equal(router.modules[0].title, 'Introduction to the Methodological Program');
  assert.equal(router.modules[1].title, 'The Copied Dictionary Syndrome');

  router.setLanguage('es');
  assert.equal(router.currentLanguage, 'es');
  assert.equal(router.modules[0].title, 'Introducción al Programa Metodológico');
  assert.equal(router.modules[1].title, 'El Síndrome del Diccionario Copiado');
});

test('i18n - Simetría y Resolución de Activos Visuales (SVG) entre ES y EN', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const SCORM_DIR = path.resolve(__dirname, '..');

  const modulesEs = getModulesData('es');
  const modulesEn = getModulesData('en');

  // Verificar challenges con visualAsset
  for (let i = 0; i < 6; i++) {
    const assetEs = modulesEs[i].challenge?.visualAsset;
    const assetEn = modulesEn[i].challenge?.visualAsset;

    if (assetEs) {
      assert.ok(assetEn, `Módulo ${i} EN debe tener visualAsset si ES lo tiene`);
      assert.ok(!assetEs.src.endsWith('-en.svg'), `Módulo ${i} ES visualAsset no debe apuntar a -en.svg (${assetEs.src})`);
      assert.ok(assetEn.src.endsWith('-en.svg'), `Módulo ${i} EN visualAsset debe apuntar a -en.svg (${assetEn.src})`);

      assert.ok(fs.existsSync(path.join(SCORM_DIR, assetEs.src)), `Archivo ES ${assetEs.src} debe existir en disco`);
      assert.ok(fs.existsSync(path.join(SCORM_DIR, assetEn.src)), `Archivo EN ${assetEn.src} debe existir en disco`);
    }
  }

  // Verificar teoría
  const theoryEs = getTheoryData('es');
  const theoryEn = getTheoryData('en');

  const imgRegex = /<img\s+src="([^"]+)"/g;

  for (const key of Object.keys(theoryEs)) {
    const htmlEs = theoryEs[key].html;
    const htmlEn = theoryEn[key].html;

    const matchesEs = [...htmlEs.matchAll(imgRegex)].map(m => m[1]);
    const matchesEn = [...htmlEn.matchAll(imgRegex)].map(m => m[1]);

    assert.equal(matchesEs.length, matchesEn.length, `Espina ${key} debe tener la misma cantidad de imágenes en ES y EN`);

    for (let j = 0; j < matchesEs.length; j++) {
      const srcEs = matchesEs[j];
      const srcEn = matchesEn[j];

      assert.ok(!srcEs.endsWith('-en.svg'), `Espina ${key} imagen ${srcEs} no debe tener -en.svg`);
      assert.ok(srcEn.endsWith('-en.svg'), `Espina ${key} imagen ${srcEn} debe tener -en.svg`);

      assert.ok(fs.existsSync(path.join(SCORM_DIR, srcEs)), `Archivo ES ${srcEs} debe existir en disco`);
      assert.ok(fs.existsSync(path.join(SCORM_DIR, srcEn)), `Archivo EN ${srcEn} debe existir en disco`);
    }
  }
});

