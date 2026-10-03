import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RubricEvaluator, evaluateCapstoneSubmission } from '../js/services/rubric-evaluator.js';
import { CourseStore } from '../js/core/store.js';
import { MODULES_DATA } from '../js/data/modules-content.js';

test('RubricEvaluator - Criterio 1: Definición conceptual limpia', () => {
  const evaluator = new RubricEvaluator();

  // Caso inválido: término moral "buena persona"
  const badDef1 = 'Es la capacidad de ser buena persona y trabajar con lealtad.';
  const resBad1 = evaluator.evaluateCriterion1(badDef1);
  assert.strictEqual(resBad1.passed, false);
  assert.match(resBad1.feedback, /términos morales/);

  // Caso inválido: "pasión"
  const badDef2 = 'Trabajar con pasión y amor hacia los proyectos de la compañía.';
  const resBad2 = evaluator.evaluateCriterion1(badDef2);
  assert.strictEqual(resBad2.passed, false);

  // Caso válido: definición objetiva según fórmula Alles
  const cleanDef = 'Impulsar y coordinar la implementación de metodologías ágiles en equipos multidisciplinarios.';
  const resClean = evaluator.evaluateCriterion1(cleanDef);
  assert.strictEqual(resClean.passed, true);

  // Soporte de booleano directo
  assert.strictEqual(evaluator.evaluateCriterion1(true).passed, true);
  assert.strictEqual(evaluator.evaluateCriterion1(false).passed, false);
});

test('RubricEvaluator - Criterio 2: Graduación por autonomía e impacto sin adjetivos', () => {
  const evaluator = new RubricEvaluator();

  // Caso inválido: escala adjetival subjetiva
  const badLevels = {
    A: 'Comunica excelentemente todas las decisiones.',
    B: 'Comunica muy bien con su equipo.',
    C: 'Comunica bien en el trabajo diario.',
    D: 'Comunica mal o con errores.'
  };
  const resBad = evaluator.evaluateCriterion2(badLevels);
  assert.strictEqual(resBad.passed, false);
  assert.match(resBad.feedback, /escala adjetival/);

  // Caso válido: diferenciación por autonomía y alcance BARS
  const validLevels = {
    A: 'Diseña la política institucional de comunicación corporativa para contingencias públicas.',
    B: 'Adapta los mensajes y resuelve conflictos entre áreas sin necesidad de mediación jerárquica.',
    C: 'Informa a su equipo directo de forma clara siguiendo los lineamientos establecidos.',
    D: 'Requiere supervisión constante para transmitir información básica del sector.'
  };
  const resValid = evaluator.evaluateCriterion2(validLevels);
  assert.strictEqual(resValid.passed, true);
});

test('RubricEvaluator - Criterio 3: Anclaje de Grado C y Grado A', () => {
  const evaluator = new RubricEvaluator();

  // Grado A sin alcance sistémico / Grado C sin estándar
  const weakLevels = {
    A: 'Trabaja con mucha dedicación y resuelve todo rápido.',
    B: 'Resuelve imprevistos en su área.',
    C: 'A veces hace cosas buenas.',
    D: 'No cumple.'
  };
  const resWeak = evaluator.evaluateCriterion3(weakLevels);
  assert.strictEqual(resWeak.passed, false);

  // Grado A sistémico / Grado C estándar operativo
  const strongLevels = {
    A: 'Diseña y establece la estrategia corporativa y doctrina de cambio para toda la organización.',
    B: 'Lidera la transición operativa en su área de forma autónoma.',
    C: 'Cumple el estándar y protocolo operativo de transición en su puesto.',
    D: 'Muestra resistencia pasiva a los lineamientos de trabajo.'
  };
  const resStrong = evaluator.evaluateCriterion3(strongLevels);
  assert.strictEqual(resStrong.passed, true);
});

test('RubricEvaluator - Criterio 4: Preguntas BBI pasadas reales vs. hipotéticas', () => {
  const evaluator = new RubricEvaluator();

  // Pregunta hipotética rechazada ("¿Qué harías?")
  const badQuestions = [
    '¿Qué harías si se cae el servidor durante el fin de semana?',
    '¿Cómo actuarías ante una huelga del personal?'
  ];
  const resBad = evaluator.evaluateCriterion4(badQuestions);
  assert.strictEqual(resBad.passed, false);
  assert.match(resBad.feedback, /preguntas hipotéticas/);

  // Pregunta basada en eventos críticos pasados aceptada
  const validQuestions = [
    'Relate una ocasión en los últimos 18 meses donde enfrentó resistencia activa al cambio en su equipo. ¿Qué decisión tomó usted en las primeras 48 horas?',
    '¿Cuál fue el indicador cuantitativo que confirmó la adopción del nuevo protocolo?'
  ];
  const resValid = evaluator.evaluateCriterion4(validQuestions);
  assert.strictEqual(resValid.passed, true);
});

test('RubricEvaluator - Evaluación Completa del Blueprint de Módulo 5 y sincronización Store', () => {
  const store = new CourseStore();
  const evaluator = new RubricEvaluator({ store });

  const mod5 = MODULES_DATA.find(m => m.id === 'mod-5');
  assert.ok(mod5);
  assert.ok(mod5.submissionBlueprint);

  // Evaluar blueprint oficial de oro de Módulo 5
  const result = evaluator.evaluateSubmission({
    definition: mod5.submissionBlueprint.definition,
    levels: mod5.submissionBlueprint.levels,
    bbiQuestions: [...mod5.submissionBlueprint.bbiQuestions]
  });

  assert.strictEqual(result.passed, true);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.checklist.length, 4);
  assert.strictEqual(result.checklist.every(item => item.passed), true);

  // Verificar que CourseStore registró los 4 criterios aprobados
  const storeState = store.getState();
  assert.deepStrictEqual(storeState.capstoneRubric, { c1: true, c2: true, c3: true, c4: true });
  assert.strictEqual(storeState.finalScore, 100);
  assert.strictEqual(storeState.courseStatus, 'passed');
});

test('evaluateCapstoneSubmission - Manejo de evaluaciones parciales y booleans', () => {
  // Solo 2 de 4 criterios aprobados
  const partial = evaluateCapstoneSubmission({ c1: true, c2: true, c3: false, c4: false });
  assert.strictEqual(partial.passed, false);
  assert.strictEqual(partial.score, 50);
  assert.strictEqual(partial.criteriaDetails.c1, true);
  assert.strictEqual(partial.criteriaDetails.c3, false);

  // 4 de 4 aprobados directamente
  const full = evaluateCapstoneSubmission({ c1: true, c2: true, c3: true, c4: true });
  assert.strictEqual(full.passed, true);
  assert.strictEqual(full.score, 100);
});
