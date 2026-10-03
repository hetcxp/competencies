/**
 * Servicio de Generación y Exportación de Documentos Word (.docx) y Markdown (.md)
 * Permite la descarga directa de la Ficha Técnica de Competencia conforme al estándar Martha Alles.
 * Implementación 100% nativa en Vanilla JavaScript (sin dependencias externas).
 */

/**
 * Escapa caracteres especiales para XML seguro
 * @param {string} str 
 * @returns {string}
 */
function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Calcula CRC32 de un búfer de bytes
 * @param {Uint8Array} bytes 
 * @returns {number}
 */
function crc32(bytes) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ bytes[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

/**
 * Empaqueta un arreglo de archivos virtuales en un contenedor ZIP estándar (Compression 0: Store)
 * Compatible con la especificación Office Open XML (.docx).
 * @param {Array<{name: string, data: string|Uint8Array}>} files 
 * @returns {Uint8Array}
 */
function buildZipArchive(files) {
  const encoder = new TextEncoder();
  const fileEntries = files.map(f => {
    const nameBytes = encoder.encode(f.name);
    const dataBytes = typeof f.data === 'string' ? encoder.encode(f.data) : f.data;
    const crc = crc32(dataBytes);
    return { name: f.name, nameBytes, dataBytes, crc, size: dataBytes.length };
  });

  let totalSize = 0;
  for (const f of fileEntries) {
    totalSize += 30 + f.nameBytes.length + f.size; // Local header + data
    totalSize += 46 + f.nameBytes.length;          // Central directory entry
  }
  totalSize += 22; // End of central directory record

  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);
  let offset = 0;
  const cdOffsets = [];

  // 1. Escribe Local File Headers y datos
  for (const f of fileEntries) {
    cdOffsets.push(offset);
    view.setUint32(offset, 0x04034b50, true);  // Local header signature
    view.setUint16(offset + 4, 20, true);      // Version needed (2.0)
    view.setUint16(offset + 6, 0, true);       // General purpose bit flag
    view.setUint16(offset + 8, 0, true);       // Compression method (0 = Store)
    view.setUint16(offset + 10, 0, true);      // File mod time
    view.setUint16(offset + 12, 0x5421, true); // File mod date
    view.setUint32(offset + 14, f.crc, true);  // CRC-32
    view.setUint32(offset + 18, f.size, true); // Compressed size
    view.setUint32(offset + 22, f.size, true); // Uncompressed size
    view.setUint16(offset + 26, f.nameBytes.length, true); // Filename length
    view.setUint16(offset + 28, 0, true);      // Extra field length
    buffer.set(f.nameBytes, offset + 30);
    offset += 30 + f.nameBytes.length;
    buffer.set(f.dataBytes, offset);
    offset += f.size;
  }

  const cdStart = offset;

  // 2. Escribe Central Directory Headers
  for (let i = 0; i < fileEntries.length; i++) {
    const f = fileEntries[i];
    const localOffset = cdOffsets[i];
    view.setUint32(offset, 0x02014b50, true);  // Central directory signature
    view.setUint16(offset + 4, 20, true);      // Version made by
    view.setUint16(offset + 6, 20, true);      // Version needed
    view.setUint16(offset + 8, 0, true);       // Bit flag
    view.setUint16(offset + 10, 0, true);      // Compression
    view.setUint16(offset + 12, 0, true);      // Mod time
    view.setUint16(offset + 14, 0x5421, true); // Mod date
    view.setUint32(offset + 16, f.crc, true);  // CRC-32
    view.setUint32(offset + 20, f.size, true); // Comp size
    view.setUint32(offset + 24, f.size, true); // Uncomp size
    view.setUint16(offset + 28, f.nameBytes.length, true); // Name length
    view.setUint16(offset + 30, 0, true);      // Extra length
    view.setUint16(offset + 32, 0, true);      // Comment length
    view.setUint16(offset + 34, 0, true);      // Disk number start
    view.setUint16(offset + 36, 0, true);      // Internal attributes
    view.setUint32(offset + 38, 0, true);      // External attributes
    view.setUint32(offset + 42, localOffset, true); // Local header offset
    buffer.set(f.nameBytes, offset + 46);
    offset += 46 + f.nameBytes.length;
  }

  const cdSize = offset - cdStart;

  // 3. Escribe End of Central Directory Record (EOCD)
  view.setUint32(offset, 0x06054b50, true);    // EOCD signature
  view.setUint16(offset + 4, 0, true);        // Disk number
  view.setUint16(offset + 6, 0, true);        // Start disk
  view.setUint16(offset + 8, fileEntries.length, true);  // Entries on this disk
  view.setUint16(offset + 10, fileEntries.length, true); // Total entries
  view.setUint32(offset + 12, cdSize, true);  // CD size
  view.setUint32(offset + 16, cdStart, true); // CD offset
  view.setUint16(offset + 20, 0, true);       // Comment length

  return buffer;
}

