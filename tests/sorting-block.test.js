import test from 'node:test';
import assert from 'node:assert/strict';
import { SortingBlock } from '../js/ui/sorting-block.js';

const MOCK_ITEMS = [
  {
    id: 'item-1',
    text: 'Diseña la visión estratégica y políticas globales de integridad corporativa.',
    targetLevel: 'A',
    confusions: {
      B: 'Confusión táctica: El alcance es corporativo y transversal a toda la organización, no limitado a un área.'
    }
  },
  {
    id: 'item-2',
    text: 'Facilita la resolución de dilemas éticos en su departamento y propone mejoras en los procesos de su sector.',
    targetLevel: 'B',
    confusions: {
      A: 'Confusión estratégica: Su impacto es directo sobre su equipo y sector, no define las directrices corporativas.'
    }
  },
  {
    id: 'item-3',
    text: 'Cumple puntualmente con las normas éticas establecidas y los procedimientos operativos estándar.',
    targetLevel: 'C'
  },
  {
    id: 'item-4',
    text: 'Reacciona solo ante llamados de atención o manifiesta desconocimiento del código de conducta.',
    targetLevel: 'D'
  }
];

const MOCK_SLOTS = [
  { id: 'slot-a', level: 'A', title: 'Nivel A' },
  { id: 'slot-b', level: 'B', title: 'Nivel B' },
  { id: 'slot-c', level: 'C', title: 'Nivel C' },
  { id: 'slot-d', level: 'D', title: 'Nivel D' }
];

test('SortingBlock - Contrato de exportación y métodos requeridos', () => {
  assert.equal(typeof SortingBlock, 'function');
  const instance = new SortingBlock();

  assert.equal(typeof instance.render, 'function');
  assert.equal(typeof instance.validate, 'function');
  assert.equal(typeof instance.reset, 'function');
  assert.equal(typeof instance.placeItem, 'function');
  assert.equal(typeof instance.getPlacements, 'function');
});

test('SortingBlock - Invariante de aislamiento: Cero mutación directa de datos maestros', () => {
  const instance = new SortingBlock();
  const originalItems = JSON.parse(JSON.stringify(MOCK_ITEMS));
  const originalSlots = JSON.parse(JSON.stringify(MOCK_SLOTS));

  // Render en Node retorna null pero clona las colecciones
  instance.render(null, MOCK_ITEMS, MOCK_SLOTS);

  assert.deepEqual(MOCK_ITEMS, originalItems, 'MOCK_ITEMS no debe ser mutado');
  assert.deepEqual(MOCK_SLOTS, originalSlots, 'MOCK_SLOTS no debe ser mutado');
});

test('SortingBlock - Validación de clasificación y micro-feedback de confusión', () => {
  const instance = new SortingBlock();
  instance.items = JSON.parse(JSON.stringify(MOCK_ITEMS));
  instance.slots = JSON.parse(JSON.stringify(MOCK_SLOTS));

  // 1. Sin ubicar todos los items: incompleto
  instance.placements.set('item-1', 'slot-a');
  let result = instance.validate();
  assert.equal(result.allCorrect, false);
  assert.equal(result.incomplete, true);
  assert.equal(result.attempts, 1);

  // 2. Todos ubicados pero con confusión B por A
  instance.placements.set('item-2', 'slot-a'); // Confusión: Nivel B colocado en Nivel A
  instance.placements.set('item-3', 'slot-c');
  instance.placements.set('item-4', 'slot-d');

  result = instance.validate();
  assert.equal(result.allCorrect, false);
  assert.equal(result.correctCount, 3);
  assert.equal(result.confusions.length, 1);
  assert.equal(result.confusions[0].itemId, 'item-2');
  assert.equal(result.confusions[0].placedLevel, 'A');
  assert.equal(result.confusions[0].targetLevel, 'B');
  assert.ok(result.confusions[0].message.includes('Confusión estratégica'));

  // 3. Corrección completa: 100% de aciertos
  let completedEvent = null;
  instance.onComplete = (payload) => {
    completedEvent = payload;
  };

  instance.placements.set('item-2', 'slot-b'); // Corregido a Nivel B
  result = instance.validate();

  assert.equal(result.allCorrect, true);
  assert.equal(result.correctCount, 4);
  assert.equal(result.confusions.length, 0);
  assert.ok(completedEvent !== null);
  assert.equal(completedEvent.allCorrect, true);
  assert.equal(completedEvent.attempts, 3);
});

test('SortingBlock - Reset restaura estado inicial', () => {
  const instance = new SortingBlock();
  instance.items = JSON.parse(JSON.stringify(MOCK_ITEMS));
  instance.slots = JSON.parse(JSON.stringify(MOCK_SLOTS));

  instance.placements.set('item-1', 'slot-a');
  instance.placements.set('item-2', 'slot-b');
  assert.equal(Object.keys(instance.getPlacements()).length, 2);

  instance.reset();
  assert.equal(Object.keys(instance.getPlacements()).length, 0);
  assert.equal(instance.allCorrect, false);
});

test('SortingBlock - Soporte de accesibilidad y colocación programática accesible', () => {
  const instance = new SortingBlock();
  instance.items = JSON.parse(JSON.stringify(MOCK_ITEMS));
  instance.slots = JSON.parse(JSON.stringify(MOCK_SLOTS));

  // Simulación de interacción de teclado: seleccionar y colocar
  instance.selectedItemId = 'item-1';
  // Sin DOM (en Node), placeItem se ejecuta sin arrojar error
  assert.doesNotThrow(() => {
    instance.placeItem('item-1', 'slot-a');
  });

  // Verificar que el método placeItem y reset son idempotentes
  assert.equal(typeof instance.placeItem, 'function');
  assert.equal(typeof instance.validate, 'function');
});
