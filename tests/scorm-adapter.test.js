import test from 'node:test';
import assert from 'node:assert/strict';
import { ScormAdapter } from '../js/core/scorm-adapter.js';

test('ScormAdapter - Fallback / Standalone Mode (In-Memory)', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  assert.equal(adapter.init(), true);
  assert.equal(adapter.version, 'fallback');

  assert.equal(adapter.getStatus(), 'incomplete');

  // Asignar y leer valores genéricos
  adapter.setValue('cmi.core.lesson_location', 'mod-1');
  assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-1');

  // Status y Score
  adapter.setScore(95, 0, 100);
  assert.equal(adapter.getValue('cmi.core.score.raw'), '95');

  adapter.setStatus('passed');
  assert.equal(adapter.getStatus(), 'passed');

  // Telemetría opcional en suspend_data sin alterar score o status
  adapter.recordTheoreticalExploration('mod-0', 'badge-mcclelland-iceberg');
  const suspendRaw = adapter.getValue('cmi.suspend_data');
  assert.ok(suspendRaw.includes('badge-mcclelland-iceberg'));
  assert.equal(adapter.getStatus(), 'passed');
  assert.equal(adapter.getValue('cmi.core.score.raw'), '95');

  // No duplicación de badges
  adapter.recordTheoreticalExploration('mod-0', 'badge-mcclelland-iceberg');
  const parsed = JSON.parse(adapter.getValue('cmi.suspend_data'));
  assert.equal(parsed.theoryExplored.length, 1);

  assert.equal(adapter.finish(), true);
});

test('ScormAdapter - Fallback con Mock Storage', () => {
  const mockStorageMap = {};
  const mockStorage = {
    getItem(k) { return mockStorageMap[k] || null; },
    setItem(k, v) { mockStorageMap[k] = String(v); },
    removeItem(k) { delete mockStorageMap[k]; }
  };

  const adapter1 = new ScormAdapter({ windowObj: null, storage: mockStorage });
  adapter1.init();
  adapter1.setValue('cmi.core.lesson_location', 'mod-2');
  adapter1.setStatus('incomplete');
  adapter1.commit();

  // Instanciar segundo adapter sobre el mismo storage
  const adapter2 = new ScormAdapter({ windowObj: null, storage: mockStorage });
  adapter2.init();
  assert.equal(adapter2.getValue('cmi.core.lesson_location'), 'mod-2');
  assert.equal(adapter2.getStatus(), 'incomplete');
});

test('ScormAdapter - SCORM 1.2 LMS API Integration', () => {
  const lmsStore = {};
  let committed = false;
  let finished = false;

  const mockApi12 = {
    LMSInitialize(arg) { return 'true'; },
    LMSGetValue(key) { return lmsStore[key] || ''; },
    LMSSetValue(key, val) { lmsStore[key] = String(val); return 'true'; },
    LMSCommit(arg) { committed = true; return 'true'; },
    LMSFinish(arg) { finished = true; return 'true'; }
  };

  const mockWin = { API: mockApi12 };
  const adapter = new ScormAdapter({ windowObj: mockWin });

  assert.equal(adapter.init(), true);
  assert.equal(adapter.version, '1.2');

  adapter.setValue('cmi.core.lesson_location', 'mod-3');
  assert.equal(lmsStore['cmi.core.lesson_location'], 'mod-3');

  adapter.setStatus('passed');
  assert.equal(lmsStore['cmi.core.lesson_status'], 'passed');
  assert.equal(adapter.getStatus(), 'passed');

  adapter.setScore(100, 0, 100);
  assert.equal(lmsStore['cmi.core.score.raw'], '100');

  adapter.recordTheoreticalExploration('mod-2', 'badge-elliott-jaques');
  assert.ok(lmsStore['cmi.suspend_data'].includes('badge-elliott-jaques'));
  assert.equal(lmsStore['cmi.core.lesson_status'], 'passed'); // No muta status

  assert.equal(committed, true);
  assert.equal(adapter.finish(), true);
  assert.equal(finished, true);
});