/**
 * Genera el XML del documento Word (word/document.xml) con estilos limpios
 * @param {Object} data 
 * @returns {string}
 */
function buildDocumentXml(data) {
  const compName = data.competencyName || 'Gestión del Cambio Organizacional';
  const company = data.company || 'Organización / Empresa';
  const compType = data.type || 'Competencia Cardinal (Aplica a toda la organización)';
  const dateStr = data.date || new Date().toISOString().split('T')[0];
  const definition = data.definition || 'Sin definición especificada.';
  const levels = data.levels || { A: '', B: '', C: '', D: '' };
  const bbiQuestions = Array.isArray(data.bbiQuestions) ? data.bbiQuestions : [];

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <!-- TÍTULO PRINCIPAL -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="80"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="0F766E"/></w:rPr>
        <w:t>FICHA TÉCNICA DE COMPETENCIA LABORAL</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="240"/></w:pPr>
      <w:r>
        <w:rPr><w:i/><w:sz w:val="22"/><w:color w:val="64748B"/></w:rPr>
        <w:t>Estándar Metodológico Trilogía Martha Alles</w:t>
      </w:r>
    </w:p>

    <!-- METADATOS EN TABLA -->
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:tcW w:w="2200" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>Competencia:</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6800" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F766E"/></w:rPr><w:t>${escapeXml(compName)}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:tcW w:w="2200" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>Organización / Contexto:</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(company)}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:tcW w:w="2200" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>Clasificación:</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(compType)}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F8FAFC"/><w:tcW w:w="2200" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>Fecha de Calibración:</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(dateStr)}</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>

    <!-- SECCIÓN 1: DEFINICIÓN CONCEPTUAL -->
    <w:p><w:pPr><w:spacing w:before="280" w:after="120"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>1. Definición Conceptual</w:t></w:r>
    </w:p>
    <w:p><w:pPr><w:ind w:left="360" w:right="360"/><w:spacing w:before="60" w:after="180"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="22"/><w:color w:val="1E293B"/></w:rPr><w:t>${escapeXml(definition)}</w:t></w:r>
    </w:p>

    <!-- SECCIÓN 2: GRADUACIÓN BARS (A-B-C-D) -->
    <w:p><w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>2. Taxonomía Conductual Anclada (Escala BARS A-B-C-D)</w:t></w:r>
    </w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="0F766E"/><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Nivel A (100% - Superior)</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(levels.A || 'Sin descripción.')}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="0369A1"/><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Nivel B (75% - Muy Bueno)</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(levels.B || 'Sin descripción.')}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="047857"/><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/></w:rPr><w:t>Nivel C (50% - Estándar Requerido)</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(levels.C || 'Sin descripción.')}</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="E2E8F0"/><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="334155"/></w:rPr><w:t>Nivel D (25% - Inicial / Supervisión)</w:t></w:r></w:p></w:tc>
        <w:tc><w:tcPr><w:tcW w:w="6600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(levels.D || 'Sin descripción.')}</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>

    <!-- SECCIÓN 3: PREGUNTAS BBI / STAR -->
    <w:p><w:pPr><w:spacing w:before="280" w:after="120"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="0F172A"/></w:rPr><w:t>3. Protocolo de Preguntas de Incidentes Críticos (BBI / STAR)</w:t></w:r>
    </w:p>
    ${bbiQuestions.map((q, idx) => `
      <w:p><w:pPr><w:ind w:left="360"/><w:spacing w:before="60" w:after="80"/></w:pPr>
        <w:r><w:rPr><w:b/><w:color w:val="0F766E"/></w:rPr><w:t>${idx + 1}. </w:t></w:r>
        <w:r><w:t>${escapeXml(q)}</w:t></w:r>
      </w:p>
    `).join('')}

    <!-- PIE / ACCIÓN DE CIERRE -->
    <w:p><w:pPr><w:spacing w:before="360" w:after="80"/><w:jc w:val="center"/></w:pPr>
      <w:r><w:rPr><w:i/><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr>
        <w:t>Documento generado bajo el estándar científico de la Trilogía Martha Alles (Diccionario de Competencias, Comportamientos y Preguntas).</w:t>
      </w:r>
    </w:p>
    <w:sectPr/>
  </w:body>
