import test from 'node:test';
import assert from 'node:assert/strict';
import { createCourseStore } from '../js/core/store.js';
import { ScormAdapter } from '../js/core/scorm-adapter.js';

test('CourseStore - Inicialización y estado por defecto', () => {
  const store = createCourseStore();
  const state = store.getState();

  assert.equal(state.currentModule, 0);
  assert.deepEqual(state.completedModules, []);
  assert.deepEqual(state.challengesState, {});
  assert.deepEqual(state.theoryDrawersViewed, []);
  assert.deepEqual(state.capstoneRubric, { c1: false, c2: false, c3: false, c4: false });
  assert.equal(state.finalScore, 0);
  assert.equal(state.courseStatus, 'incomplete');
});

test('CourseStore - Suscripciones reactivas y dispatch de acciones', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  const store = createCourseStore(adapter);

  const events = [];
  const unsubscribe = store.subscribe((newState, action) => {
    events.push({ actionType: action.type, mod: newState.currentModule });
  });

  // Navegar a módulo 1
  store.dispatchAction('NAVIGATE_MODULE', { moduleId: 1 });
  assert.equal(store.getState().currentModule, 1);
  assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-1');

  // Registrar intento fallido de reto
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', {
    moduleId: 'mod-1',
    choiceId: 'opt-copy-paste',
    passed: false,
    feedback: 'Fallo productivo detectado'
  });

  let state = store.getState();
  assert.equal(state.challengesState['mod-1'].attempts, 1);
  assert.equal(state.challengesState['mod-1'].passed, false);
  assert.deepEqual(state.challengesState['mod-1'].choices, ['opt-copy-paste']);

  // Segundo intento exitoso
  store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', {
    moduleId: 'mod-1',
    choiceId: 'opt-alles-formula',
    passed: true,
    feedback: 'Fórmula correcta aplicada'
  });

  state = store.getState();
  assert.equal(state.challengesState['mod-1'].attempts, 2);
  assert.equal(state.challengesState['mod-1'].passed, true);
  assert.equal(state.challengesState['mod-1'].choices.length, 2);

  // Completar módulo
  store.dispatchAction('COMPLETE_MODULE', { moduleId: 1 });
  assert.deepEqual(store.getState().completedModules, [1]);

  unsubscribe();
  // Verificar que ya no recibe eventos
  store.dispatchAction('NAVIGATE_MODULE', { moduleId: 2 });
  assert.equal(events.length, 4); // Navigate 1, Attempt 1, Attempt 2, Complete 1
});

test('CourseStore - Espina Teórica Opcional no penaliza ni aprueba el curso', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  const store = createCourseStore(adapter);

  store.dispatchAction('VIEW_THEORY_DRAWER', {
    moduleId: 'mod-0',
    badgeId: 'badge-iceberg-mcclelland'
  });

  const state = store.getState();
  assert.deepEqual(state.theoryDrawersViewed, ['badge-iceberg-mcclelland']);
  assert.equal(state.courseStatus, 'incomplete');
  assert.equal(adapter.getStatus(), 'incomplete');

  // Verificar que suspend_data del adapter contiene el badge
  const suspendData = adapter.getValue('cmi.suspend_data');
  assert.ok(suspendData.includes('badge-iceberg-mcclelland'));
});

test('CourseStore - Rúbrica Capstone y Certificación 100% Binaria', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  const store = createCourseStore(adapter);

  // 1. Criterio 1 y 2 marcados
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { criterion: 'c1', value: true });
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { criterion: 'c2', value: true });

  let state = store.getState();
  assert.equal(state.capstoneRubric.c1, true);
  assert.equal(state.capstoneRubric.c2, true);
  assert.equal(state.capstoneRubric.c3, false);
  assert.equal(state.finalScore, 50);
  assert.equal(state.courseStatus, 'incomplete');
  assert.equal(adapter.getStatus(), 'incomplete');

  // 2. Cumplimiento total de los 4 criterios binarios (C1, C2, C3, C4)
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', {
    rubric: { c1: true, c2: true, c3: true, c4: true }
  });

  state = store.getState();
  assert.equal(state.finalScore, 100);
  assert.equal(state.courseStatus, 'passed');
  assert.ok(state.completedModules.includes(5));
  assert.equal(adapter.getStatus(), 'passed');
  assert.equal(adapter.getValue('cmi.core.score.raw'), '100');
});

test('CourseStore - Rehidratación desde ScormAdapter existente', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();
  adapter.setValue('cmi.core.lesson_location', 'mod-3');
  adapter.setStatus('passed');

  const store = createCourseStore(adapter);
  const state = store.getState();

  assert.equal(state.currentModule, 3);
  assert.equal(state.courseStatus, 'passed');
  assert.equal(state.finalScore, 100);
});