test('ScormAdapter - SCORM 2004 LMS API Integration', () => {
  const lms2004Store = {};
  let committed2004 = false;
  let terminated2004 = false;

  const mockApi2004 = {
    Initialize(arg) { return 'true'; },
    GetValue(key) { return lms2004Store[key] || ''; },
    SetValue(key, val) { lms2004Store[key] = String(val); return 'true'; },
    Commit(arg) { committed2004 = true; return 'true'; },
    Terminate(arg) { terminated2004 = true; return 'true'; }
  };

  const mockWin = { API_1484_11: mockApi2004 };
  const adapter = new ScormAdapter({ windowObj: mockWin });

  assert.equal(adapter.init(), true);
  assert.equal(adapter.version, '2004');

  adapter.setStatus('passed');
  assert.equal(lms2004Store['cmi.success_status'], 'passed');
  assert.equal(lms2004Store['cmi.completion_status'], 'completed');
  assert.equal(adapter.getStatus(), 'passed');

  adapter.setScore(80, 0, 100);
  assert.equal(lms2004Store['cmi.score.raw'], '80');
  assert.equal(lms2004Store['cmi.score.scaled'], '0.80');

  adapter.finish();
  assert.equal(terminated2004, true);
});

test('ScormAdapter - Resiliencia ante SecurityError en localStorage (file:// sandboxed)', () => {
  const restrictedWin = {
    get localStorage() {
      throw new Error('SecurityError: Failed to read the localStorage property from Window: Access is denied for this document.');
    }
  };

  assert.doesNotThrow(() => {
    const adapter = new ScormAdapter({ windowObj: restrictedWin });
    assert.equal(adapter.init(), true);
    assert.equal(adapter.version, 'fallback');
    adapter.setValue('cmi.core.lesson_location', 'mod-1');
    assert.equal(adapter.getValue('cmi.core.lesson_location'), 'mod-1');
    adapter.commit();
  });
});

test('ScormAdapter - Cálculo y persistencia de session_time en SCORM 1.2 y 2004', () => {
  const lms12 = {};
  const mockApi12 = {
    LMSInitialize() { return 'true'; },
    LMSGetValue(k) { return lms12[k] || ''; },
    LMSSetValue(k, v) { lms12[k] = String(v); return 'true'; },
    LMSCommit() { return 'true'; },
    LMSFinish() { return 'true'; }
  };
  const adapter12 = new ScormAdapter({ windowObj: { API: mockApi12 } });
  adapter12.init();
  adapter12.sessionStartTime = Date.now() - 65000;
  adapter12.commit();
  assert.match(lms12['cmi.core.session_time'], /^00:01:0[4-9]$/);

  // SCORM 2004
  const lms2004 = {};
  const mockApi2004 = {
    Initialize() { return 'true'; },
    GetValue(k) { return lms2004[k] || ''; },
    SetValue(k, v) { lms2004[k] = String(v); return 'true'; },
    Commit() { return 'true'; },
    Terminate() { return 'true'; }
  };
  const adapter2004 = new ScormAdapter({ windowObj: { API_1484_11: mockApi2004 } });
  adapter2004.init();
  adapter2004.sessionStartTime = Date.now() - 3661000;
  adapter2004.setStatus('completed');
  assert.equal(lms2004['cmi.completion_status'], 'completed');
  assert.equal(lms2004['cmi.success_status'], 'unknown');
  adapter2004.finish();
  assert.match(lms2004['cmi.session_time'], /^PT1H1M[0-9]+S$/);
});

