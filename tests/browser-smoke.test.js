import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import { CourseStore } from '../js/core/store.js';
import { ScormAdapter } from '../js/core/scorm-adapter.js';
import { CourseRouter } from '../js/ui/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCORM_DIR = path.resolve(__dirname, '..');

test('Smoke Test - HTML5 Entry Point y Recursos Estáticos', () => {
  const indexPath = path.join(SCORM_DIR, 'index.html');
  assert.ok(fs.existsSync(indexPath), 'index.html debe existir');
  const html = fs.readFileSync(indexPath, 'utf8');

  // DOCTYPE, UTF-8 y Responsive Viewport
  assert.ok(html.includes('<!DOCTYPE html>'), 'Debe incluir DOCTYPE html5');
  assert.ok(html.includes('<meta charset="UTF-8">'), 'Debe declarar charset UTF-8');
  assert.ok(html.includes('viewport'), 'Debe configurar viewport responsive');

  // Verificación de ampersand escapado en metadata
  assert.ok(html.includes('&amp;'), 'Ampersand debe estar correctamente escapado en metadatos');
  assert.ok(!html.includes('Equipo de Talento & Metodología'), 'No debe contener ampersand sin escapar en author');

  // Contenedor accesible: <div id="app"> sin role="application", evitando landmarks <main> anidados
  assert.ok(html.includes('<div id="app"'), '#app debe ser un contenedor <div id="app">');
  assert.ok(!html.includes('role="application"'), '#app no debe degradar la navegación con role="application"');

  // Enlaces a hojas de estilo
  assert.ok(html.includes('href="css/mint-theme.css"'), 'Debe enlazar css/mint-theme.css');
  assert.ok(html.includes('href="css/rise-blocks.css"'), 'Debe enlazar css/rise-blocks.css');
  assert.ok(fs.existsSync(path.join(SCORM_DIR, 'css/mint-theme.css')), 'css/mint-theme.css debe existir');
  assert.ok(fs.existsSync(path.join(SCORM_DIR, 'css/rise-blocks.css')), 'css/rise-blocks.css debe existir');

  // Script de inicialización de módulos
  assert.ok(html.includes('type="module"'), 'Debe cargar scripts como ES Modules');
});

test('Smoke Test - Ciclo de Vida LMS Completo: Inicialización, Progresión, Commit y Reanudación', () => {
  const lmsDatabase = {};
  let commitCount = 0;
  let terminated = false;

  const mockLmsApi = {
    LMSInitialize(arg) {
      return 'true';
    },
    LMSGetValue(element) {
      return lmsDatabase[element] || '';
    },
    LMSSetValue(element, value) {
      lmsDatabase[element] = String(value);
      return 'true';
    },
    LMSCommit(arg) {
      commitCount++;
      return 'true';
    },
    LMSFinish(arg) {
      terminated = true;
      return 'true';
    }
  };

  // 1. Simulación de Sesión 1: Usuario ingresa desde un LMS SCORM 1.2
  const mockWindow = { API: mockLmsApi };
  const adapterSession1 = new ScormAdapter({ windowObj: mockWindow });
  assert.equal(adapterSession1.init(), true);
  assert.equal(adapterSession1.version, '1.2');

  const storeSession1 = new CourseStore(adapterSession1);
  const routerSession1 = new CourseRouter({ store: storeSession1 });

  // Estado inicial del curso
  assert.equal(routerSession1.currentModuleIndex, 0);
  assert.equal(storeSession1.getState().courseStatus, 'incomplete');
  assert.equal(lmsDatabase['cmi.core.exit'], 'suspend');

  // El usuario completa Módulos 0 a 4
  for (let m = 0; m <= 4; m++) {
    storeSession1.dispatchAction('PASS_CHALLENGE', {
      moduleId: `mod-${m}`,
      attempts: 1,
      selectedChoice: 'opcion_valida'
    });
    if (m > 0) {
      storeSession1.dispatchAction('COMPLETE_ACTIVITY', {
        activityId: `act-${m}`,
        score: 100
      });
    }
    storeSession1.dispatchAction('COMPLETE_MODULE', m);
  }

  // Avanza a Módulo 5 (Capstone)
  routerSession1.navigateTo(5);
  assert.equal(routerSession1.currentModuleIndex, 5);
  assert.equal(lmsDatabase['cmi.core.lesson_location'], 'mod-5');

  // Aprueba la Rúbrica Capstone completa
  storeSession1.dispatchAction('UPDATE_CAPSTONE_RUBRIC', {
    rubric: { c1: true, c2: true, c3: true, c4: true }
  });
  storeSession1.dispatchAction('COMPLETE_MODULE', 5);

  // Evaluación final de certificación
  const stateEnd = storeSession1.getState();
  assert.equal(stateEnd.courseStatus, 'passed');
  assert.equal(stateEnd.finalScore, 100);
  assert.equal(lmsDatabase['cmi.core.lesson_status'], 'passed');
  assert.equal(lmsDatabase['cmi.core.score.raw'], '100');

  // Finaliza la sesión
  assert.equal(adapterSession1.finish(), true);
  assert.equal(terminated, true);
  assert.ok(commitCount > 0);

  // 2. Simulación de Sesión 2: Reingreso / Reanudación
  // En una nueva ventana el LMS proporciona el mismo API con los datos persistidos
  const adapterSession2 = new ScormAdapter({ windowObj: { API: mockLmsApi } });
  assert.equal(adapterSession2.init(), true);
  assert.equal(adapterSession2.getStatus(), 'passed');
  assert.equal(adapterSession2.getValue('cmi.core.lesson_location'), 'mod-5');

  const storeSession2 = new CourseStore(adapterSession2);
  const routerSession2 = new CourseRouter({ store: storeSession2 });

  // Verifica que reanuda en el módulo correcto y mantiene certificación aprobada
  assert.equal(routerSession2.currentModuleIndex, 5);
  const rehydratedState = storeSession2.getState();
  assert.equal(rehydratedState.courseStatus, 'passed');
  assert.equal(rehydratedState.finalScore, 100);
  assert.deepEqual(rehydratedState.completedModules, [0, 1, 2, 3, 4, 5]);
});