test('CourseStore - suspend_data cumple estrictamente SPM SCORM 1.2 (<= 4096 caracteres) bajo peor caso', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();
  const store = createCourseStore(adapter);

  // Simulación de peor caso con strings masivos (>200 caracteres) y 100 intentos por cada uno de los 6 módulos
  const massiveSuffix = 'X'.repeat(250);
  for (let m = 0; m <= 5; m++) {
    for (let attempt = 1; attempt <= 100; attempt++) {
      store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', {
        moduleId: `mod-${m}`,
        choiceId: `opt-choice-massive-${m}-${attempt}-${massiveSuffix}`,
        passed: attempt === 100
      });
    }
  }

  // Completa los 6 módulos y 6 actividades con claves masivas
  for (let m = 0; m <= 5; m++) {
    store.dispatchAction('COMPLETE_MODULE', m);
    store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: `activity-massive-identifier-${m}-${massiveSuffix}` });
  }

  // Registra 6 badges teóricos masivos y rúbrica Capstone completa
  for (let m = 0; m <= 5; m++) {
    store.dispatchAction('VIEW_THEORY_DRAWER', { badgeId: `badge-${m}-${massiveSuffix}` });
  }
  store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { rubric: { c1: true, c2: true, c3: true, c4: true } });

  const rawSuspend = adapter.getValue('cmi.suspend_data');
  assert.ok(rawSuspend, 'suspend_data debe existir');
  assert.ok(
    rawSuspend.length <= 4096,
    `suspend_data (${rawSuspend.length} caracteres) debe ser <= 4096 (límite estricto SPM SCORM 1.2)`
  );

  // Verifica rehidratación y fidelidad de los 6 módulos
  const rehydratedStore = createCourseStore(adapter);
  const state = rehydratedStore.getState();

  // 1. Estado y puntuación general
  assert.equal(state.finalScore, 100);
  assert.equal(state.courseStatus, 'passed');
  assert.deepEqual(state.completedModules, [0, 1, 2, 3, 4, 5]);

  // 2. Rúbrica binaria completa
  assert.deepEqual(state.capstoneRubric, { c1: true, c2: true, c3: true, c4: true });

  // 3. Los 6 retos verificados en attempts, passed y acotación defensiva
  for (let m = 0; m <= 5; m++) {
    const ch = state.challengesState[`mod-${m}`];
    assert.ok(ch, `Reto mod-${m} debe estar presente en estado rehidratado`);
    assert.equal(ch.attempts, 100, `Reto mod-${m} debe registrar 100 intentos`);
    assert.equal(ch.passed, true, `Reto mod-${m} debe conservar estado passed=true`);
    assert.ok(ch.choices.length <= 5, `Reto mod-${m} debe acotar choices a máximo 5`);
  }

  // 4. Actividades y badges acotados preservados
  assert.equal(Object.keys(state.activitiesState).length, 6, 'Las 6 actividades deben persistirse');
  assert.equal(state.theoryDrawersViewed.length, 6, 'Los 6 badges teóricos deben persistirse');
});

test('CourseStore - Regresión adversarial: serialización JSON válida y <= 4096 caracteres ante inputs masivos o maliciosos', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();

  // Inyecta en el LMS un suspend_data previo gigantesco (> 10000 caracteres)
  adapter.setValue('cmi.suspend_data', JSON.stringify({
    externalGarbage: 'A'.repeat(12000)
  }));

  const store = createCourseStore(adapter);

  // Inyecta valores adversarios en el estado interno
  store.state.currentModule = 99999;
  store.state.finalScore = 99999999;
  store.state.courseStatus = 'MALICIOUS_STATUS_'.repeat(1000);
  store.state.completedModules = Array.from({ length: 500 }, (_, i) => i);

  // Genera actividades y retos con claves enormes
  for (let i = 0; i < 200; i++) {
    store.state.activitiesState[`fake_act_${i}_` + 'Z'.repeat(100)] = true;
  }
  for (let i = 0; i < 50; i++) {
    store.state.challengesState[`fake_mod_${i}`] = {
      passed: true,
      attempts: 99999,
      choices: ['Y'.repeat(200), 'W'.repeat(200)]
    };
  }

  // Fuerza sincronización SCORM
  store.dispatchAction('SYNC_SCORM');

  const rawSuspend = adapter.getValue('cmi.suspend_data');
  assert.ok(rawSuspend, 'suspend_data debe existir');
  assert.ok(
    rawSuspend.length <= 4096,
    `suspend_data adversarial (${rawSuspend.length} caracteres) debe ser <= 4096 caracteres`
  );

  // Verificación crítica: el JSON debe ser 100% válido sintácticamente (cero truncado ciego)
  let parsed;
  assert.doesNotThrow(() => {
    parsed = JSON.parse(rawSuspend);
  }, 'El suspend_data serializado bajo condiciones adversariales debe parsear limpiamente como JSON');

  assert.ok(parsed && parsed.courseStoreState, 'Debe contener courseStoreState');
  assert.equal(parsed.courseStoreState.currentModule, 5, 'currentModule debe quedar clamped a 5');
  assert.equal(parsed.courseStoreState.finalScore, 100, 'finalScore debe quedar clamped a 100');
  assert.equal(parsed.courseStoreState.courseStatus, 'incomplete', 'courseStatus debe ser normalizado a incomplete');
  assert.ok(Array.isArray(parsed.courseStoreState.completedModules), 'completedModules debe ser array');
  assert.ok(parsed.courseStoreState.completedModules.length <= 6, 'completedModules no debe exceder 6 módulos');
});