test('ScormAdapter - Gestión y persistencia de cmi.core.exit y cmi.exit = suspend en SCORM 1.2 y 2004', () => {
  // SCORM 1.2: Regresión con exit previo no vacío ('logout'/'normal')
  const lms12 = {};
  const mockApi12 = {
    LMSInitialize() { return 'true'; },
    LMSGetValue(k) { return lms12[k] || ''; },
    LMSSetValue(k, v) { lms12[k] = String(v); return 'true'; },
    LMSCommit() { return 'true'; },
    LMSFinish() { return 'true'; }
  };
  const adapter12 = new ScormAdapter({ windowObj: { API: mockApi12 } });
  adapter12.init();
  assert.equal(lms12['cmi.core.exit'], 'suspend', 'SCORM 1.2 debe iniciar con exit=suspend');
  
  // Asignar valor arbitrario no vacío
  lms12['cmi.core.exit'] = 'logout';
  assert.equal(lms12['cmi.core.exit'], 'logout');
  adapter12.commit();
  assert.equal(lms12['cmi.core.exit'], 'suspend', 'commit() debe forzar incondicionalmente exit=suspend');

  lms12['cmi.core.exit'] = 'normal';
  adapter12.finish();
  assert.equal(lms12['cmi.core.exit'], 'suspend', 'finish() debe forzar incondicionalmente exit=suspend');

  // SCORM 2004: Regresión con exit previo no vacío
  const lms2004 = {};
  const mockApi2004 = {
    Initialize() { return 'true'; },
    GetValue(k) { return lms2004[k] || ''; },
    SetValue(k, v) { lms2004[k] = String(v); return 'true'; },
    Commit() { return 'true'; },
    Terminate() { return 'true'; }
  };
  const adapter2004 = new ScormAdapter({ windowObj: { API_1484_11: mockApi2004 } });
  adapter2004.init();
  assert.equal(lms2004['cmi.exit'], 'suspend', 'SCORM 2004 debe iniciar con exit=suspend');

  lms2004['cmi.exit'] = 'normal';
  adapter2004.commit();
  assert.equal(lms2004['cmi.exit'], 'suspend', 'commit() 2004 debe forzar exit=suspend');

  lms2004['cmi.exit'] = 'logout';
  adapter2004.finish();
  assert.equal(lms2004['cmi.exit'], 'suspend', 'finish() 2004 debe forzar exit=suspend');

  // Fallback in-memory
  const adapterFallback = new ScormAdapter({ windowObj: null, storage: null });
  adapterFallback.init();
  assert.equal(adapterFallback.getExit(), 'suspend');
  adapterFallback.setValue('cmi.core.exit', 'logout');
  adapterFallback.commit();
  assert.equal(adapterFallback.getExit(), 'suspend', 'commit() fallback debe forzar suspend');
  adapterFallback.setValue('cmi.core.exit', 'normal');
  adapterFallback.finish();
  assert.equal(adapterFallback.getExit(), 'suspend', 'finish() fallback debe forzar suspend');
});

test('ScormAdapter - recordTheoreticalExploration cumple límite <= 4096 caracteres bajo estrés adversarial', () => {
  const adapter = new ScormAdapter({ windowObj: null, storage: null });
  adapter.init();

  // Inyecta suspend_data previo con courseStoreState
  adapter.setValue('cmi.suspend_data', JSON.stringify({
    courseStoreState: { currentModule: 2, completedModules: [0, 1] }
  }));

  // Dispara 50 registros de badges con identificadores masivos
  const massiveId = 'MOD_MASIVO_' + 'B'.repeat(300);
  const massiveBadge = 'BADGE_MASIVO_' + 'Z'.repeat(300);
  for (let i = 0; i < 50; i++) {
    adapter.recordTheoreticalExploration(`${massiveId}_${i}`, `${massiveBadge}_${i}`);
  }

  const rawSuspend = adapter.getValue('cmi.suspend_data');
  assert.ok(rawSuspend, 'suspend_data debe existir');
  assert.ok(
    rawSuspend.length <= 4096,
    `suspend_data post recordTheoreticalExploration (${rawSuspend.length} caracteres) debe ser <= 4096 caracteres`
  );

  let parsed;
  assert.doesNotThrow(() => {
    parsed = JSON.parse(rawSuspend);
  }, 'Debe parsear limpiamente como JSON');

  assert.ok(parsed.courseStoreState, 'Debe conservar courseStoreState previo');
  assert.ok(Array.isArray(parsed.theoryExplored), 'Debe contener array theoryExplored');
  assert.ok(parsed.theoryExplored.length <= 6, 'theoryExplored debe estar acotado a máximo 6');
});

test('ScormAdapter - Distingue estrictamente completed de passed en SCORM 1.2 y 2004', () => {
  // SCORM 1.2
  const adapter12 = new ScormAdapter({ windowObj: null, storage: null });
  adapter12.init();
  adapter12.setStatus('completed');
  assert.equal(adapter12.getStatus(), 'completed', 'SCORM 1.2 debe retornar completed');

  // SCORM 2004
  let lms2004 = {};
  const mockApi2004 = {
    Initialize: () => 'true',
    Terminate: () => 'true',
    GetValue: (k) => lms2004[k] || '',
    SetValue: (k, v) => { lms2004[k] = String(v); return 'true'; },
    Commit: () => 'true',
    GetLastError: () => '0',
    GetDiagnostic: () => ''
  };
  const adapter2004 = new ScormAdapter({ windowObj: { API_1484_11: mockApi2004 } });
  adapter2004.init();
  adapter2004.setStatus('completed');
  assert.equal(adapter2004.getStatus(), 'completed', 'SCORM 2004 debe retornar completed cuando success_status es unknown');
  assert.equal(lms2004['cmi.completion_status'], 'completed');
  assert.equal(lms2004['cmi.success_status'], 'unknown');

  adapter2004.setStatus('passed');
  assert.equal(adapter2004.getStatus(), 'passed', 'SCORM 2004 debe retornar passed únicamente cuando success_status es passed');
});

