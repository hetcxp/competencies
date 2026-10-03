/**
 * Espinas Teóricas Opcionales (Deep-Dive Drawers)
 * Arquitectura Dual-Track (Kathy Moore & Martha Alles):
 * Contenido metodológico de rigor científico disponible on-demand sin bloquear el avance del curso.
 *
 * Layer: DATA (Inmutable / Frozen DTOs)
 */

export const THEORY_DATA = Object.freeze({
  'mod-0-theory': Object.freeze({
    id: 'mod-0-theory',
    moduleId: 'mod-0',
    badgeId: 'badge-theory-mod-0',
    badgeName: 'Especialista en la Trilogía Martha Alles',
    tagline: 'Espina Teórica 0.E • Arquitectura de la Trilogía Alles',
    title: 'La Trilogía Martha Alles como Sistema Científico Integrado',
    author: 'Martha Alicia Alles',
    source: 'Dirección Estratégica de Recursos Humanos (Gestión por Competencias)',
    year: '2006',
    citation: 'Alles, M. A. (2006). Dirección estratégica de recursos humanos: gestión por competencias. Ediciones Granica, Buenos Aires.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. La Trilogía Martha Alles como Sistema Integrado e Indisoluble</h4>
        <p>
          Uno de los principales errores en las organizaciones es tratar las competencias como documentos aislados o meros trámites de selección.
          Martha Alles estructuró su metodología en tres obras que forman un circuito cerrado y verificable:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Tomo I (Diccionario de Competencias):</strong> Establece las definiciones conceptuales universales (cardinales y específicas) con rigor sintáctico y libres de juicios axiológicos o morales.</li>
            <li><strong>Tomo II (Diccionario de Comportamientos):</strong> Traduce cada competencia a una escala taxonómica cuatridimensional (Grados A, B, C y D) con anclaje conductual observable (BARS).</li>
            <li><strong>Tomo III (Diccionario de Preguntas):</strong> Proporciona el protocolo de auditoría e indagación mediante preguntas de incidentes críticos pasados (BBI / STAR) y preguntas de sondeo.</li>
          </ul>
        </div>
        <p>
          Si se altera una parte del sistema sin calibrar las otras dos, el marco corporativo colapsa en la subjetividad o en la inflación de calificaciones.
        </p>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/trilogia-circuito.svg" alt="Circuito Cerrado de la Trilogía Martha Alles" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> El circuito indisoluble de los tres tomos de Martha Alles: Definición, Graduación y Preguntas
          </figcaption>
        </figure>

        <h4>2. Alineación Estratégica: Del Negocio al Puesto</h4>
        <p>
          En la metodología Alles, las competencias no se definen desde la teoría abstracta ni se copian de manuales ajenos. Nacen de la <strong>visión, misión y estrategia</strong> de la empresa:
        </p>
        <ul>
          <li><strong>Competencias Cardinales:</strong> Aquellas que toda persona en la organización debe evidenciar, independientemente de su nivel jerárquico o especialidad funcional, para hacer viable la estrategia global.</li>
          <li><strong>Competencias Específicas:</strong> Comportamientos requeridos exclusivamente para un área, familia de puestos o nivel de mando (por ejemplo, competencias gerenciales o técnicas de ingeniería).</li>
        </ul>

        <h4>3. El Circuito Operativo de Calibración Continua</h4>
        <p>
          La Trilogía Alles conecta armónicamente todos los procesos clave de Gestión del Talento Humano:
        </p>
        <div class="theory-callout" style="background: #F8FAFC; border-left: 4px solid var(--slate-700); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Atracción y Selección:</strong> Diseñar entrevistas estructuradas sobre el Tomo III para predecir desempeño con validez empírica.</li>
            <li><strong>Evaluación del Desempeño:</strong> Medir el cumplimiento de objetivos confrontando las conductas reales con las anclas BARS del Tomo II.</li>
            <li><strong>Desarrollo y Planes de Sucesión:</strong> Identificar la brecha exacta entre el grado actual del colaborador y el grado requerido por el puesto objetivo.</li>
          </ul>
        </div>
        <p style="margin-top: 1rem; font-style: italic; color: var(--slate-600);">
          "Las competencias no son buenas intenciones ni virtudes morales; son conductas observables que marcan la diferencia entre un desempeño promedio y un desempeño superior." — Martha Alles
        </p>
      </div>
    `
  }),

  'mod-1-theory': Object.freeze({
    id: 'mod-1-theory',
    moduleId: 'mod-1',
    badgeId: 'badge-theory-mod-1',
    badgeName: 'Especialista en Ontología de Competencias',
    tagline: 'Espina Teórica 1.E • Fundamento Científico',
    title: 'Origen de las Competencias y el Modelo del Iceberg',
    author: 'David C. McClelland, Lyle M. Spencer & Signe M. Spencer',
    source: 'Testing for Competence Rather Than for Intelligence (1973) / Competence at Work (1993)',
    year: '1973 / 1993',
    citation: 'American Psychologist, 28(1), 1-14; John Wiley & Sons, New York.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. El Quiebre Paradigmático de David McClelland (1973)</h4>
        <p>
          En su investigación seminal publicada en 1973, McClelland demostró que las pruebas tradicionales de aptitud académica,
          los exámenes de conocimientos y los tests de Coeficiente Intelectual (CI):
        </p>
        <ul>
          <li><strong>No predicen el rendimiento laboral superior</strong> ni el éxito profesional sostenido.</li>
          <li><strong>Generan sesgos culturales y socioeconómicos</strong> que discriminan talentos operativos excepcionales.</li>
          <li>
            <strong>Conclusión clave:</strong> El único predictor fiable del desempeño sobresaliente son los
            <em>patrones de comportamiento observable</em> demostrados en el contexto específico de trabajo.
          </li>
        </ul>

        <h4>2. El Modelo del Iceberg de Spencer & Spencer (Adoptado por Martha Alles)</h4>
        <p>
          Martha Alles fundamenta su taxonomía en la metáfora del Iceberg, distinguiendo dos capas de la persona:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p><strong>Cúspide Visible (Fácil de detectar y entrenar):</strong></p>
          <ul style="margin-bottom: 0.5rem;">
            <li><strong>Destrezas (Skills):</strong> Habilidad física o cognitiva para ejecutar una tarea (p. ej., operar software, conducir un vehículo).</li>
            <li><strong>Conocimientos:</strong> Información técnica acumulada sobre un área (p. ej., legislación tributaria, contabilidad).</li>
          </ul>
          <p><strong>Base Sumergida (Profunda, núcleo del desempeño excelente):</strong></p>
          <ul>
            <li><strong>Auto-concepto:</strong> Actitudes y valores personales (la imagen de sí mismo).</li>
            <li><strong>Rasgos de personalidad:</strong> Disposición psicofísica consistente ante estímulos (p. ej., autocontrol, resiliencia).</li>
            <li><strong>Motivos intrínsecos:</strong> Impulsos inconscientes que dirigen la conducta (logro, afiliación, poder).</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/iceberg-spencer-alles.svg" alt="El Modelo del Iceberg de Competencias" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> El Modelo del Iceberg (Spencer &amp; Spencer / Alles): Destrezas visibles vs. base sumergida de la persona
          </figcaption>
        </figure>

        <h4>3. Por qué el "Copy-Paste" de Catálogos Fracasa en RRHH</h4>
        <p>
          Copiar un diccionario de competencias de otra corporación asume falsamente que los <em>motivos, rasgos y conductas críticas</em>
          para triunfar en la empresa A son idénticos a los requeridos en la empresa B.
        </p>
        <p>
          Al carecer de anclaje en la estrategia competitiva de la organización, el catálogo copiado se convierte en un
          trámite burocrático donde el 90% de los evaluados obtiene la máxima calificación sin que mejore la productividad real.
        </p>
      </div>
    `
  }),

  'mod-2-theory': Object.freeze({
    id: 'mod-2-theory',
    moduleId: 'mod-2',
    badgeId: 'badge-theory-mod-2',
    badgeName: 'Especialista en Ontología y Parsimonia',
    tagline: 'Espina Teórica 2.E • Marco Metodológico Alles Tomo I',
    title: 'Ontología de Competencias y la Ley de Parsimonia',
    author: 'Martha Alicia Alles & Richard Boyatzis',
    source: 'Dirección Estratégica de Recursos Humanos: Gestión por Competencias (Granica)',
    year: '2006 / 2016',
    citation: 'Alles, M. A. (2006). Diccionario de Competencias. La Trilogía, Tomo I. Ediciones Granica.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. La Tríada Ontológica de Martha Alles</h4>
        <p>
          Uno de los errores más destructivos en la gestión del talento es confundir los planos de la cultura organizacional.
          Alles establece tres categorías mutuamente excluyentes:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Categoría</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Naturaleza</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">¿Admite Grados A-D?</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Alcance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Valores Corporativos</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Axiológico / Moral (Honestidad, Respeto)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border);"><strong>NO</strong> (Se tienen o no se tienen)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Toda la empresa</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Competencias Cardinales</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Conductual Estratégico (Innovación, Calidad)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>SÍ</strong> (Graduable A-D)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">100% de la nómina</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Competencias Específicas</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Conductual Funcional (Negociación, Pensamiento Analítico)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>SÍ</strong> (Graduable A-D)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Puestos / Familias de puestos</td>
            </tr>
          </tbody>
        </table>

        <h4>2. Ley de Parsimonia en Modelos de Talento (Boyatzis & Alles)</h4>
        <p>
          Un modelo de competencias corporativo no es una enciclopedia. La evidencia empírica demuestra que modelos
          con más de <strong>7 u 8 competencias por puesto</strong> provocan sobrecarga cognitiva (<em>cognitive overload</em>)
          en evaluadores y comités, haciendo que las evaluaciones se conviertan en trámites mecánicos y aleatorios.
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p><strong>Regla de Oro de Alles:</strong></p>
          <ul>
            <li><strong>3 a 5 Competencias Cardinales</strong> para toda la organización.</li>
            <li><strong>3 a 4 Competencias Específicas</strong> por perfil de puesto.</li>
            <li>Total máximo recomendado por colaborador: <strong>6 a 8 competencias evaluables</strong>.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/matriz-cardinales-especificas.svg" alt="Matriz de Competencias Cardinales y Específicas" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> Arquitectura de Competencias y Ley de Parsimonia: Cardinales vs. Específicas
          </figcaption>
        </figure>

        <h4>3. La Fórmula de Construcción Rigurosa de Alles</h4>
        <p>
          Toda definición técnica de competencia debe articular obligatoriamente <strong>4 componentes inmutables</strong> para garantizar objetividad psicométrica y anclaje conductual:
        </p>
        <div class="theory-callout" style="background: #F8FAFC; border: 1px solid var(--border-subtle); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: var(--slate-900);">Fórmula Sintáctica Alles (Tomo I):</p>
          <code style="display: block; background: #FFFFFF; padding: 0.65rem 0.85rem; border: 1px solid var(--border-subtle); border-radius: 4px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--slate-900);">[Verbo de acción en infinitivo] + [Objeto de impacto / Dominio técnico] + [Contexto y complejidad organizacional] + [Propósito estratégico / Resultado esperado]</code>
        </div>
        <div class="theory-components-breakdown" style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">1. Verbo de acción en infinitivo</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">Define la conducta laboral directamente observable y medible, erradicando juicios morales o estados anímicos.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Ejemplo:</strong> "Diseñar, estructurar y ejecutar..." (Conductas operativas observables y auditables externamente).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Contra-ejemplo:</strong> "Ser una persona entusiasta, amar la empresa o sentir verdadera vocación..." (Juicios de valor, estados afectivos o actitudes morales no medibles).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">2. Objeto de impacto / Dominio técnico</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">El entregable, sistema, proceso o materia prima sobre el que recae directamente la acción laboral.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Ejemplo:</strong> "...el plan operativo de distribución logística y los acuerdos de nivel de servicio (SLAs)..." (Entregable concreto del negocio).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Contra-ejemplo:</strong> "...la buena vibra del departamento o la felicidad integral de la oficina..." (Conceptos difusos, intangibles o desconectados del flujo de trabajo real).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">3. Contexto y complejidad organizacional</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">El entorno de incertidumbre, presión temporal (SLAs) o nivel de interlocución exigido.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Ejemplo:</strong> "...en situaciones de alta volatilidad de demanda y plazos críticos de entrega inferiores a 24 horas..." (Condiciones operativas y restricciones reales).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Contra-ejemplo:</strong> "...únicamente cuando las condiciones meteorológicas son favorables o no hay urgencias..." (Condición permisiva o trivial que anula la exigencia del rol).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">4. Propósito estratégico / Resultado esperado</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">El valor de negocio tangible o impacto cuantificable que justifica la competencia.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Ejemplo:</strong> "...garantizando una tasa de cumplimiento de despachos superior al 98% sin desviar los costos presupuestados." (Impacto medible en KPIs y rentabilidad).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Contra-ejemplo:</strong> "...para que los jefes estén satisfechos y los compañeros nos dediquen una sonrisa afectuosa." (Aprobación social subjetiva sin retorno de valor organizacional).</div>
          </div>
        </div>
        <div class="theory-callout" style="background: linear-gradient(135deg, #FFFDF5 0%, #FEF9C3 100%); border: 1.5px solid #F59E0B; border-left: 5px solid #D97706; padding: 1rem 1.25rem; margin: 1.25rem 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.08);">
          <p style="margin: 0 0 0.5rem 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #92400E; display: flex; align-items: center; gap: 0.4rem;">
            <span>★</span> Reglas Clave / Reglas de Oro de Construcción:
          </p>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--slate-900); font-size: 0.88rem; line-height: 1.6;">
            <li><strong style="color: #92400E;">Cero términos morales:</strong> Vetados adjetivos como "bueno", "leal", "sano", "entusiasta" o "amor por la camiseta".</li>
            <li><strong style="color: #92400E;">Unicidad:</strong> Una competencia evalúa un solo constructo; jamás fusiones dos competencias (ej. "Liderazgo y Negociación Ágil").</li>
            <li><strong style="color: #92400E;">Ley de Parsimonia:</strong> Máximo 3 a 5 Cardinales para toda la empresa y 3 a 4 Específicas por puesto de trabajo.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/formula-alles-blocks.svg" alt="Fórmula Alles de 4 Componentes" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> La Fórmula Alles de 4 Componentes Indisolubles: Verbo, Objeto, Contexto y Propósito
          </figcaption>
        </figure>
      </div>
    `
  }),

  'mod-3-theory': Object.freeze({
    id: 'mod-3-theory',
    moduleId: 'mod-3',
    badgeId: 'badge-theory-mod-3',
    badgeName: 'Especialista en Taxonomía BARS y Elliott Jaques',
    tagline: 'Espina Teórica 3.E • Marco Metodológico Alles Tomo II',
    title: 'Taxonomía Conductual BARS y Niveles de Discreción',
    author: 'Martha Alicia Alles & Elliott Jaques',
    source: 'Diccionario de Comportamientos (Tomo II) / Requisite Organization',
    year: '2007 / 1989',
    citation: 'Alles, M. A. (2007). Diccionario de Comportamientos. La Trilogía, Tomo II. Ediciones Granica.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. La Falacia Psicométrica de las Escalas Adjetivales Likert</h4>
        <p>
          Las organizaciones que evalúan con adverbios (<em>"Raras veces / Frecuentemente / Siempre"</em>) o adjetivos
          (<em>"Regular / Bueno / Muy Bueno / Excelente"</em>) sufren de varianza no controlada:
        </p>
        <ul>
          <li>Un evaluador benévolo califica "Excelente" a quien solo hace su trabajo sin crear problemas.</li>
          <li>Un evaluador estricto reserva el "Excelente" para desempeños sobrehumanos casi inalcanzables.</li>
          <li><strong>Resultado:</strong> Desconfianza total en el sistema y evaluaciones incompatibles entre departamentos.</li>
        </ul>

        <h4>2. Escalas Conductuales Ancladas (BARS - Behaviorally Anchored Rating Scales)</h4>
        <p>
          Martha Alles adopta la metodología BARS mediante su taxonomía cuatridimensional (Grados A, B, C y D):
        </p>
        <ul>
          <li><strong>Grado A (100% - Superior):</strong> Desempeño referente y sistémico. Modela la conducta para toda la organización, diseña políticas o resuelve crisis inéditas.</li>
          <li><strong>Grado B (75% - Muy Bueno):</strong> Desempeño autónomo en alta complejidad. Resuelve contingencias sin supervisión dentro de su ámbito de gestión.</li>
          <li><strong>Grado C (50% - Estándar Requerido):</strong> Desempeño mínimo aceptable. Cumple los estándares operativos en condiciones normales de trabajo.</li>
          <li><strong>Grado D (25% - Inicial / En Desarrollo):</strong> Desempeño insatisfactorio o en formación. No alcanza el estándar mínimo regular; requiere supervisión continua.</li>
        </ul>

        <h4>3. Niveles de Discreción y Horizonte Temporal (Elliott Jaques)</h4>
        <p>
          La diferencia entre el Grado C y el Grado A no es de intensidad léxica ("bien" vs. "maravillosamente"),
          sino de <strong>horizonte temporal y complejidad discrecional</strong>:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Grado C:</strong> Horizonte de inmediatez operativa (días a semanas); ejecuta procedimientos definidos.</li>
            <li><strong>Grado B:</strong> Horizonte táctico (meses); adapta procedimientos y resuelve contingencias departamentales.</li>
            <li><strong>Grado A:</strong> Horizonte sistémico/estratégico (1 a 3 años); diseña doctrina, influye fuera de su área y anticipa el cambio organizacional.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/escala-bars-jaques.svg" alt="Escala Taxonómica BARS de Martha Alles y Elliott Jaques" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> Graduación Taxonómica BARS A-B-C-D basada en autonomía, horizonte temporal e impacto organizacional
          </figcaption>
        </figure>

        <h4>4. Principio de Inclusión Acumulativa</h4>
        <p>
          En la metodología Alles, los niveles son acumulativos: quien posee el Grado A domina y ejecuta necesariamente
          las conductas de los Grados B, C y D.
        </p>
      </div>
    `
  }),

  'mod-4-theory': Object.freeze({
    id: 'mod-4-theory',
    moduleId: 'mod-4',
    badgeId: 'badge-theory-mod-4',
    badgeName: 'Especialista en Entrevistas BBI y Validez Predictiva',
    tagline: 'Espina Teórica 4.E • Marco Metodológico Alles Tomo III',
    title: 'Técnica de Incidentes Críticos y Validez Predictiva de BBI',
    author: 'John C. Flanagan, Frank L. Schmidt & Martha Alicia Alles',
    source: 'The Critical Incident Technique (1954) / Diccionario de Preguntas (Tomo III)',
    year: '1954 / 2008',
    citation: 'Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology. Psychological Bulletin.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. La Técnica de Incidentes Críticos (John C. Flanagan, 1954)</h4>
        <p>
          Durante la Segunda Guerra Mundial, Flanagan descubrió que para evaluar la pericia de pilotos de combate,
          preguntarles por sus opiniones o conocimientos teóricos era inútil.
          El método científico exige registrar <strong>incidentes críticos específicos</strong>: sucesos reales donde
          una acción concreta del sujeto produjo un desenlace excepcionalmente exitoso o desastroso.
        </p>

        <h4>2. Metanálisis de Validez Predictiva (Schmidt & Hunter)</h4>
        <p>
          Las investigaciones psicométricas demuestran el abismo de exactitud entre modalidades de entrevista:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Método de Evaluación</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Coeficiente de Validez (r)</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Riesgo Principal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Entrevista Tradicional No Estructurada ("¿Qué harías?")</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border);"><strong>r ≈ 0.35 - 0.38</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Evalúa elocuencia y simpatía; sesgo de afinidad.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Tests Psicométricos de Personalidad Genéricos</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>r ≈ 0.31 - 0.40</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Deseabilidad social y falsificación de respuestas.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Entrevista por Incidentes Críticos BBI / STAR</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>r ≈ 0.51 - 0.65</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Requiere entrevistadores entrenados en repreguntas de sondeo.</td>
            </tr>
          </tbody>
        </table>

        <h4>3. El Axioma Central de Martha Alles en Selección</h4>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p style="font-size: 1.05rem; font-style: italic; margin-bottom: 0.5rem;">
            "El mejor predictor de cómo una persona se comportará mañana en su trabajo es cómo se comportó ayer en una situación semejante."
          </p>
          <p style="font-size: 0.88rem; color: var(--slate-700);">
            — Martha Alicia Alles, Diccionario de Preguntas (Tomo III)
          </p>
        </div>

        <h4>4. Neutralización de la Deseabilidad Social mediante Probing</h4>
        <p>
          Un candidato experimentado puede memorizar discursos teóricos impecables. La técnica BBI lo desarma mediante
          <strong>preguntas de sondeo (Follow-up Probing)</strong> que fuerzan el relato de hechos empíricos:
        </p>
        <ul>
          <li><strong>Desarmar el "Nosotros":</strong> <em>"Tu equipo logró la meta, pero tú personalmente, ¿cuál fue tu decisión específica en ese instante?"</em></li>
          <li><strong>Verificar la métrica:</strong> <em>"¿Cómo supiste que el problema se solucionó? ¿Qué indicador de negocio cambió?"</em></li>
          <li><strong>Aislar la contingencia:</strong> <em>"¿Qué salió mal inicialmente y cómo modificaste tu conducta ante el imprevisto?"</em></li>
        </ul>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/flujo-star-sondeo.svg" alt="El Embudo STAR y Protocolo de Sondeo" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> El Embudo STAR y la técnica de preguntas de sondeo para desarmar respuestas hipotéticas
          </figcaption>
        </figure>
      </div>
    `
  }),

  'mod-5-theory': Object.freeze({
    id: 'mod-5-theory',
    moduleId: 'mod-5',
    badgeId: 'badge-theory-mod-5',
    badgeName: 'Especialista en Calibración y Confiabilidad Inter-Juez',
    tagline: 'Espina Teórica 5.E • Calibración y Métricas de Calidad Alles',
    title: 'Confiabilidad Inter-Jueces (Kappa) y Sesgos de Evaluación',
    author: 'Jacob Cohen, Joseph L. Fleiss & Martha Alicia Alles',
    source: 'Dirección Estratégica de Recursos Humanos & Desempeño 360° / Psychological Measurement',
    year: '1960 / 2009',
    citation: 'Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37-46.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. Matriz de Sesgos Clásicos en Evaluación del Desempeño</h4>
        <p>
          Cuando las competencias carecen de anclajes BARS objetivos, los evaluadores incurren en distorsiones sistemáticas:
        </p>
        <ul>
          <li><strong>Efecto Halo / Horns:</strong> Extrapolar un rasgo aislado agradable (p. ej., carisma o puntualidad) para inflar artificialmente todas las calificaciones de la competencia, o un defecto menor para destruirlas.</li>
          <li><strong>Sesgo de Benevolencia (Leniency):</strong> Otorgar calificaciones de Nivel A y B a casi todos los evaluados para evitar fricciones personales o conversaciones difíciles de retroalimentación.</li>
          <li><strong>Sesgo de Severidad:</strong> Rigor punitivo excesivo que genera desmotivación generalizada y desconfianza en el liderazgo.</li>
          <li><strong>Sesgo de Tendencia Central:</strong> Calificar a toda la nómina en Grado C por falta de observación directa o desinterés en el proceso evaluativo.</li>
        </ul>

        <h4>2. Medición de Confiabilidad Inter-Jueces (Coeficiente Kappa)</h4>
        <p>
          En comités de calibración de talento, la consistencia del marco de competencias se audita mediante el
          <strong>Coeficiente Kappa de Cohen / Fleiss (&kappa;)</strong>:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>&kappa; &lt; 0.40:</strong> Pobre concordancia. El modelo es ambiguo; los evaluadores adivinan o interpretan subjetivamente.</li>
            <li><strong>&kappa; entre 0.60 y 0.75:</strong> Concordancia sustancial. Modelo funcional con leves discrepancias entre áreas.</li>
            <li><strong>&kappa; &gt; 0.80:</strong> Concordancia casi perfecta. El anclaje BARS (A-B-C-D) asegura que dos evaluadores independientes arriben al mismo diagnóstico conductual en más del 85% de los casos.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/ficha-tecnica-blueprint.svg" alt="Blueprint de la Ficha Técnica de Competencia" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> Blueprint de la Ficha Técnica Corporativa: Estructura del entregable final de consultoría
          </figcaption>
        </figure>

        <h4>3. Matriz Estándar de Competencias y Documentación Corporativa</h4>
        <p>
          Para integrar y estandarizar la ficha en la gestión estratégica del talento (evaluaciones 360°, planes de carrera y selección), se consolida la escala objetiva de 4 niveles de la Trilogía Martha Alles:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Nivel Alles</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Ponderación</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Criterio de Desempeño</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Impacto en el Negocio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grado D</strong> (Inicial)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">25%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border, #B91C1C); font-weight: 600;">En desarrollo / Requiere supervisión</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Riesgo de desvío operativo; requiere tutela directa.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grado C</strong> (Estándar)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">50%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Estándar mínimo esperado (Puesto cubierto)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Autonomía operativa en el alcance de su rol.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grado B</strong> (Muy Bueno)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">75%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Desempeño superior / Alta complejidad</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Resuelve contingencias imprevistas y asesora a pares.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grado A</strong> (Superior)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">100%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Referente sistémico / Mentor corporativo</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Crea doctrina, diseña estrategias e impacta a toda la compañía.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  })
});

export const THEORY_DATA_EN = Object.freeze({
  'mod-0-theory': Object.freeze({
    id: 'mod-0-theory',
    moduleId: 'mod-0',
    badgeId: 'badge-theory-mod-0',
    badgeName: 'Specialist in the Martha Alles Trilogy',
    tagline: 'Theoretical Spine 0.E • Alles Trilogy Architecture',
    title: 'The Martha Alles Trilogy as an Integrated Scientific System',
    author: 'Martha Alicia Alles',
    source: 'Strategic Human Resource Management: Competency-Based Management',
    year: '2006',
    citation: 'Alles, M. A. (2006). Strategic Human Resource Management: Competency-Based Management. Ediciones Granica, Buenos Aires.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. The Martha Alles Trilogy as an Integrated and Indissoluble System</h4>
        <p>
          One of the primary errors in organizations is treating competencies as isolated documents or mere recruiting formalities.
          Martha Alles structured her methodology across three works forming a closed, verifiable circuit:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Volume I (Competency Dictionary):</strong> Establishes universal conceptual definitions (cardinal and specific) with syntactic rigor, free from moral or evaluative judgments.</li>
            <li><strong>Volume II (Behavior Dictionary):</strong> Translates each competency into a four-dimensional taxonomic scale (Grades A, B, C, and D) with observable behavioral anchoring (BARS).</li>
            <li><strong>Volume III (Question Dictionary):</strong> Provides the audit and inquiry protocol using past critical incident questions (BBI / STAR) and probing questions.</li>
          </ul>
        </div>
        <p>
          If one part of the system is altered without calibrating the other two, the corporate framework collapses into subjectivity or rating inflation.
        </p>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/trilogia-circuito-en.svg" alt="Martha Alles Trilogy Closed Circuit" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> The indissoluble circuit of the Martha Alles Trilogy: Definitions, Behaviors, and Questions
          </figcaption>
        </figure>

        <h4>2. Strategic Alignment: From Business Strategy to Job Role</h4>
        <p>
          In the Alles methodology, competencies are not derived from abstract theory nor copied from external manuals. They stem directly from the <strong>vision, mission, and strategy</strong> of the company:
        </p>
        <ul>
          <li><strong>Cardinal Competencies:</strong> Those that everyone in the organization must demonstrate, regardless of hierarchical level or functional area, to make the global strategy viable.</li>
          <li><strong>Specific Competencies:</strong> Behaviors required exclusively for an area, job family, or managerial level (for example, executive leadership or specialized engineering competencies).</li>
        </ul>

        <h4>3. The Continuous Calibration Operational Circuit</h4>
        <p>
          The Alles Trilogy harmoniously connects all core Human Talent Management processes:
        </p>
        <div class="theory-callout" style="background: #F8FAFC; border-left: 4px solid var(--slate-700); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Talent Acquisition and Selection:</strong> Designing structured interviews based on Volume III to predict job performance with empirical validity.</li>
            <li><strong>Performance Evaluation:</strong> Measuring goal fulfillment by comparing actual behaviors against the BARS anchors in Volume II.</li>
            <li><strong>Development and Succession Planning:</strong> Pinpointing the exact gap between an employee's current grade and the grade required for the target role.</li>
          </ul>
        </div>
        <p style="margin-top: 1rem; font-style: italic; color: var(--slate-600);">
          "Competencies are not good intentions or moral virtues; they are observable behaviors that make the difference between average performance and superior performance." — Martha Alles
        </p>
      </div>
    `
  }),

  'mod-1-theory': Object.freeze({
    id: 'mod-1-theory',
    moduleId: 'mod-1',
    badgeId: 'badge-theory-mod-1',
    badgeName: 'Specialist in Competency Ontology',
    tagline: 'Theoretical Spine 1.E • Scientific Foundation',
    title: 'Origins of Competencies and the Iceberg Model',
    author: 'David C. McClelland, Lyle M. Spencer & Signe M. Spencer',
    source: 'Testing for Competence Rather Than for Intelligence (1973) / Competence at Work (1993)',
    year: '1973 / 1993',
    citation: 'American Psychologist, 28(1), 1-14; John Wiley & Sons, New York.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. David McClelland's Paradigmatic Breakthrough (1973)</h4>
        <p>
          In his seminal research published in 1973, McClelland demonstrated that traditional academic aptitude tests,
          knowledge exams, and IQ tests:
        </p>
        <ul>
          <li><strong>Do not predict superior job performance</strong> or sustained career success.</li>
          <li><strong>Generate cultural and socioeconomic biases</strong> that discriminate against exceptional operational talent.</li>
          <li>
            <strong>Core conclusion:</strong> The only reliable predictor of outstanding performance is
            <em>observable behavioral patterns</em> demonstrated in specific job contexts.
          </li>
        </ul>

        <h4>2. The Spencer & Spencer Iceberg Model (Adopted by Martha Alles)</h4>
        <p>
          Martha Alles grounds her taxonomy on the Iceberg metaphor, distinguishing two layers of the individual:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p><strong>Visible Tip (Easy to detect and train):</strong></p>
          <ul style="margin-bottom: 0.5rem;">
            <li><strong>Skills:</strong> Physical or cognitive capability to execute a specific task (e.g., operating software, operating equipment).</li>
            <li><strong>Knowledge:</strong> Technical information accumulated on a subject area (e.g., tax legislation, financial accounting).</li>
          </ul>
          <p><strong>Submerged Base (Deep, core driver of superior performance):</strong></p>
          <ul>
            <li><strong>Self-Concept:</strong> Personal attitudes, values, and self-image.</li>
            <li><strong>Personality Traits:</strong> Consistent psychophysical disposition when responding to situations (e.g., emotional self-control, resilience).</li>
            <li><strong>Intrinsic Motives:</strong> Unconscious drivers directing recurring behavior (achievement, affiliation, power).</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/iceberg-spencer-alles-en.svg" alt="The Competency Iceberg Model" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> The Iceberg Model (Spencer &amp; Spencer / Alles): Visible skills vs. deep behavioral foundation
          </figcaption>
        </figure>

        <h4>3. Why "Copy-Pasting" Catalogs Fails in HR</h4>
        <p>
          Copying a competency dictionary from another organization falsely assumes that the <em>motives, traits, and critical behaviors</em>
          required to succeed in Company A are identical to those required in Company B.
        </p>
        <p>
          Lacking roots in organizational competitive strategy, copied catalogs devolve into bureaucratic checkboxes
          where 90%+ of employees receive top ratings without real productivity gains.
        </p>
      </div>
    `
  }),

  'mod-2-theory': Object.freeze({
    id: 'mod-2-theory',
    moduleId: 'mod-2',
    badgeId: 'badge-theory-mod-2',
    badgeName: 'Specialist in Ontology and Parsimony',
    tagline: 'Theoretical Spine 2.E • Alles Methodological Framework Volume I',
    title: 'Competency Ontology and the Law of Parsimony',
    author: 'Martha Alicia Alles & Richard Boyatzis',
    source: 'Strategic Human Resource Management: Competency-Based Management (Granica)',
    year: '2006 / 2016',
    citation: 'Alles, M. A. (2006). Competency Dictionary. The Trilogy, Volume I. Ediciones Granica.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. Martha Alles's Ontological Triad</h4>
        <p>
          One of the most destructive mistakes in talent management is conflating organizational culture dimensions.
          Alles establishes three mutually exclusive categories:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Category</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Nature</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Admits Grades A-D?</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Corporate Values</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Axiological / Moral (Integrity, Respect)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border);"><strong>NO</strong> (Either present or absent)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Entire organization</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Cardinal Competencies</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Strategic Behavioral (Innovation, Quality Focus)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>YES</strong> (Gradable A-D)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">100% of staff</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Specific Competencies</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Functional Behavioral (Negotiation, Analytical Thinking)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>YES</strong> (Gradable A-D)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Roles / Role families</td>
            </tr>
          </tbody>
        </table>

        <h4>2. Law of Parsimony in Talent Models (Boyatzis & Alles)</h4>
        <p>
          A corporate competency framework is not an encyclopedia. Empirical evidence demonstrates that models
          with more than <strong>7 or 8 competencies per role</strong> trigger severe cognitive overload
          for managers and committees, degrading evaluations into perfunctory exercises.
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p><strong>Alles Golden Rule:</strong></p>
          <ul>
            <li><strong>3 to 5 Cardinal Competencies</strong> for the entire company.</li>
            <li><strong>3 to 4 Specific Competencies</strong> per job profile.</li>
            <li>Recommended maximum per employee: <strong>6 to 8 evaluable competencies</strong>.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/matriz-cardinales-especificas-en.svg" alt="Cardinal vs Specific Competencies Matrix" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> Competency Architecture and Law of Parsimony: Cardinal vs. Specific
          </figcaption>
        </figure>

        <h4>3. The Rigorous Alles Construction Formula</h4>
        <p>
          Every technical definition must articulate <strong>4 immutable components</strong> to guarantee psychometric objectivity and behavioral anchoring:
        </p>
        <div class="theory-callout" style="background: #F8FAFC; border: 1px solid var(--border-subtle); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 700; color: var(--slate-900);">Alles Syntactic Formula (Volume I):</p>
          <code style="display: block; background: #FFFFFF; padding: 0.65rem 0.85rem; border: 1px solid var(--border-subtle); border-radius: 4px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--slate-900);">[Action verb in infinitive] + [Impact object / Technical domain] + [Organizational context and complexity] + [Strategic purpose / Expected outcome]</code>
        </div>
        <div class="theory-components-breakdown" style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">1. Action verb in infinitive</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">Defines directly observable and measurable workplace behavior, eradicating moral judgments or emotional states.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Example:</strong> "Design, structure, and execute..." (Externally auditable operational behaviors).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Counter-example:</strong> "Be an enthusiastic person, love the company, or feel true calling..." (Subjective value judgments or unmeasurable emotional states).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">2. Impact object / Technical domain</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">The deliverable, system, process, or asset on which workplace action directly acts.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Example:</strong> "...the logistics distribution master plan and Service Level Agreements (SLAs)..." (Concrete business deliverable).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Counter-example:</strong> "...the positive departmental vibe or office happiness..." (Vague, intangible concepts decoupled from workflow).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">3. Organizational context and complexity</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">The environment of uncertainty, time pressures (SLAs), or required stakeholder interaction level.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Example:</strong> "...under volatile demand conditions and critical delivery deadlines under 24 hours..." (Realistic constraints).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Counter-example:</strong> "...only when weather conditions are favorable or when no emergencies arise..." (Trivial permissive conditions nullifying role expectations).</div>
          </div>
          <div style="background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 0.85rem 1rem;">
            <p style="margin: 0 0 0.35rem 0; font-weight: 700; color: var(--slate-900);">4. Strategic purpose / Expected outcome</p>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.88rem; color: var(--slate-700);">Tangible business value or quantifiable impact justifying the competency.</p>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #F0FDF4; border-left: 3px solid #059669; border-radius: 3px; margin-bottom: 0.35rem; color: var(--slate-900);"><strong style="color: #047857;">✓ Example:</strong> "...guaranteeing on-time dispatch rates above 98% without exceeding budgeted costs." (Measurable impact on KPIs and profitability).</div>
            <div style="font-size: 0.84rem; padding: 0.35rem 0.6rem; background: #FEF2F2; border-left: 3px solid #DC2626; border-radius: 3px; color: var(--slate-900);"><strong style="color: #B91C1C;">✕ Counter-example:</strong> "...so managers feel pleased and coworkers greet us warmly." (Subjective social approval without corporate return).</div>
          </div>
        </div>
        <div class="theory-callout" style="background: linear-gradient(135deg, #FFFDF5 0%, #FEF9C3 100%); border: 1.5px solid #F59E0B; border-left: 5px solid #D97706; padding: 1rem 1.25rem; margin: 1.25rem 0; border-radius: 6px;">
          <p style="margin: 0 0 0.5rem 0; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #92400E; display: flex; align-items: center; gap: 0.4rem;">
            <span>★</span> Key Takeaways / Drafting Golden Rules:
          </p>
          <ul style="margin: 0; padding-left: 1.2rem; color: var(--slate-900); font-size: 0.88rem; line-height: 1.6;">
            <li><strong style="color: #92400E;">Zero moral terms:</strong> Forbidden words include "good", "loyal", "healthy", "enthusiastic", or "passion for the badge".</li>
            <li><strong style="color: #92400E;">Uniqueness:</strong> A competency assesses a single construct; never merge two competencies (e.g., "Leadership and Agile Negotiation").</li>
            <li><strong style="color: #92400E;">Law of Parsimony:</strong> Maximum 3 to 5 Cardinal competencies company-wide and 3 to 4 Specific competencies per job role.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/formula-alles-blocks-en.svg" alt="Alles 4-Part Formula" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> The Alles 4-Part Technical Formula: Verb, Object, Context, and Purpose
          </figcaption>
        </figure>
      </div>
    `
  }),

  'mod-3-theory': Object.freeze({
    id: 'mod-3-theory',
    moduleId: 'mod-3',
    badgeId: 'badge-theory-mod-3',
    badgeName: 'Specialist in BARS Taxonomy and Elliott Jaques',
    tagline: 'Theoretical Spine 3.E • Alles Methodological Framework Volume II',
    title: 'BARS Behavioral Taxonomy and Time-Span of Discretion',
    author: 'Martha Alicia Alles & Elliott Jaques',
    source: 'Behavior Dictionary (Volume II) / Requisite Organization',
    year: '2007 / 1989',
    citation: 'Alles, M. A. (2007). Behavior Dictionary. The Trilogy, Volume II. Ediciones Granica.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. The Psychometric Fallacy of Likert Adjective Scales</h4>
        <p>
          Organizations that evaluate performance with adverbs (<em>"Rarely / Frequently / Always"</em>) or adjectives
          (<em>"Fair / Good / Very Good / Excellent"</em>) suffer from uncontrolled variance:
        </p>
        <ul>
          <li>A lenient evaluator awards "Excellent" to anyone who completes tasks without creating friction.</li>
          <li>A strict evaluator reserves "Excellent" for nearly superhuman feats.</li>
          <li><strong>Outcome:</strong> Complete lack of confidence in the appraisal system and cross-departmental friction.</li>
        </ul>

        <h4>2. Behaviorally Anchored Rating Scales (BARS)</h4>
        <p>
          Martha Alles operationalizes BARS methodology through her four-dimensional taxonomy (Grades A, B, C, and D):
        </p>
        <ul>
          <li><strong>Grade A (100% - Superior):</strong> Benchmark and systemic performance. Models behavior organization-wide, designs policies, or resolves unprecedented crises.</li>
          <li><strong>Grade B (75% - Very Good):</strong> Autonomous performance in high complexity. Solves department-level contingencies without supervision.</li>
          <li><strong>Grade C (50% - Required Standard):</strong> Minimum acceptable performance. Meets operating standards under regular working conditions.</li>
          <li><strong>Grade D (25% - Initial / In Development):</strong> Unsatisfactory or developing performance. Does not meet standard; requires continuous oversight.</li>
        </ul>

        <h4>3. Time-Span of Discretion and Temporal Horizons (Elliott Jaques)</h4>
        <p>
          The distinction between Grade C and Grade A is not adjectival intensity ("well" vs. "exceptionally"),
          but <strong>temporal horizon and discretionary complexity</strong>:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>Grade C:</strong> Immediate operational horizon (days to weeks); executes defined standard workflows.</li>
            <li><strong>Grade B:</strong> Tactical horizon (months); adapts procedures and resolves cross-functional contingencies.</li>
            <li><strong>Grade A:</strong> Strategic/systemic horizon (1 to 3 years); designs doctrine, influences beyond direct area, and anticipates change.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/escala-bars-jaques-en.svg" alt="BARS Taxonomic Scale" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> BARS Taxonomic Scale (A-B-C-D) anchored in discretion, time-horizon, and impact
          </figcaption>
        </figure>

        <h4>4. Principle of Cumulative Inclusion</h4>
        <p>
          Under the Alles framework, grades are cumulative: an individual demonstrating Grade A necessarily masters
          and executes the behavioral capabilities of Grades B, C, and D.
        </p>
      </div>
    `
  }),

  'mod-4-theory': Object.freeze({
    id: 'mod-4-theory',
    moduleId: 'mod-4',
    badgeId: 'badge-theory-mod-4',
    badgeName: 'Specialist in BBI Interviews and Predictive Validity',
    tagline: 'Theoretical Spine 4.E • Alles Methodological Framework Volume III',
    title: 'Critical Incident Technique and Predictive Validity of BBI',
    author: 'John C. Flanagan, Frank L. Schmidt & Martha Alicia Alles',
    source: 'The Critical Incident Technique (1954) / Question Dictionary (Volume III)',
    year: '1954 / 2008',
    citation: 'Schmidt, F. L., & Hunter, J. E. (1998). The validity and utility of selection methods in personnel psychology. Psychological Bulletin.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. The Critical Incident Technique (John C. Flanagan, 1954)</h4>
        <p>
          During World War II, Flanagan discovered that asking fighter pilots for theoretical opinions or self-appraisals was useless.
          Scientific assessment requires gathering <strong>specific critical incidents</strong>: actual past events where
          a subject's concrete action produced an exceptionally successful or disastrous outcome.
        </p>

        <h4>2. Meta-Analysis of Predictive Validity (Schmidt & Hunter)</h4>
        <p>
          Psychometric research proves the immense gap in predictive accuracy across interview formats:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Assessment Method</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Validity Coefficient (r)</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Primary Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Traditional Unstructured Interview ("What would you do?")</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border);"><strong>r ≈ 0.35 - 0.38</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Rates charm and eloquence; severe affinity bias.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Generic Personality Inventories</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>r ≈ 0.31 - 0.40</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Social desirability and faking responses.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Critical Incident BBI / STAR Structured Interview</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border);"><strong>r ≈ 0.51 - 0.65</strong></td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Requires interviewers trained in probing follow-ups.</td>
            </tr>
          </tbody>
        </table>

        <h4>3. The Central Axiom of Martha Alles in Selection</h4>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <p style="font-size: 1.05rem; font-style: italic; margin-bottom: 0.5rem;">
            "The best predictor of how an individual will behave tomorrow on the job is how they behaved yesterday in a similar situation."
          </p>
          <p style="font-size: 0.88rem; color: var(--slate-700);">
            — Martha Alicia Alles, Question Dictionary (Volume III)
          </p>
        </div>

        <h4>4. Neutralizing Social Desirability through Follow-up Probing</h4>
        <p>
          Articulate candidates often memorize flawless theoretical answers. BBI dismantles this through
          <strong>surgical follow-up probing</strong> that compels the candidate to recount verifiable facts:
        </p>
        <ul>
          <li><strong>Dismantling Corporate "We":</strong> <em>"Your team met the goal, but what was your specific personal decision in that moment?"</em></li>
          <li><strong>Verifying Metrics:</strong> <em>"How did you confirm the issue was solved? What business indicator shifted?"</em></li>
          <li><strong>Isolating Contingencies:</strong> <em>"What went wrong initially and how did you adjust your actions in response?"</em></li>
        </ul>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/flujo-star-sondeo-en.svg" alt="STAR Funnel and Probing Protocol" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> The STAR Funnel and Probing technique to dismantle hypothetical responses
          </figcaption>
        </figure>
      </div>
    `
  }),

  'mod-5-theory': Object.freeze({
    id: 'mod-5-theory',
    moduleId: 'mod-5',
    badgeId: 'badge-theory-mod-5',
    badgeName: 'Specialist in Calibration and Inter-Rater Reliability',
    tagline: 'Theoretical Spine 5.E • Calibration and Quality Metrics Alles',
    title: 'Inter-Rater Reliability (Kappa) and Evaluation Biases',
    author: 'Jacob Cohen, Joseph L. Fleiss & Martha Alicia Alles',
    source: 'Strategic Human Resource Management & 360° Feedback / Psychological Measurement',
    year: '1960 / 2009',
    citation: 'Cohen, J. (1960). A coefficient of agreement for nominal scales. Educational and Psychological Measurement, 20(1), 37-46.',
    html: `
      <div class="theory-deep-dive">
        <h4>1. Classic Biases Matrix in Performance Assessment</h4>
        <p>
          When competencies lack objective BARS anchors, evaluators succumb to systematic rating distortions:
        </p>
        <ul>
          <li><strong>Halo / Horns Effect:</strong> Allowing a single pleasant trait (e.g., charisma) to artificially inflate all competency ratings, or a minor flaw to depress them.</li>
          <li><strong>Leniency Bias:</strong> Awarding Grades A and B indiscriminately to avoid personal conflict or difficult developmental feedback.</li>
          <li><strong>Severity Bias:</strong> Excessive punitive strictness causing widespread demotivation and distrust in leadership.</li>
          <li><strong>Central Tendency Bias:</strong> Clustering all evaluations at Grade C due to lack of direct observation or disengagement from the process.</li>
        </ul>

        <h4>2. Measuring Inter-Rater Reliability (Kappa Coefficient)</h4>
        <p>
          In calibration committees, framework consistency is audited using the
          <strong>Cohen / Fleiss Kappa Coefficient (&kappa;)</strong>:
        </p>
        <div class="theory-callout" style="background: var(--mint-light); border-left: 4px solid var(--mint-primary); padding: 1rem; margin: 1rem 0; border-radius: 4px;">
          <ul>
            <li><strong>&kappa; &lt; 0.40:</strong> Poor agreement. Ambiguous framework; evaluators guess or interpret subjectively.</li>
            <li><strong>&kappa; between 0.60 and 0.75:</strong> Substantial agreement. Functional framework with minor cross-area discrepancies.</li>
            <li><strong>&kappa; &gt; 0.80:</strong> Almost perfect agreement. BARS anchoring (A-B-C-D) ensures two independent evaluators reach the identical behavioral diagnosis in over 85% of cases.</li>
          </ul>
        </div>

        <figure class="rise-figure">
          <div class="rise-figure-media">
            <img src="assets/img/diagrams/ficha-tecnica-blueprint-en.svg" alt="Competency Technical Specification Blueprint" class="rise-figure-img" loading="lazy">
          </div>
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">📊</span> Corporate Specification Blueprint: Final consulting deliverable structure
          </figcaption>
        </figure>

        <h4>3. Standard Competency Matrix and Corporate Documentation</h4>
        <p>
          To integrate and standardize the specification sheet into strategic talent management (360° appraisals, career paths, and selection), the Martha Alles 4-tier objective scale is consolidated:
        </p>
        <table class="rise-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr style="background: var(--slate-100); text-align: left;">
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Alles Level</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Weight</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Performance Criterion</th>
              <th style="padding: 0.5rem; border: 1px solid var(--slate-200);">Business Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grade D</strong> (Initial)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">25%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--danger-border, #B91C1C); font-weight: 600;">Developing / Requires supervision</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Risk of operational deviation; requires direct coaching.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grade C</strong> (Standard)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">50%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Minimum expected standard (Role fully covered)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Autonomous operational delivery within role scope.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grade B</strong> (Very Good)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">75%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Superior performance / High complexity</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Resolves unforeseen contingencies and mentors peers.</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);"><strong>Grade A</strong> (Superior)</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">100%</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200); color: var(--success-border, #047857); font-weight: 600;">Systemic benchmark / Corporate mentor</td>
              <td style="padding: 0.5rem; border: 1px solid var(--slate-200);">Creates doctrine, sets strategy, and impacts the entire organization.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  })
});

export const I18N_THEORY_DATA = Object.freeze({
  es: THEORY_DATA,
  en: THEORY_DATA_EN
});

export function getTheoryData(lang = 'es') {
  return lang === 'en' ? THEORY_DATA_EN : THEORY_DATA;
}