test('CourseStore - Normaliza suspend_data previo escalar o array y clampa lesson_location', () => {
  // 1. Escalar string previo
  const adapterString = new ScormAdapter({ windowObj: null, storage: null });
  adapterString.init();
  adapterString.setValue('cmi.suspend_data', JSON.stringify("texto_arbitrario_escalar"));
  const storeString = createCourseStore(adapterString);
  storeString.state.currentModule = 999999;
  assert.doesNotThrow(() => {
    storeString.dispatchAction('SYNC_SCORM');
  }, 'No debe arrojar excepción ante suspend_data escalar');
  assert.equal(adapterString.getValue('cmi.core.lesson_location'), 'mod-5', 'lesson_location debe clampearse a mod-5');
  const parsedString = JSON.parse(adapterString.getValue('cmi.suspend_data'));
  assert.ok(parsedString && parsedString.courseStoreState, 'Debe normalizar a objeto con courseStoreState');

  // 2. Escalar número previo
  const adapterNum = new ScormAdapter({ windowObj: null, storage: null });
  adapterNum.init();
  adapterNum.setValue('cmi.suspend_data', JSON.stringify(12345));
  const storeNum = createCourseStore(adapterNum);
  storeNum.state.currentModule = -10;
  assert.doesNotThrow(() => {
    storeNum.dispatchAction('SYNC_SCORM');
  }, 'No debe arrojar excepción ante suspend_data numérico');
  assert.equal(adapterNum.getValue('cmi.core.lesson_location'), 'mod-0', 'lesson_location debe clampearse a mod-0');

  // 3. Array previo
  const adapterArray = new ScormAdapter({ windowObj: null, storage: null });
  adapterArray.init();
  adapterArray.setValue('cmi.suspend_data', JSON.stringify([1, 2, 3, "item"]));
  const storeArray = createCourseStore(adapterArray);
  assert.doesNotThrow(() => {
    storeArray.dispatchAction('SYNC_SCORM');
  }, 'No debe arrojar excepción ante suspend_data array');
  const parsedArray = JSON.parse(adapterArray.getValue('cmi.suspend_data'));
  assert.ok(parsedArray && typeof parsedArray === 'object' && !Array.isArray(parsedArray), 'Debe normalizarse a objeto plano');
});
test('CourseStore - Clampea inmediatamente lesson_location en rehidratación y sincroniza con el LMS', () => {
  const adapterOverflow = new ScormAdapter({ windowObj: null, storage: null });
  adapterOverflow.init();
  adapterOverflow.setValue('cmi.core.lesson_location', 'mod-999999');

  const store = createCourseStore(adapterOverflow);
  assert.equal(store.getState().currentModule, 5, 'Debe clampar currentModule a 5 en rehidratación');
  assert.equal(adapterOverflow.getValue('cmi.core.lesson_location'), 'mod-5', 'Debe persistir mod-5 inmediatamente en el LMS');

  const adapterUnderflow = new ScormAdapter({ windowObj: null, storage: null });
  adapterUnderflow.init();
  adapterUnderflow.setValue('cmi.core.lesson_location', 'mod--42');

  const storeUnderflow = createCourseStore(adapterUnderflow);
  assert.equal(storeUnderflow.getState().currentModule, 0, 'Debe clampar currentModule a 0 en rehidratación negativa');
  assert.equal(adapterUnderflow.getValue('cmi.core.lesson_location'), 'mod-0', 'Debe persistir mod-0 inmediatamente en el LMS');
});

test('CourseStore - Clampea internamente currentModule ante dispatchAction NAVIGATE_MODULE inválido', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();
  const store = createCourseStore(adapter);

  // Navegación con overflow
  store.dispatchAction('NAVIGATE_MODULE', 999999);
  assert.equal(store.getState().currentModule, 5, 'state.currentModule debe quedar clampado en 5');
  assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-5', 'LMS debe recibir mod-5');

  // Navegación con underflow
  store.dispatchAction('NAVIGATE_MODULE', -99);
  assert.equal(store.getState().currentModule, 0, 'state.currentModule debe quedar clampado en 0');
  assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-0', 'LMS debe recibir mod-0');

  // Navegación con objeto inválido
  store.dispatchAction('NAVIGATE_MODULE', { moduleId: 'invalido' });
  assert.equal(store.getState().currentModule, 0, 'state.currentModule debe quedar en 0 ante NaN');
});

test('CourseStore - Status completed previo no se promueve a passed ni regala finalScore=100', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();
  adapter.setValue('cmi.core.lesson_status', 'completed');

  const store = createCourseStore(adapter);
  assert.equal(store.getState().courseStatus, 'completed', 'courseStatus debe ser completed');
  assert.equal(store.getState().finalScore, 0, 'finalScore no debe ser 100 sin rubric passed');
});
