import test from 'node:test';
import assert from 'node:assert/strict';
import { DocxExporter } from '../js/services/docx-exporter.js';

test('DocxExporter - Genera binario DOCX válido con estructura OpenXML', () => {
  const data = {
    competencyName: 'Gestión del Cambio Organizacional',
    company: 'Retail Sur Americana',
    type: 'Competencia Cardinal',
    definition: 'Impulsar y facilitar la adopción de nuevos modelos de trabajo...',
    levels: {
      A: 'Diseña la estrategia corporativa...',
      B: 'Lidera la transición operativa...',
      C: 'Aplica los protocolos...',
      D: 'Muestra resistencia pasiva...'
    },
    bbiQuestions: [
      'Relate una situación concreta...',
      '¿Cuál fue el indicador cuantitativo...?',
      '¿Qué decisión tomó usted individualmente...?'
    ]
  };

  const bytes = DocxExporter.generateDocxBytes(data);
  assert.ok(bytes instanceof Uint8Array, 'Debe devolver un Uint8Array');
  assert.ok(bytes.length > 500, 'El archivo DOCX debe tener contenido');

  // Verifica firma PK ZIP (0x04034b50)
  assert.equal(bytes[0], 0x50); // P
  assert.equal(bytes[1], 0x4B); // K
  assert.equal(bytes[2], 0x03);
  assert.equal(bytes[3], 0x04);
});

test('DocxExporter - Genera Markdown estructurado con todos los campos', () => {
  const data = {
    competencyName: 'Gestión del Cambio Organizacional',
    company: 'Retail Sur Americana',
    type: 'Competencia Cardinal',
    definition: 'Impulsar el cambio...',
    levels: { A: 'Nivel A text', B: 'Nivel B text', C: 'Nivel C text', D: 'Nivel D text' },
    bbiQuestions: ['Pregunta BBI 1', 'Pregunta BBI 2']
  };

  const md = DocxExporter.generateMarkdown(data);
  assert.ok(md.includes('FICHA TÉCNICA DE COMPETENCIA LABORAL'));
  assert.ok(md.includes('Gestión del Cambio Organizacional'));
  assert.ok(md.includes('Nivel A text'));
  assert.ok(md.includes('Pregunta BBI 1'));
  assert.ok(!md.toLowerCase().includes('moodle'), 'No debe contener referencias a Moodle');
});

test('DocxExporter - Colores XML en documento DOCX cumplen WCAG AA (>= 4.5:1) y erradican tonos legacy', () => {
  const data = {
    competencyName: 'Liderazgo Estratégico',
    company: 'Empresa Demo',
    type: 'Competencia Cardinal',
    definition: 'Capacidad para liderar...',
    levels: { A: 'Nivel A', B: 'Nivel B', C: 'Nivel C', D: 'Nivel D' },
    bbiQuestions: ['Pregunta 1', 'Pregunta 2']
  };

  const xml = DocxExporter.buildDocumentXml(data);
  const bytes = DocxExporter.generateDocxBytes(data);
  const decodedZip = new TextDecoder().decode(bytes);

  // Erradicación de colores legacy con bajo contraste sobre blanco
  assert.equal(xml.includes('0D9488'), false, 'XML no debe contener el color legacy 0D9488');
  assert.equal(xml.includes('10B981'), false, 'XML no debe contener el color legacy 10B981');
  assert.equal(decodedZip.includes('0D9488'), false, 'Binario ZIP DOCX no debe contener 0D9488');
  assert.equal(decodedZip.includes('10B981'), false, 'Binario ZIP DOCX no debe contener 10B981');

  // Presencia de tokens conformes WCAG AA (>= 4.5:1)
  assert.ok(xml.includes('0F766E'), 'XML debe contener 0F766E (5.47:1) en encabezados y Nivel A');
  assert.ok(xml.includes('0369A1'), 'XML debe contener 0369A1 (5.93:1) en Nivel B');
  assert.ok(xml.includes('047857'), 'XML debe contener 047857 (5.48:1) en Nivel C');
  assert.ok(xml.includes('64748B'), 'XML debe contener 64748B (4.76:1) en pie de página');
});