test('ScormAdapter - Resiliencia y degradación a fallback ante excepciones en LMS API (gateway seguro)', () => {
  // 1. Excepción en LMSInitialize (SCORM 1.2)
  const faultyInitApi12 = {
    LMSInitialize() { throw new Error('SecurityError: Blocked frame from accessing cross-origin'); }
  };
  const adapterInit12 = new ScormAdapter({ windowObj: { API: faultyInitApi12 } });
  assert.doesNotThrow(() => adapterInit12.init());
  assert.equal(adapterInit12.version, 'fallback');

  // 2. Excepción en Initialize (SCORM 2004)
  const faultyInitApi2004 = {
    Initialize() { throw new Error('LMS disconnected'); }
  };
  const adapterInit2004 = new ScormAdapter({ windowObj: { API_1484_11: faultyInitApi2004 } });
  assert.doesNotThrow(() => adapterInit2004.init());
  assert.equal(adapterInit2004.version, 'fallback');

  // 3. Excepción en LMSGetValue
  const faultyGetApi = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => { throw new Error('API failure on get'); },
    LMSSetValue: () => 'true',
    LMSCommit: () => 'true',
    LMSFinish: () => 'true'
  };
  const adapterGet = new ScormAdapter({ windowObj: { API: faultyGetApi } });
  adapterGet.init();
  assert.equal(adapterGet.version, '1.2');
  let val;
  assert.doesNotThrow(() => { val = adapterGet.getValue('cmi.core.lesson_location'); });
  assert.equal(val, '');
  assert.equal(adapterGet.version, 'fallback');

  // 4. Excepción en LMSSetValue
  let setCallCount = 0;
  const faultySetApi = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => '',
    LMSSetValue: () => {
      setCallCount++;
      if (setCallCount > 1) {
        throw new Error('API failure on set');
      }
      return 'true';
    },
    LMSCommit: () => 'true',
    LMSFinish: () => 'true'
  };
  const adapterSet = new ScormAdapter({ windowObj: { API: faultySetApi } });
  adapterSet.init();
  assert.equal(adapterSet.version, '1.2');
  let setResult;
  assert.doesNotThrow(() => { setResult = adapterSet.setValue('cmi.core.lesson_location', 'mod-1'); });
  assert.equal(setResult, false);
  assert.equal(adapterSet.version, 'fallback');

  // 5. Excepción en LMSCommit
  const faultyCommitApi = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => '',
    LMSSetValue: () => 'true',
    LMSCommit: () => { throw new Error('Commit failed'); },
    LMSFinish: () => 'true'
  };
  const adapterCommit = new ScormAdapter({ windowObj: { API: faultyCommitApi } });
  adapterCommit.init();
  let commitRes;
  assert.doesNotThrow(() => { commitRes = adapterCommit.commit(); });
  assert.equal(commitRes, false);
  assert.equal(adapterCommit.version, 'fallback');

  // 6. Excepción en LMSFinish
  const faultyFinishApi = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => '',
    LMSSetValue: () => 'true',
    LMSCommit: () => 'true',
    LMSFinish: () => { throw new Error('Finish failed'); }
  };
  const adapterFinish = new ScormAdapter({ windowObj: { API: faultyFinishApi } });
  adapterFinish.init();
  let finishRes;
  assert.doesNotThrow(() => { finishRes = adapterFinish.finish(); });
  assert.equal(finishRes, false);
  assert.equal(adapterFinish.version, 'fallback');
});

