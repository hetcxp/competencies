import test from 'node:test';
import assert from 'node:assert/strict';
import { ChallengeEngine } from '../js/services/challenge-engine.js';
import { createCourseStore } from '../js/core/store.js';
import { renderScenarioBlock, ScenarioBlock } from '../js/ui/scenario-block.js';

const MOCK_CHALLENGE = {
  id: 'mod-0-ch1',
  moduleId: 'mod-0',
  badge: 'Reto Crítico',
  title: 'El Síndrome del Diccionario Copiado',
  context: 'En Novatech S.A., el 94% de la plantilla obtuvo evaluación sobresaliente en Trabajo en Equipo.',
  question: '¿Qué acción correctiva inmediata debes tomar como Consultor?',
  choices: [
    {
      id: 'opt-re-eval',
      key: 'A',
      text: 'Exigir a Recursos Humanos que repita la evaluación forzando una curva gaussiana.',
      isCorrect: false,
      consequence: 'Genera rechazo sindical y pánico operativo sin resolver la falta de descriptores conductuales observables.',
      feedback: 'Antipatrón clásico: forzar una campana de Gauss castiga injustamente sin corregir la causa raíz.'
    },
    {
      id: 'opt-audit-dictionary',
      key: 'B',
      text: 'Auditar el diccionario de competencias y redactar comportamientos observables por niveles de complejidad.',
      isCorrect: true,
      consequence: null,
      feedback: '¡Exacto! El problema radica en definiciones abstractas no graduadas según la metodología Alles.'
    }
  ],
  jitPill: {
    title: 'Principio Alles #1: La Conducta Observable',
    content: '<p>Una competencia no es un deseo ni una intención moral; es un comportamiento verificable en el puesto de trabajo.</p>'
  }
};

test('ChallengeEngine - Evaluación de Fallo Productivo (Consecuencia Organizacional)', () => {
  const engine = new ChallengeEngine();

  // Intento 1: opción errónea
  const eval1 = engine.evaluate(MOCK_CHALLENGE, 'opt-re-eval');

  assert.equal(eval1.isCorrect, false);
  assert.equal(eval1.resolved, false);
  assert.equal(eval1.attempts, 1);
  assert.ok(eval1.consequence.includes('Genera rechazo sindical'));
  assert.equal(eval1.jitPill, null, 'No debe desbloquear JIT Pill en fallo');
  assert.equal(engine.getAttempts('mod-0-ch1'), 1);
  assert.deepEqual(engine.getHistory('mod-0-ch1'), ['opt-re-eval']);
  assert.equal(engine.isResolved('mod-0-ch1'), false);
});

test('ChallengeEngine - Resolución exitosa y desbloqueo de Píldora JIT', () => {
  const engine = new ChallengeEngine();

  // Intento fallido previo
  engine.evaluate(MOCK_CHALLENGE, 'opt-re-eval');

  // Intento 2: opción correcta
  const eval2 = engine.evaluate(MOCK_CHALLENGE, 'opt-audit-dictionary');

  assert.equal(eval2.isCorrect, true);
  assert.equal(eval2.resolved, true);
  assert.equal(eval2.attempts, 2);
  assert.equal(eval2.consequence, null);
  assert.ok(eval2.jitPill !== null, 'Debe desbloquear la Píldora JIT al acertar');
  assert.ok(eval2.jitPill.title.includes('Principio Alles #1'));
  assert.equal(engine.isResolved('mod-0-ch1'), true);
  assert.deepEqual(engine.getHistory('mod-0-ch1'), ['opt-re-eval', 'opt-audit-dictionary']);
});

test('ChallengeEngine - Integración automática con CourseStore', () => {
  const store = createCourseStore();
  const engine = new ChallengeEngine({ store });

  engine.evaluate(MOCK_CHALLENGE, 'opt-re-eval');

  let state = store.getState();
  assert.ok(state.challengesState['mod-0']);
  assert.equal(state.challengesState['mod-0'].attempts, 1);
  assert.equal(state.challengesState['mod-0'].passed, false);

  engine.evaluate(MOCK_CHALLENGE, 'opt-audit-dictionary');

  state = store.getState();
  assert.equal(state.challengesState['mod-0'].attempts, 2);
  assert.equal(state.challengesState['mod-0'].passed, true);
  assert.deepEqual(state.challengesState['mod-0'].choices, ['opt-re-eval', 'opt-audit-dictionary']);
});

test('ChallengeEngine - Validación de entradas y errores', () => {
  const engine = new ChallengeEngine();

  assert.throws(() => {
    engine.evaluate(null, 'opt-1');
  }, /Challenge data object is required/);

  assert.throws(() => {
    engine.evaluate({ choices: [] }, 'opt-1');
  }, /non-empty choices array/);

  assert.throws(() => {
    engine.evaluate(MOCK_CHALLENGE, 'opt-inexistente');
  }, /was not found/);
});

test('ScenarioBlock - Contratos exportados y métodos seguros sin DOM', () => {
  assert.equal(typeof ScenarioBlock, 'function');
  assert.equal(typeof renderScenarioBlock, 'function');

  // En entorno Node (sin DOM activo), renderScenarioBlock maneja null de forma segura
  const instance = new ScenarioBlock({
    container: null,
    challengeData: MOCK_CHALLENGE
  });

  assert.equal(instance.render(), null);
  assert.equal(typeof instance.selectChoice, 'function');
});

test('ScenarioBlock - _renderJitPill no confunde acrónimos STAR con Grados A-D', () => {
  const instance = new ScenarioBlock({
    container: null,
    challengeData: MOCK_CHALLENGE
  });
  const mockContainer = { innerHTML: '' };
  instance.jitContainer = mockContainer;

  instance._renderJitPill({
    title: 'Estructura STAR',
    content: 'Píldora',
    components: [
      { letter: 'S', name: 'Situación', desc: 'Contexto' },
      { letter: 'T', name: 'Tarea', desc: 'Meta' },
      { letter: 'A', name: 'Acción individual', desc: 'Conducta' },
      { letter: 'R', name: 'Resultado', desc: 'Impacto' }
    ]
  });

  assert.ok(mockContainer.innerHTML.includes('<span class="rise-jit-badge">A</span>'), 'Debe renderizar la A de STAR con rise-jit-badge');
  assert.ok(!mockContainer.innerHTML.includes('Grado A'), 'No debe renderizar "Grado A" en el acrónimo STAR');
});
