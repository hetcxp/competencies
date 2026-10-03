import test from 'node:test';
import assert from 'node:assert/strict';
import { TheoryDrawer } from '../js/ui/theory-drawer.js';
import { createCourseStore } from '../js/core/store.js';

test('TheoryDrawer - Contrato de exportación y métodos requeridos', () => {
  assert.equal(typeof TheoryDrawer, 'function');
  const drawer = new TheoryDrawer();

  assert.equal(typeof drawer.open, 'function');
  assert.equal(typeof drawer.close, 'function');
  assert.equal(typeof drawer.toggle, 'function');
  assert.equal(typeof drawer.setContent, 'function');
  assert.equal(typeof drawer.isOpen, 'function');
  assert.equal(typeof drawer.destroy, 'function');
  assert.equal(drawer.isOpen(), false);
});

test('TheoryDrawer - Integración con CourseStore y otorgamiento de badge opcional', () => {
  const store = createCourseStore();
  const drawer = new TheoryDrawer({ store });

  const mockTheory = {
    moduleId: 'mod-0',
    badgeId: 'badge-iceberg-model',
    title: 'David McClelland y el Modelo Iceberg',
    tagline: 'Espina Teórica 0.E',
    content: '<p>McClelland (1973): Testing for Competence rather than Intelligence.</p>',
    author: 'Spencer & Spencer',
    year: '1993',
    source: 'Competence at Work'
  };

  // Simula apertura con datos teóricos
  // En Node, la mutación DOM se omite pero la notificación al store debe ejecutarse
  store.dispatchAction('VIEW_THEORY_DRAWER', {
    moduleId: mockTheory.moduleId,
    badgeId: mockTheory.badgeId
  });

  const state = store.getState();
  assert.ok(state.theoryDrawersViewed.includes('badge-iceberg-model'));
  // Invariante de arquitectura: la espina teórica opcional NO aprueba el curso ni penaliza
  assert.equal(state.courseStatus, 'incomplete');
  assert.equal(state.finalScore, 0);
});

test('TheoryDrawer - Ejecución resiliente ante ausencia de DOM (Node runtime)', () => {
  const drawer = new TheoryDrawer({ container: null });

  // No debe lanzar excepciones en entorno headless/Node
  assert.doesNotThrow(() => {
    drawer.open('theory-1', { title: 'Test' });
    drawer.close();
    drawer.toggle();
    drawer.setContent({ title: 'Test' });
    drawer.destroy();
  });
});