test('ScormAdapter - Validación estricta de SPM para suspend_data en SCORM 1.2, 2004 y Fallback', () => {
  // SCORM 1.2
  const mockApi12 = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => '',
    LMSSetValue: (k, v) => 'true',
    LMSCommit: () => 'true',
    LMSFinish: () => 'true'
  };
  const adapter12 = new ScormAdapter({ windowObj: { API: mockApi12 } });
  adapter12.init();
  assert.equal(adapter12.version, '1.2');

  const valid12 = 'A'.repeat(4096);
  assert.equal(adapter12.setValue('cmi.suspend_data', valid12), true, 'SCORM 1.2 debe aceptar <= 4096 caracteres');

  const invalid12 = 'A'.repeat(4097);
  assert.equal(adapter12.setValue('cmi.suspend_data', invalid12), false, 'SCORM 1.2 debe rechazar > 4096 caracteres');

  // Fallback
  const adapterFallback = new ScormAdapter({ windowObj: null, storage: null });
  adapterFallback.init();
  assert.equal(adapterFallback.version, 'fallback');
  assert.equal(adapterFallback.setValue('cmi.suspend_data', valid12), true, 'Fallback debe aceptar <= 4096 caracteres');
  assert.equal(adapterFallback.setValue('cmi.suspend_data', invalid12), false, 'Fallback debe rechazar > 4096 caracteres');

  // SCORM 2004
  const mockApi2004 = {
    Initialize: () => 'true',
    GetValue: () => '',
    SetValue: (k, v) => 'true',
    Commit: () => 'true',
    Terminate: () => 'true'
  };
  const adapter2004 = new ScormAdapter({ windowObj: { API_1484_11: mockApi2004 } });
  adapter2004.init();
  assert.equal(adapter2004.version, '2004');

  const valid2004 = 'B'.repeat(5000);
  assert.equal(adapter2004.setValue('cmi.suspend_data', valid2004), true, 'SCORM 2004 debe aceptar 5000 caracteres');

  const invalid2004 = 'B'.repeat(64001);
  assert.equal(adapter2004.setValue('cmi.suspend_data', invalid2004), false, 'SCORM 2004 debe rechazar > 64000 caracteres');
});

test('ScormAdapter - Degradación a fallback y preservación local ante retornos "false" del LMS', () => {
  // 1. SCORM 1.2: LMSSetValue retorna "false"
  let setCalls = 0;
  const rejectApi12 = {
    LMSInitialize: () => 'true',
    LMSGetValue: () => '',
    LMSSetValue: () => {
      setCalls++;
      if (setCalls > 1) return 'false';
      return 'true';
    },
    LMSCommit: () => 'true',
    LMSFinish: () => 'true'
  };
  const mockStorageMap = {};
  const mockStorage = {
    getItem: (k) => mockStorageMap[k] || null,
    setItem: (k, v) => { mockStorageMap[k] = String(v); }
  };
  const adapter12 = new ScormAdapter({ windowObj: { API: rejectApi12 }, storage: mockStorage });
  adapter12.init();
  assert.equal(adapter12.version, '1.2');

  const res12 = adapter12.setValue('cmi.core.lesson_location', 'mod-3');
  assert.equal(res12, false, 'Debe retornar false ante rechazo del LMS');
  assert.equal(adapter12.version, 'fallback', 'Debe degradar a fallback');
  assert.equal(adapter12.getValue('cmi.core.lesson_location'), 'mod-3', 'Debe conservar el valor en memoria tras degradación');
  assert.ok(mockStorageMap['SCORM_COURSE_ALLES_LOCAL_DATA'], 'Debe haber persistido en fallback storage');

  // 2. SCORM 2004: Commit retorna "false"
  const rejectCommitApi2004 = {
    Initialize: () => 'true',
    GetValue: () => '',
    SetValue: () => 'true',
    Commit: () => 'false',
    Terminate: () => 'true'
  };
  const adapter2004 = new ScormAdapter({ windowObj: { API_1484_11: rejectCommitApi2004 } });
  adapter2004.init();
  assert.equal(adapter2004.version, '2004');
  const commitRes = adapter2004.commit();
  assert.equal(commitRes, false, 'Commit debe retornar false ante rechazo del LMS');
  assert.equal(adapter2004.version, 'fallback', 'Debe degradar a fallback tras fallo en Commit');

  // 3. SCORM 2004: Terminate retorna "false"
  const rejectTermApi2004 = {
    Initialize: () => 'true',
    GetValue: () => '',
    SetValue: () => 'true',
    Commit: () => 'true',
    Terminate: () => 'false'
  };
  const adapterTerm2004 = new ScormAdapter({ windowObj: { API_1484_11: rejectTermApi2004 } });
  adapterTerm2004.init();
  assert.equal(adapterTerm2004.version, '2004');
  const termRes = adapterTerm2004.finish();
  assert.equal(termRes, false, 'Finish debe retornar false ante rechazo de Terminate en el LMS');
  assert.equal(adapterTerm2004.version, 'fallback', 'Debe degradar a fallback tras fallo en Terminate');
});