</w:document>`;
}

/**
 * Contenidos fijos del paquete OpenXML
 */
const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

export class DocxExporter {
  /**
   * Genera el XML estructurado del documento Word (word/document.xml)
   * @param {Object} fichaData 
   * @returns {string}
   */
  static buildDocumentXml(fichaData) {
    return buildDocumentXml(fichaData);
  }

  /**
   * Genera el binario Uint8Array correspondiente a un archivo .docx válido
   * @param {Object} fichaData 
   * @returns {Uint8Array}
   */
  static generateDocxBytes(fichaData) {
    const docXml = buildDocumentXml(fichaData);
    return buildZipArchive([
      { name: '[Content_Types].xml', data: CONTENT_TYPES_XML },
      { name: '_rels/.rels', data: RELS_XML },
      { name: 'word/document.xml', data: docXml }
    ]);
  }

  /**
   * Dispara la descarga del archivo .docx en el navegador
   * @param {string} filename 
   * @param {Object} fichaData 
   */
  static downloadDocx(filename = 'ficha_tecnica_competencia.docx', fichaData = {}) {
    if (typeof document === 'undefined') return;
    const bytes = this.generateDocxBytes(fichaData);
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Genera el contenido Markdown estructurado
   * @param {Object} fichaData 
   * @returns {string}
   */
  static generateMarkdown(fichaData = {}) {
    const compName = fichaData.competencyName || 'Gestión del Cambio Organizacional';
    const company = fichaData.company || 'Organización / Empresa';
    const compType = fichaData.type || 'Competencia Cardinal';
    const dateStr = fichaData.date || new Date().toISOString().split('T')[0];
    const definition = fichaData.definition || 'Sin definición especificada.';
    const levels = fichaData.levels || { A: '', B: '', C: '', D: '' };
    const questions = Array.isArray(fichaData.bbiQuestions) ? fichaData.bbiQuestions : [];

    return `# FICHA TÉCNICA DE COMPETENCIA LABORAL
**Metodología:** Trilogía Martha Alles  
**Competencia:** ${compName}  
**Empresa / Contexto:** ${company}  
**Tipo:** ${compType}  
**Fecha de Calibración:** ${dateStr}  

---

## 1. Definición Conceptual
> ${definition}

## 2. Taxonomía Conductual Anclada (Escala BARS A-B-C-D)
- **Nivel A (100% - Superior / Referente Sistémico):**  
  ${levels.A || 'Sin descripción.'}
- **Nivel B (75% - Muy Bueno / Autónomo en Alta Complejidad):**  
  ${levels.B || 'Sin descripción.'}
- **Nivel C (50% - Estándar Operativo Mínimo Requerido):**  
  ${levels.C || 'Sin descripción.'}
- **Nivel D (25% - Inicial / En Desarrollo / Requiere Supervisión):**  
  ${levels.D || 'Sin descripción.'}

## 3. Protocolo de Preguntas de Incidentes Críticos (BBI / STAR)
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}

---
*Documento estructurado y auditado conforme a los estándares de la Trilogía Martha Alles.*
`;
  }

  /**
   * Dispara la descarga de la ficha en Markdown (.md)
   * @param {string} filename 
   * @param {Object} fichaData 
   */
  static downloadMarkdown(filename = 'ficha_tecnica_competencia.md', fichaData = {}) {
    if (typeof document === 'undefined') return;
    const content = this.generateMarkdown(fichaData);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
