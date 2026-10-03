import test from 'node:test';
import assert from 'node:assert/strict';
import { ChatSimulator } from '../js/ui/chat-simulator.js';

const MOCK_SCENARIO = {
  candidate: {
    name: 'Carolina Méndez',
    role: 'Postulante a Jefa de Operaciones',
    avatarText: 'CM'
  },
  initialDialogue: {
    speaker: 'candidate',
    text: 'Yo siempre me considero una persona sumamente proactiva y que fomenta el diálogo abierto.'
  },
  turns: [
    {
      id: 'turn-1',
      prompt: 'Respuesta teórica detectada. Aísla una conducta real pasada:',
      options: [
        {
          id: 'opt-hypo',
          text: '¿Y qué harías si un proveedor crítico entra en quiebra?',
          isEffective: false,
          feedback: 'Pregunta hipotética: no obtiene evidencia fáctica del pasado.',
          candidateResponse: 'Bueno, inmediatamente buscaría alternativas en el mercado.'
        },
        {
          id: 'opt-star',
          text: 'Relata una ocasión en los últimos dos años donde un proveedor interrumpió el suministro. ¿Qué hiciste tú exactamente?',
          isEffective: true,
          feedback: '¡Excelente sondeo BBI! Exige hechos y acciones en primera persona singular.',
          candidateResponse: 'En 2023 ocurrió con Envases del Plata. Convoqué un comité de contingencia y renegocié compras en 48 hs.'
        }
      ]
    },
    {
      id: 'turn-2',
      prompt: 'Profundiza en el resultado verificable de esa acción:',
      options: [
        {
          id: 'opt-result-star',
          text: '¿Cuál fue la métrica o impacto concreto de esa renegociación?',
          isEffective: true,
          feedback: 'Cierre STAR: indaga el resultado (R) cuantificable.',
          candidateResponse: 'Evitamos la parada de planta y el sobrecosto se contuvo en un 3%.'
        },
        {
          id: 'opt-generic',
          text: '¿Sientes que el equipo quedó contento?',
          isEffective: false,
          feedback: 'Pregunta subjetiva basada en sensaciones, no en métricas o conductas verificables.',
          candidateResponse: 'Sí, creo que todos quedaron bastante satisfechos.'
        }
      ]
    }
  ]
};

test('ChatSimulator - Contrato de exportación y métodos requeridos', () => {
  assert.equal(typeof ChatSimulator, 'function');
  const sim = new ChatSimulator();

  assert.equal(typeof sim.init, 'function');
  assert.equal(typeof sim.selectProbingQuestion, 'function');
  assert.equal(typeof sim.reset, 'function');
  assert.equal(typeof sim.getState, 'function');
});

test('ChatSimulator - Inicialización y estado seguro sin DOM (Node runtime)', () => {
  const sim = new ChatSimulator();
  sim.init(null, MOCK_SCENARIO);

  const state = sim.getState();
  assert.equal(state.currentTurnIndex, 0);
  assert.equal(state.score, 0);
  assert.equal(state.correctProbes, 0);
  assert.equal(state.totalTurns, 2);
  assert.equal(state.isFinished, false);
  assert.deepEqual(state.history, []);
});

test('ChatSimulator - Flujo de turnos, evaluación de sondeo BBI y cálculo de score', () => {
  const sim = new ChatSimulator();
  let finishedReport = null;

  sim.init(null, MOCK_SCENARIO, (report) => {
    finishedReport = report;
  });

  // Turno 1: Selección de sondeo STAR efectivo
  sim.selectProbingQuestion('opt-star');
  assert.equal(sim.correctProbes, 1);
  assert.equal(sim.history.length, 1);
  assert.equal(sim.history[0].isEffective, true);

  // Avanza a turno 2
  sim.currentTurnIndex = 1;

  // Turno 2: Selección de pregunta ineficaz / genérica
  sim.selectProbingQuestion('opt-generic');
  assert.equal(sim.correctProbes, 1);
  assert.equal(sim.history.length, 2);
  assert.equal(sim.history[1].isEffective, false);

  // Finalización
  sim._finishInterview();
  assert.equal(sim.isFinished, true);
  assert.equal(sim.score, 50); // 1 de 2 = 50%
  assert.ok(finishedReport !== null);
  assert.equal(finishedReport.score, 50);
  assert.equal(finishedReport.correctProbes, 1);
  assert.equal(finishedReport.totalTurns, 2);
  assert.equal(finishedReport.completed, true);
});

test('ChatSimulator - Reset restaura el estado original', () => {
  const sim = new ChatSimulator();
  sim.init(null, MOCK_SCENARIO);

  sim.selectProbingQuestion('opt-star');
  sim.currentTurnIndex = 1;
  sim._finishInterview();
  assert.equal(sim.isFinished, true);

  sim.reset();
  const state = sim.getState();
  assert.equal(state.currentTurnIndex, 0);
  assert.equal(state.score, 0);
  assert.equal(state.correctProbes, 0);
  assert.equal(state.isFinished, false);
  assert.deepEqual(state.history, []);
});