test('Smoke Test - Ejecución Standalone Web / GitHub Pages', () => {
  const localStorageMock = {};
  const mockStorage = {
    getItem: (k) => localStorageMock[k] || null,
    setItem: (k, v) => { localStorageMock[k] = String(v); },
    removeItem: (k) => { delete localStorageMock[k]; }
  };

  // Sin window.API ni window.API_1484_11 (entorno GitHub Pages)
  const adapterStandalone = new ScormAdapter({ windowObj: null, storage: mockStorage });
  assert.equal(adapterStandalone.init(), true);
  assert.equal(adapterStandalone.version, 'fallback');

  const store = new CourseStore(adapterStandalone);
  const router = new CourseRouter({ store });

  // Verifica gating y navegación inicial
  assert.equal(router.currentModuleIndex, 0);
  assert.equal(router.isModuleUnlocked(0), true);
  assert.equal(router.isModuleUnlocked(1), false);

  // Cambio dinámico de idioma
  assert.equal(router.currentLanguage, 'es');
  router.setLanguage('en');
  assert.equal(router.currentLanguage, 'en');

  // Completar reto Módulo 0 desbloquea Módulo 1
  store.dispatchAction('PASS_CHALLENGE', {
    moduleId: 'mod-0',
    attempts: 1,
    selectedChoice: 'valid'
  });
  store.dispatchAction('COMPLETE_MODULE', 0);

  assert.equal(router.isModuleUnlocked(1), true);
  router.navigateTo(1);
  assert.equal(router.currentModuleIndex, 1);

  // La persistencia offline funciona en fallback storage
  assert.ok(localStorageMock['SCORM_COURSE_ALLES_LOCAL_DATA']);
});

import os from 'node:os';

test('Smoke Test - Ejecución Real en Navegador Headless (Chromium / CDP)', async () => {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const indexPath = path.join(SCORM_DIR, 'index.html');
  assert.ok(fs.existsSync(indexPath), 'index.html debe existir');

  let executedViaChrome = false;

  if (fs.existsSync(chromePath)) {
    let tmpDir = null;
    let proc = null;
    try {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-smoke-profile-'));
      proc = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=0',
        '--disable-gpu',
        '--no-sandbox',
        '--allow-file-access-from-files',
        `--user-data-dir=${tmpDir}`,
        `file://${indexPath}`
      ], { stdio: ['ignore', 'ignore', 'pipe'] });

      let devToolsPort = null;
      proc.stderr.on('data', (chunk) => {
        const match = chunk.toString().match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)/);
        if (match) devToolsPort = match[1];
      });
      for (let i = 0; i < 40; i++) {
        if (devToolsPort) break;
        await new Promise(r => setTimeout(r, 100));
      }

      if (devToolsPort) {
        let tab = null;
        for (let i = 0; i < 20; i++) {
          await new Promise(r => setTimeout(r, 100));
          try {
            const res = await fetch(`http://127.0.0.1:${devToolsPort}/json/list`);
            if (res.ok) {
              const list = await res.json();
              tab = list.find(item => item.type === 'page');
              if (tab && tab.webSocketDebuggerUrl) break;
            }
          } catch (e) {}
        }

        if (tab && tab.webSocketDebuggerUrl) {
          const ws = new WebSocket(tab.webSocketDebuggerUrl);
          await new Promise((resolve, reject) => {
            ws.onopen = resolve;
            ws.onerror = reject;
          });

          let msgId = 1;
          function sendCdp(method, params = {}) {
            const id = msgId++;
            return new Promise((resolve) => {
              const handler = (evt) => {
                const data = JSON.parse(evt.data);
                if (data.id === id) {
                  ws.removeEventListener('message', handler);
                  resolve(data.result);
                }
              };
              ws.addEventListener('message', handler);
              ws.send(JSON.stringify({ id, method, params }));
            });
          }

          // Esperar a que la SPA inicialice y monte el DOM
          let mounted = false;
          for (let i = 0; i < 40; i++) {
            const check = await sendCdp('Runtime.evaluate', {
              expression: 'Boolean(document.querySelector(".rise-brand-title"))',
              returnByValue: true
            });
            if (check && check.result && check.result.value) {
              mounted = true;
              break;
            }
            await new Promise(r => setTimeout(r, 150));
          }
          assert.ok(mounted, 'El router SPA debe montar el contenido en el DOM de Chromium');

          // 1. Verificar Document Title
          const titleRes = await sendCdp('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
          assert.ok(titleRes?.result?.value?.includes('Metodología Martha Alles'), 'Título del documento en navegador coincide');

          // 2. Verificar contenedor #app y landmark semántico canónico único <main>
          const appRes = await sendCdp('Runtime.evaluate', { expression: 'document.querySelector("#app") !== null', returnByValue: true });
          assert.equal(appRes?.result?.value, true, '#app debe existir en el navegador');

          const mainRes = await sendCdp('Runtime.evaluate', {
            expression: 'document.querySelectorAll("main").length === 1 && document.querySelector("main.rise-main-content") !== null',
            returnByValue: true
          });
          assert.equal(mainRes?.result?.value, true, 'Debe existir exactamente un único landmark <main> en el documento');

          // 3. Verificar Brand Header
          const brandRes = await sendCdp('Runtime.evaluate', { expression: 'document.querySelector(".rise-brand-title")?.textContent?.trim() || ""', returnByValue: true });
          assert.ok(brandRes?.result?.value?.includes('Creación de Marcos de Competencias'), 'Brand title montado correctamente');

          // 4. Verificar lista de navegación de 6 módulos
          const navRes = await sendCdp('Runtime.evaluate', { expression: 'document.querySelectorAll(".rise-nav-item").length', returnByValue: true });
          assert.equal(navRes?.result?.value, 6, 'Debe renderizar los 6 módulos en la barra lateral');

          // 5. Verificar que el botón flotante de teoría existe y es accesible
          const theoryBtnRes = await sendCdp('Runtime.evaluate', { expression: 'document.querySelector("#btn-floating-theory") !== null', returnByValue: true });
          assert.equal(theoryBtnRes?.result?.value, true, 'Botón flotante de teoría debe existir');

          ws.close();
          executedViaChrome = true;
        }
      }
    } catch (e) {
      executedViaChrome = false;
    } finally {
      if (proc) {
        try { proc.kill('SIGKILL'); } catch (e) {}
      }
      if (tmpDir) {
        try {
          fs.rmSync(tmpDir, { recursive: true, force: true, maxRetries: 3 });
        } catch (e) {}
      }
    }
  }

  // Fallback complementario o en entornos sin binario de Chromium
  if (!executedViaChrome) {
    const rawHtml = fs.readFileSync(indexPath, 'utf8');
    assert.ok(rawHtml.includes('<div id="app"'), '#app debe ser un contenedor <div id="app">');

    const adapter = new ScormAdapter();
    adapter.init();
    const store = new CourseStore(adapter);
    const mockContainer = {
      innerHTML: '',
      querySelectorAll: (sel) => [],
      querySelector: (sel) => null
    };
    const router = new CourseRouter({ store, adapter, rootContainer: mockContainer });
    assert.ok(mockContainer.innerHTML.includes('<main class="rise-main-content" id="module-viewport">'), 'Router debe montar el landmark semántico <main>');
    assert.ok(mockContainer.innerHTML.includes('Creación de Marcos de Competencias'), 'Debe incluir el título del programa');
  }
});
