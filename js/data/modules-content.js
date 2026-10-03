/**
 * Contenido Pedagógico Modular del Curso SCORM
 * Metodología Martha Alles: Creación y Calibración de Marcos de Competencias
 *
 * Módulos:
 * - Módulo 0: Introducción al Programa Metodológico (3 Preguntas Clave & Dinámica Dual-Track)
 * - Módulo 1: El Síndrome del Diccionario Copiado (Onboarding Invertido)
 * - Módulo 2: Ingeniería de Competencias (Cardinales vs. Específicas)
 * - Módulo 3: Taxonomía y Graduación de Comportamientos (A-B-C-D)
 * - Módulo 4: Entrevistas por Incidentes Críticos (BBI / STAR)
 * - Módulo 5: Capstone Studio — Banco de Pruebas y Calibración
 *
 * Layer: DATA (Inmutable / Frozen DTOs)
 */

export const MODULES_DATA = Object.freeze([
  // =========================================================================
  // MÓDULO 0: INTRODUCCIÓN Y ORIENTACIÓN ANDRAGÓGICA
  // =========================================================================
  Object.freeze({
    id: 'mod-0',
    number: 0,
    title: 'Introducción al Programa Metodológico',
    subtitle: 'Propósito del curso, mapa de competencias terminales y dinámica dual-track',
    leadIntro: 'La gestión de talento suele fracasar cuando adopta catálogos desanclados de la realidad operativa. Este espacio define las pautas de trabajo, el criterio científico y el modelo de autogestión que orientarán tu desarrollo metodológico.',
    badge: 'Módulo 0 • Introducción y Orientación',
    duration: '5 min',
    theoryId: 'mod-0-theory',
    objective: 'Comprender el propósito estratégico del curso, el compendio de objetivos de desempeño de los módulos 1 a 5 y autogestionar el recorrido dual-track (práctica o teoría).',
    overview: `
      Bienvenido al programa especializado en Creación y Calibración de Competencias Laborales bajo la metodología Martha Alles.
      Este módulo introductorio establece el propósito del curso, presenta las habilidades y competencias que adquirirás
      al completar cada lección y explica cómo utilizar la metodología dual-track para aprender a tu propio ritmo.
    `,
    introData: Object.freeze({
      questions: Object.freeze([
        Object.freeze({
          id: 'q1-purpose',
          number: 1,
          question: '¿Por qué estás aquí?',
          title: 'Propósito Estratégico del Curso',
          icon: '🎯',
          summary: 'Erradicar la inflación de evaluaciones y construir marcos de talento hiper-alineados con el negocio.',
          details: `
            <p>
              En el 80% de las organizaciones se repite un patrón destructivo: las áreas de Recursos Humanos
              <strong>descargan catálogos genéricos de internet</strong> o copian diccionarios de otras empresas.
            </p>
            <p>
              El resultado es la <em>inflación artificial de calificaciones</em>: evaluaciones de desempeño donde el
              <strong>94% de los colaboradores resulta "Sobresaliente"</strong>, mientras los proyectos estratégicos
              se retrasan por descoordinación, conflictos internos y contrataciones fallidas.
            </p>
            <div class="rise-callout-metric" style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.85rem 1.15rem; margin: 0.75rem 0; border-radius: 6px;">
              <strong>Misión formativa:</strong> Este programa te capacita como <strong>Arquitecto y Consultor de Talento</strong>
              capaz de construir, graduar y auditar un marco de competencias propio, riguroso y anclado a la estrategia real de tu organización,
              utilizando el estándar científico de la <strong>Trilogía Martha Alles</strong>.
            </div>
            <figure class="rise-figure" style="margin: 0.85rem 0;">
              <div class="rise-figure-media">
                <img src="assets/img/diagrams/trilogia-circuito.svg" alt="Circuito Cerrado de la Trilogía Martha Alles" class="rise-figure-img" loading="lazy">
              </div>
              <figcaption class="rise-figure-caption">
                <span class="rise-figure-caption-icon">📊</span> El circuito integrado de los 3 tomos de Martha Alles: Definición, Graduación y Preguntas
              </figcaption>
            </figure>
          `
        }),
        Object.freeze({
          id: 'q2-objectives',
          number: 2,
          question: '¿Qué lograrás al terminar?',
          title: 'Compendio de Objetivos de Desempeño',
          icon: '🏆',
          summary: 'Cinco capacidades operativas y de consultoría listas para aplicar en el puesto de trabajo.',
          details: `
            <p>Al concluir el recorrido de los 5 módulos subsiguientes habrás dominado las siguientes capacidades técnicas:</p>
            <div class="rise-roadmap-grid" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Módulo 1 • Diagnóstico Invertido:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Identificar la causa raíz del fracaso de los catálogos copiados y aislar el concepto de competencia como conducta observable orientada a resultados (Superar el "Síndrome del Diccionario Copiado").</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Módulo 2 • Ingeniería de Competencias:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Dominar la fórmula técnica Alles de 4 componentes (Verbo + Objeto + Contexto + Propósito) para redactar definiciones libres de sesgos morales y aplicar la Ley de Parsimonia (cardinales vs. específicas).</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Módulo 3 • Calibración Conductual (BARS A-B-C-D):</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Graduar comportamientos en 4 niveles objetivos (A-D) basados en autonomía e impacto organizacional (Elliott Jaques), erradicando las escalas adjetivales subjetivas en comités de calibración.</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Módulo 4 • Entrevistas por Incidentes Críticos (BBI / STAR):</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Formular protocolos de entrevista y preguntas de sondeo pasadas reales para neutralizar respuestas ensayadas de postulantes y predecir el desempeño con alta validez (r = 0.51-0.65).</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Módulo 5 • Capstone Studio y Certificación:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Construir, auditar y certificar una Ficha Técnica completa superando el 100% de la rúbrica binaria de 4 criterios, dejándola lista para su exportación formal a Word (.docx) e implementación corporativa.</p>
              </div>
            </div>
          `
        }),
        Object.freeze({
          id: 'q3-reto-invertido',
          number: 3,
          question: '¿Qué es el "Reto Invertido" y por qué aprendemos así?',
          title: 'Metodología Andragógica: El Reto Invertido',
          icon: '🔄',
          summary: 'Aprender desde el dilema y la crisis real antes de ver la teoría formal: el principio del fallo productivo.',
          details: `
            <p>
              En la formación corporativa tradicional impera el modelo pasivo: primero te obligan a memorizar
              decenas de diapositivas conceptuales y al final te hacen una prueba de memoria abstracta.
              En el aprendizaje de adultos (andragogía), ese enfoque fracasa: el profesional olvida el 80% al día siguiente
              porque no conecta con sus urgencias laborales reales.
            </p>
            <div style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.85rem 1.15rem; margin: 0.75rem 0; border-radius: 6px;">
              <strong style="color: var(--mint-dark); font-size: 0.95rem;">¿Cómo opera el Reto Invertido en este curso?</strong>
              <ul style="margin: 0.5rem 0 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--slate-800); line-height: 1.55;">
                <li><strong>Inicias en la trinchera:</strong> Cada módulo arranca sumergiéndote directamente en un dilema, crisis o artefacto roto de una organización real (un comité gerencial en conflicto por adjetivos, un catálogo bajado de internet que infló evaluaciones, una entrevista simulada engañosa).</li>
                <li><strong>Quiebre Cognitivo y Fallo Productivo:</strong> Experimentas de inmediato por qué las intuiciones o respuestas convencionales fallan, tomando conciencia exacta de tu brecha de competencia.</li>
                <li><strong>La teoría como solución viva:</strong> La fundamentación de la Trilogía Martha Alles ya no es un trámite académico; se convierte en la herramienta técnica indispensable para diagnosticar y resolver el problema.</li>
              </ul>
            </div>
            <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: var(--slate-600); font-style: italic;">
              "No memorizamos definiciones para buscar dónde aplicarlas; enfrentamos el problema real para que la metodología adquiera sentido operativo inmediato."
            </p>
          `
        }),
        Object.freeze({
          id: 'q4-how-it-works',
          number: 4,
          question: '¿Cómo funciona la doble vía (Dual-Track)?',
          title: 'Navegación Flexible: Práctica vs. Teoría',
          icon: '⚡',
          summary: 'Autonomía total: resuelve los retos prácticos y consulta el soporte metodológico off-canvas cuando lo necesites.',
          details: `
            <p>
              Este curso no es un libro digitalizado ni un pase de diapositivas pasivo.
              Está diseñado bajo el modelo <strong>Action Mapping (Kathy Moore)</strong> y el principio del <strong>Fallo Productivo</strong>:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <div style="background: var(--mint-light); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 6px;">
                <h5 style="color: var(--mint-dark); margin: 0 0 0.5rem; font-size: 0.95rem;">🚀 Ruta Práctica (Action-First)</h5>
                <p style="margin: 0; font-size: 0.86rem; color: var(--slate-700);">
                  Enfrentarás dilemas reales, comités de gerentes en conflicto y simuladores de entrevistas conversacionales.
                  Aprenderás experimentando las consecuencias operativas de tus decisiones.
                </p>
              </div>
              <div style="background: #F1F5F9; border: 1px solid #CBD5E1; padding: 1rem; border-radius: 6px;">
                <h5 style="color: var(--slate-900); margin: 0 0 0.5rem; font-size: 0.95rem;">📖 Ruta Teórica (Deep-Dive Opcional)</h5>
                <p style="margin: 0; font-size: 0.86rem; color: var(--slate-700);">
                  Cada módulo cuenta con un panel off-canvas con el sustento metodológico y científico riguroso
                  (McClelland, Spencer & Spencer, Elliott Jaques, Flanagan, Cohen, Martha Alles).
                </p>
              </div>
            </div>
            <div class="rise-callout-metric" style="background: #FFFFFF; border: 2px dashed var(--mint-primary); padding: 0.85rem 1.15rem; border-radius: 6px;">
              <strong>Tú decides por dónde empezar:</strong> Puedes lanzarte directo a resolver los retos prácticos y consultar la teoría cuando sientas la necesidad, o revisar primero la fundamentación metodológica antes de intervenir en los casos. ¡Ambos caminos son válidos y reconocidos!
            </div>
            <figure class="rise-figure" style="margin: 0.85rem 0;">
              <div class="rise-figure-media">
                <img src="assets/img/diagrams/dual-track-pathway.svg" alt="Dinámica Dual-Track: Práctica vs. Teoría" class="rise-figure-img" loading="lazy">
              </div>
              <figcaption class="rise-figure-caption">
                <span class="rise-figure-caption-icon">⚡</span> Dinámica Dual-Track: Reto práctico invertido con teoría on-demand sin bloqueo
              </figcaption>
            </figure>
          `
        })
      ]),
      pathways: Object.freeze({
        title: '¿Por dónde deseas comenzar tu recorrido?',
        practiceChoice: Object.freeze({
          title: 'Empezar por la Práctica (Reto Módulo 1)',
          description: 'Sumérgete de inmediato en el Caso Novatech: 94% de evaluaciones sobresalientes falsas.',
          targetModuleIndex: 1
        }),
        theoryChoice: Object.freeze({
          title: 'Revisar Fundamentos Teóricos Primero',
          description: 'Abre el panel metodológico para explorar la arquitectura de la Trilogía Martha Alles y el modelo andragógico.',
          theoryId: 'mod-0-theory'
        })
      })
    })
  }),

  // =========================================================================
  // MÓDULO 1
  // =========================================================================
  Object.freeze({
    id: 'mod-1',
    number: 1,
    title: 'El Síndrome del Diccionario Copiado',
    subtitle: 'Por qué fracasan los marcos de competencias bajados de internet',
    leadIntro: 'Importar catálogos genéricos de internet crea una distorsión crítica en las organizaciones: evaluaciones con calificaciones infladas al máximo mientras la productividad, el clima interno y la coordinación entre áreas sufren un deterioro constante.',
    badge: 'Módulo 1 • Diagnóstico Invertido',
    duration: '10 min',
    theoryId: 'mod-1-theory',
    objective: 'Identificar la causa raíz del fallo de los catálogos genéricos y adoptar el concepto de competencia como conducta observable orientada al negocio.',
    overview: `
      En este módulo inicial experimentarás el dolor más común de las áreas de Talento:
      contar con catálogos extensos de competencias donde todos los colaboradores obtienen evaluaciones sobresalientes,
      mientras la productividad y el clima laboral se deterioran.
    `,
    challenge: Object.freeze({
      id: 'challenge-1',
      moduleId: 'mod-1',
      badge: 'Reto Invertido • Action Mapping',
      title: 'El Caso Novatech: 94% de Evaluaciones Sobresalientes',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-novatech-crisis.svg',
        alt: 'Caso Novatech S.A. e Inflación de Calificaciones',
        caption: 'Novatech S.A.: Paradoja de evaluación (94% sobresaliente vs. lanzamientos colapsados).'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            Acabas de asumir como <strong>Líder de Talento en Novatech</strong>, empresa de desarrollo tecnológico y servicios cloud.
            Hace 8 meses, la gerencia anterior descargó de un portal de RRHH un catálogo estándar con 50 competencias.
          </p>
          <div class="rise-callout-metric" style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.75rem 1rem; margin: 0.75rem 0; border-radius: 4px;">
            <strong>Resultado de la última evaluación de desempeño:</strong><br>
            El <strong>94% de la nómina</strong> obtuvo calificación <em>"Sobresaliente"</em> en la competencia <em>"Trabajo en Equipo"</em>.
          </div>
          <p>
            <strong>La crisis real:</strong> Las áreas de Producto, Operaciones y Ventas tienen paralizados los tres principales
            lanzamientos del trimestre debido a disputas territoriales, ocultamiento de información y falta de compromiso mutuo.
          </p>
          <p>
            El Director General convoca a una reunión urgente y exige explicaciones:
            <em>"Si el 94% es sobresaliente en trabajo en equipo, ¿por qué nadie colabora para entregar los proyectos?"</em>
          </p>
        </div>
      `,
      question: '¿Cuál es la causa raíz técnica de esta discrepancia en Novatech?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c0-a',
          key: 'A',
          text: 'La deficiencia radica en el estilo de liderazgo de las jefaturas; al carecer de habilidades directivas, premiaron la sumisión jerárquica en lugar del rendimiento colectivo.',
          isCorrect: false,
          consequence: 'Simulación a 6 meses: Invertiste $15,000 USD y 40 horas en talleres de liderazgo. La rotación subió 18% y las disputas entre áreas persistieron intactas, evidenciando que el problema no radicaba en la actitud de los líderes sino en la ambigüedad del instrumento.',
          feedback: 'Fallo clásico de RRHH: Capacitar a ciegas sin antes auditar y calibrar el instrumento de medición solo profundiza el descreimiento organizacional en el área de Talento.'
        }),
        Object.freeze({
          id: 'c0-b',
          key: 'B',
          text: 'La falla radica en la amplitud permisiva de la escala métrica; al no existir una curva de distribución forzada, los evaluadores concentraron sus puntajes en el rango superior.',
          isCorrect: false,
          consequence: 'Simulación a 6 meses: Imponer una campana de Gauss forzada generó rivalidades desleales entre equipos para evitar el tercio inferior, provocando la renuncia de 4 profesionales clave sin haber corregido la falta de conductas observables.',
          feedback: 'Imponer una distribución estadística obligatoria sin descriptores conductuales objetivos solo castiga de manera arbitraria y destruye la confianza psicológica del equipo.'
        }),
        Object.freeze({
          id: 'c0-c',
          key: 'C',
          text: 'La causa radica en el carácter genérico de la competencia copiada; al carecer de anclajes observables al negocio, los evaluadores calificaron simpatía en lugar de conductas de entrega.',
          isCorrect: true,
          consequence: '¡Diagnóstico exacto! Se auditó la definición copiada: exigía "mantener una actitud cordial y respetuosa con los pares". El catálogo premiaba el buen trato en el café, sin medir la coordinación operativa para destrabar lanzamientos.',
          feedback: 'Excelente diagnóstico. Has aislado la causa raíz metodológica antes de dilapidar presupuesto en remedios cosméticos o distribuciones artificiales.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'Principio Martha Alles #1: Qué es realmente una Competencia',
        content: `
          Una competencia <strong>no es un valor moral, un deseo bienintencionado ni un adjetivo calificativo</strong>.
          Es una característica individual medible y traducible a <em>comportamientos observables</em> que aseguran
          un desempeño exitoso en una organización y estrategia específicas.
        `,
        takeaways: Object.freeze([
          'Una competencia sin comportamientos observables asociados es solo poesía corporativa.',
          'Copiar catálogos de internet importa culturas ajenas que nada tienen que ver con los dolores operativos de tu negocio.',
          'La evaluación objetiva exige escalas de valoración ancladas en comportamientos (BARS).'
        ])
      })
    })
  }),

  // =========================================================================
  // MÓDULO 2
  // =========================================================================
  Object.freeze({
    id: 'mod-2',
    number: 2,
    title: 'Ingeniería de Competencias',
    subtitle: 'Fórmula de redacción Alles y desacople de competencias cardinales vs. específicas',
    leadIntro: 'Las definiciones redactadas con juicios morales, exigencias afectivas o múltiples competencias fusionadas distorsionan la medición de talento y generan discrepancias insolubles entre evaluadores y colaboradores.',
    badge: 'Módulo 2 • Redacción Operativa',
    duration: '15 min',
    theoryId: 'mod-2-theory',
    objective: 'Dominar la fórmula técnica de 4 elementos para redactar definiciones libres de juicios morales y aplicar la Ley de Parsimonia.',
    overview: `
      Aprenderás a desmontar definiciones "Frankenstein" y a redactar competencias limpias,
      verificables y diferenciadas entre competencias que aplican a toda la organización (cardinales)
      y competencias funcionales por rol (específicas).
    `,
    challenge: Object.freeze({
      id: 'challenge-2',
      moduleId: 'mod-2',
      badge: 'Reto Invertido • Detección de Antipatrones',
      title: 'Auditoría del Artefacto Roto: Proactividad y Resiliencia Digital',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-broken-artifact.svg',
        alt: 'Auditoría del Artefacto Roto',
        caption: 'Artefacto Corporativo Defectuoso: Juicios axiológicos y redacción no observable.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            Una consultora externa presentó a la Dirección de RRHH el siguiente borrador para incorporar al manual de puestos:
          </p>
          <div class="rise-broken-artifact" style="background: var(--danger-bg, #FEF2F2); border: 2px dashed var(--danger-border, #DC2626); padding: 1rem; border-radius: 6px; margin: 1rem 0; font-family: monospace;">
            <strong>COMPETENCIA:</strong> Proactividad y Resiliencia Digital<br><br>
            <strong>DEFINICIÓN:</strong> Es la capacidad de ser buena persona, tener una actitud positiva frente a los problemas del software y amar a la empresa trabajando con pasión y sin quejarse.
          </div>
          <p>
            Tu misión antes de ver la guía metodológica es auditar este artefacto e identificar la falla técnica estructural.
          </p>
        </div>
      `,
      question: '¿Cuáles son los defectos críticos que invalidan técnicamente esta definición según el estándar Martha Alles?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c1-a',
          key: 'A',
          text: 'Omite detallar las herramientas informáticas y lenguajes de programación requeridos, impidiendo medir el conocimiento técnico especializado que exige el entorno digital corporativo.',
          isCorrect: false,
          consequence: 'Confundes competencias conductuales con conocimientos técnicos de puesto (hard skills). Detallar tecnologías convierte la competencia en un temario obsoleto al actualizarse el software.',
          feedback: 'Las herramientas informáticas pertenecen al inventario de conocimientos (iceberg visible), mientras que la competencia conductual evalúa el comportamiento subyacente.'
        }),
        Object.freeze({
          id: 'c1-b',
          key: 'B',
          text: 'Incurre en juicios morales subjetivos, demandas afectivas incomprobables y fusiona múltiples competencias en un solo enunciado sin articular un verbo de acción observable orientado a resultados.',
          isCorrect: true,
          consequence: '¡Auditoría impecable! Has detectado la mezcla tóxica de moralina axiológica con competencias conductuales. Ningún evaluador puede auditar si alguien "ama a la empresa con pasión sin quejarse".',
          feedback: 'Exacto. Los valores morales y estados de ánimo no se gradúan en competencias. Martha Alles exige constructos unívocos y verbos de acción medibles.'
        }),
        Object.freeze({
          id: 'c1-c',
          key: 'C',
          text: 'Carece de una fundamentación conceptual extensa y citas doctrinales de la cultura corporativa, dejando sin respaldo filosófico los valores que deben guiar la conducta esperada del colaborador.',
          isCorrect: false,
          consequence: 'Alargar las definiciones con citas doctrinarias o postulados filosóficos produce manuales burocráticos de 400 páginas que ningún líder consulta al momento de realizar la evaluación.',
          feedback: 'La extensión y la retórica filosófica no sustituyen el rigor operativo. Martha Alles exige concisión, precisión técnica y anclaje conductual en una sola oración bien formulada.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'Fórmula de Construcción Martha Alles (Tomo I)',
        content: `
          Toda definición técnica de competencia debe articular <strong>4 componentes inmutables</strong> para garantizar objetividad psicométrica y anclaje conductual:
        `,
        formula: '[Verbo de acción en infinitivo] + [Objeto de impacto / Dominio técnico] + [Contexto y complejidad organizacional] + [Propósito estratégico / Resultado esperado]',
        components: Object.freeze([
          Object.freeze({
            num: '1',
            name: 'Verbo de acción en infinitivo',
            desc: 'Define la conducta laboral directamente observable y medible, erradicando juicios morales o estados anímicos.',
            example: '"Diseñar, estructurar y ejecutar..." (Conductas operativas observables y auditables externamente).',
            contraExample: '"Ser una persona entusiasta, amar la empresa o sentir verdadera vocación..." (Juicios de valor, estados afectivos o actitudes morales no medibles).'
          }),
          Object.freeze({
            num: '2',
            name: 'Objeto de impacto / Dominio técnico',
            desc: 'El entregable, sistema, proceso o materia prima sobre el que recae directamente la acción laboral.',
            example: '"...el plan operativo de distribución logística y los acuerdos de nivel de servicio (SLAs)..." (Entregable concreto y acotado al negocio).',
            contraExample: '"...la buena vibra del departamento o la felicidad integral de la oficina..." (Conceptos difusos, intangibles o desconectados del flujo de trabajo real).'
          }),
          Object.freeze({
            num: '3',
            name: 'Contexto y complejidad organizacional',
            desc: 'El entorno de incertidumbre, presión temporal (SLAs) o nivel de interlocución exigido.',
            example: '"...en situaciones de alta volatilidad de demanda y plazos críticos de entrega inferiores a 24 horas..." (Condiciones operativas y restricciones reales).',
            contraExample: '"...únicamente cuando las condiciones meteorológicas son favorables o no hay urgencias..." (Condición permisiva o trivial que anula la exigencia del rol).'
          }),
          Object.freeze({
            num: '4',
            name: 'Propósito estratégico / Resultado esperado',
            desc: 'El valor de negocio tangible o impacto cuantificable que justifica la competencia.',
            example: '"...garantizando una tasa de cumplimiento de despachos superior al 98% sin desviar los costos presupuestados." (Impacto medible en KPIs y rentabilidad).',
            contraExample: '"...para que los jefes estén satisfechos y los compañeros nos dediquen una sonrisa afectuosa." (Aprobación social subjetiva sin retorno de valor organizacional).'
          })
        ]),
        takeaways: Object.freeze([
          'Cero términos morales: vetados "bueno", "leal", "sano", "entusiasta", "amor por la camiseta".',
          'Unicidad: Una competencia evalúa un solo constructo; jamás fusiones "Liderazgo y Negociación Ágil".',
          'Ley de Parsimonia: Máximo 3-5 Cardinales para toda la empresa y 3-4 Específicas por puesto.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Fase 2 • Taller Práctico de Aplicación',
      title: 'De la Auditoría Crítica al Ensamblado Técnico',
      lead: 'Has identificado con éxito los vicios de redacción, la trampa de los juicios morales y la mezcla de constructos en una definición rota.',
      description: 'El siguiente paso metodológico consiste en pasar del diagnóstico pasivo a la construcción activa: utiliza la fórmula de 4 componentes de Martha Alles para redactar una definición de competencia pura, medible y orientada a resultados.',
      focus: 'Misión: Selecciona los fragmentos correctos en cada bloque para ensamblar una definición de Grado de Oro libre de sesgos afectivos.'
    }),
    practiceBuilder: Object.freeze({
      title: 'Taller de Ensamblado: Orientación a Resultados en Logística Crítica',
      instructions: 'Construye la definición de oro combinando las piezas correctas de acuerdo con la fórmula Alles:',
      sections: Object.freeze([
        Object.freeze({
          id: 'sec-verb',
          name: '1. Verbo y Acción Central',
          options: Object.freeze([
            Object.freeze({ id: 'v-1', text: 'Identificar y ejecutar prioridades operativas...', isCorrect: true }),
            Object.freeze({ id: 'v-2', text: 'Amar el trabajo y tener pasión por despachar pedidos...', isCorrect: false }),
            Object.freeze({ id: 'v-3', text: 'Ser un colaborador bondadoso que nunca dice que no...', isCorrect: false })
          ])
        }),
        Object.freeze({
          id: 'sec-context',
          name: '2. Contexto Operativo y Complejidad',
          options: Object.freeze([
            Object.freeze({ id: 'c-1', text: '...en entornos de alta presión con tiempos de entrega acotados...', isCorrect: true }),
            Object.freeze({ id: 'c-2', text: '...únicamente cuando las condiciones meteorológicas son favorables...', isCorrect: false }),
            Object.freeze({ id: 'c-3', text: '...sin importar los costos ni si se destruye mercadería en el trayecto...', isCorrect: false })
          ])
        }),
        Object.freeze({
          id: 'sec-purpose',
          name: '3. Propósito Estratégico y Resultado',
          options: Object.freeze([
            Object.freeze({ id: 'p-1', text: '...garantizando el cumplimiento de SLAs sin desviar los costos presupuestados.', isCorrect: true }),
            Object.freeze({ id: 'p-2', text: '...para que el cliente nos dedique una sonrisa cariñosa.', isCorrect: false }),
            Object.freeze({ id: 'p-3', text: '...demostrando a las demás gerencias quién tiene el mejor equipo.', isCorrect: false })
          ])
        })
      ]),
      goldenDefinition: 'Identificar y ejecutar prioridades operativas en entornos de alta presión con tiempos de entrega acotados, garantizando el cumplimiento de SLAs sin desviar los costos presupuestados.'
    })
  }),

  // =========================================================================
  // MÓDULO 3
  // =========================================================================
  Object.freeze({
    id: 'mod-3',
    number: 3,
    title: 'Taxonomía y Graduación de Comportamientos (A-B-C-D)',
    subtitle: 'La guerra de adjetivos de gerencia y la regla del cero adjetivismo',
    leadIntro: 'Los comités de calibración suelen paralizarse en debates subjetivos cuando las escalas de evaluación dependen de adverbios de intensidad o calificativos imprecisos que carecen de respaldo conductual verificable.',
    badge: 'Módulo 3 • Calibración Conductual',
    duration: '20 min',
    theoryId: 'mod-3-theory',
    objective: 'Graduar conductas en 4 niveles objetivos (A-D) basados en autonomía e impacto organizacional, erradicando los adjetivos subjetivos.',
    overview: `
      Descubre cómo resolver disputas de comités de calibración mediante descriptores conductuales
      anclados (BARS) donde el Nivel A no es "hacerlo con más ganas", sino ampliar el alcance sistémico
      y la autonomía discrecional.
    `,
    challenge: Object.freeze({
      id: 'challenge-3',
      moduleId: 'mod-3',
      badge: 'Reto Invertido • Comité de Calibración',
      title: 'El Dilema de la "Guerra de Gerentes"',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-gerentes-debate.svg',
        alt: 'Dilema en Comité de Calibración',
        caption: 'Comité de Calibración: Disputa por apreciaciones subjetivas frente a la graduación BARS objetiva.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            Te encuentras en el Comité Anual de Calibración de Talento. Dos gerentes discuten acaloradamente
            sobre la calificación de un analista sénior en la competencia <em>"Toma de Decisiones"</em>:
          </p>
          <div class="rise-dialogue-box" style="background: var(--slate-100); padding: 1rem; border-radius: 6px; margin: 0.75rem 0;">
            <p><strong>Gerente de Finanzas:</strong> <em>"Debe ser Nivel B, porque trabaja muy bien y casi nunca comete errores."</em></p>
            <p><strong>Gerente de Operaciones:</strong> <em>"¡No! Es Nivel A, porque trabaja de forma excelente y extraordinaria."</em></p>
          </div>
          <p>
            Ninguno de los dos puede explicar de manera comprobable la diferencia entre "muy bien" y "excelente".
            La discusión lleva 45 minutos y el comité está estancado.
          </p>
        </div>
      `,
      question: '¿Cuál de los siguientes pares de descriptores conductuales resuelve esta discusión de forma objetiva e irrefutable?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c2-a',
          key: 'A',
          text: 'B: "Cumple habitualmente sus metas operativas con gran entusiasmo"; A: "Supera constantemente los objetivos asignados demostrando un compromiso excepcional".',
          isCorrect: false,
          consequence: 'La discusión en el comité se intensificó: ¿Cuál es la diferencia objetiva entre "gran entusiasmo" y "compromiso excepcional"? La evaluación continuó atrapada en adjetivos subjetivos.',
          feedback: 'Caíste en la trampa del adverbio de frecuencia y el adjetivo valorativo. La escala Alles prohíbe graduar intensificando adjetivos; exige cambiar el alcance de la conducta.'
        }),
        Object.freeze({
          id: 'c2-b',
          key: 'B',
          text: 'B: "Resuelve contingencias complejas en su área con total autonomía"; A: "Diseña políticas corporativas y doctrina metodológica con impacto en toda la organización".',
          isCorrect: true,
          consequence: '¡Comité alineado en 30 segundos! Ambos gerentes revisaron el legajo del analista: ¿Diseñó una política corporativa transversal o resolvió contingencias de su sector con autonomía? La evidencia fáctica zanjó el debate.',
          feedback: 'Brillante. La graduación Alles se sustenta en Ámbito de Impacto y Niveles de Discreción (Elliott Jaques), no en intensificar adjetivos cosméticos.'
        }),
        Object.freeze({
          id: 'c2-c',
          key: 'C',
          text: 'B: "Posee entre dos y cuatro años de experiencia laboral en su puesto"; A: "Acumula más de cinco años de trayectoria directiva y cuenta con acreditaciones avanzadas".',
          isCorrect: false,
          consequence: 'El comité objetó el criterio: tener antigüedad o posgrados acredita tiempo de servicio o credenciales académicas, pero no demuestra la efectividad de la conducta laboral observada.',
          feedback: 'Confundes credenciales y antigüedad con competencia laboral. Un colaborador con 10 años puede exhibir conductas de Grado C si no modela ni genera impacto sistémico.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'La Matriz de 4 Grados Alles y Regla del Cero Adjetivismo',
        content: `
          En la metodología Martha Alles, la graduación conductual BARS erradica por completo los calificativos y adverbios subjetivos (<em>"bien"</em>, <em>"muy bien"</em>, <em>"excelente"</em>). Ningún grado intensifica adjetivos; en su lugar, cada nivel <strong>amplía el alcance del impacto y la autonomía operativa</strong> a lo largo de 4 escalones objetivos:
        `,
        levelsLabel: 'Matriz de 4 Grados Alles (Taxonomía BARS):',
        levels: Object.freeze([
          Object.freeze({
            level: 'A',
            badge: 'Grado A • 100%',
            name: 'Superior / Referente Organizacional:',
            desc: 'Modela la conducta institucional, crea doctrina o políticas corporativas y genera impacto sistémico transversal fuera de su área inmediata.'
          }),
          Object.freeze({
            level: 'B',
            badge: 'Grado B • 75%',
            name: 'Muy Bueno / Autónomo en Complejidad:',
            desc: 'Resuelve contingencias operativas complejas con total autonomía en su área sin requerir supervisión ni escalamiento.'
          }),
          Object.freeze({
            level: 'C',
            badge: 'Grado C • 50%',
            name: 'Estándar Requerido / Operativo:',
            desc: 'Cumple con eficacia y autonomía los procesos regulares exigidos para el puesto en condiciones normales de trabajo.'
          }),
          Object.freeze({
            level: 'D',
            badge: 'Grado D • 25%',
            name: 'Inicial / En Desarrollo:',
            desc: 'No alcanza el estándar mínimo regular del puesto; manifiesta brecha conductual o requiere supervisión y asistencia continua.'
          })
        ]),
        components: Object.freeze([
          Object.freeze({ letter: 'A', name: 'Grado A (100% - Superior)', desc: 'Referente, modelaje, impacto sistémico corporativo y creación de doctrina interna.' }),
          Object.freeze({ letter: 'B', name: 'Grado B (75% - Muy Bueno)', desc: 'Autonomía total en contingencias severas y resolución compleja dentro de su área.' }),
          Object.freeze({ letter: 'C', name: 'Grado C (50% - Estándar Requerido)', desc: 'Cumplimiento estricto y autónomo del estándar operativo en condiciones normales.' }),
          Object.freeze({ letter: 'D', name: 'Grado D (25% - Inicial / En Desarrollo)', desc: 'No alcanza el estándar mínimo regular; requiere supervisión continua o acompañamiento.' })
        ]),
        takeawaysLabel: 'Reglas Clave de Graduación Alles:',
        takeaways: Object.freeze([
          'Cero Adjetivismo: Vetados "buena actitud", "muy buen desempeño" o "excelente compromiso" en las escalas.',
          'Inclusión Acumulativa: Quien alcanza el Grado A domina y ejecuta necesariamente las conductas de B, C y D.',
          'Nivel de Discreción (Elliott Jaques): La escala mide el horizonte temporal y la autonomía en la toma de decisiones.',
          'Anclaje Operativo: El Grado C (50%) es el patrón base de referencia para el perfil regular del puesto.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Fase 2 • Laboratorio de Calibración Taxonómica',
      title: 'Del Dilema de Calibración a la Graduación BARS (A-B-C-D)',
      lead: 'Comprobaste en el comité cómo los adjetivos y adverbios subjetivos generan debates interminables y parálisis evaluativa.',
      description: 'La metodología Martha Alles resuelve este conflicto mediante la regla del Cero Adjetivismo y la graduación por niveles de autonomía e impacto sistémico (Elliott Jaques): Grado A (referente organizacional), Grado B (autonomía plena en contingencias), Grado C (estándar regular del puesto) y Grado D (supervisión continua o desvío).',
      focus: 'Misión: Asume el rol de calibrador técnico y clasifica cada uno de los 8 comportamientos observables en su cuadrante BARS exacto (A, B, C o D).'
    }),
    sortingActivity: Object.freeze({
      competencyName: 'Toma de Decisiones Estratégicas',
      instructions: 'Clasifica los 8 descriptores conductuales en sus respectivos cuadrantes (A, B, C o D):',
      slots: Object.freeze([
        Object.freeze({ id: 'slot-a', level: 'A', title: 'Nivel A • Sistémico / Estratégico (100%)', badgeClass: 'rise-level-badge--a' }),
        Object.freeze({ id: 'slot-b', level: 'B', title: 'Nivel B • Autónomo en Complejidad (75%)', badgeClass: 'rise-level-badge--b' }),
        Object.freeze({ id: 'slot-c', level: 'C', title: 'Nivel C • Estándar Operativo (50%)', badgeClass: 'rise-level-badge--c' }),
        Object.freeze({ id: 'slot-d', level: 'D', title: 'Nivel D • Inicial / En Desarrollo (25%)', badgeClass: 'rise-level-badge--d' })
      ]),
      items: Object.freeze([
        Object.freeze({
          id: 'sort-1',
          level: 'A',
          targetSlot: 'slot-a',
          text: 'Diseña y establece las políticas corporativas y marcos de gobernanza para la toma de decisiones críticas en situaciones de crisis inéditas.',
          feedback: 'Correcto. Modela doctrina con alcance sistémico para toda la compañía (Grado A).'
        }),
        Object.freeze({
          id: 'sort-2',
          level: 'A',
          targetSlot: 'slot-a',
          text: 'Actúa como consultor de referencia para la alta dirección y mentorea a líderes departamentales en la evaluación de dilemas de alto riesgo.',
          feedback: 'Correcto. Función de mentoría y modelaje institucional (Grado A).'
        }),
        Object.freeze({
          id: 'sort-3',
          level: 'B',
          targetSlot: 'slot-b',
          text: 'Evalúa riesgos e impactos departamentales y toma decisiones autónomas en escenarios imprevistos de alta complejidad sin requerir supervisión.',
          feedback: 'Correcto. Autonomía plena en contingencias de su ámbito funcional (Grado B).'
        }),
        Object.freeze({
          id: 'sort-4',
          level: 'B',
          targetSlot: 'slot-b',
          text: 'Articula soluciones y consensos entre áreas divergentes para destrabar proyectos que comprometen los objetivos del departamento.',
          feedback: 'Correcto. Resolución de conflictos inter-áreas dentro de su horizonte táctico (Grado B).'
        }),
        Object.freeze({
          id: 'sort-5',
          level: 'C',
          targetSlot: 'slot-c',
          text: 'Elige la alternativa operativa adecuada entre opciones preestablecidas dentro de los límites de su puesto y en condiciones normales de trabajo.',
          feedback: 'Correcto. Estándar operativo mínimo esperado para el puesto (Grado C).'
        }),
        Object.freeze({
          id: 'sort-6',
          level: 'C',
          targetSlot: 'slot-c',
          text: 'Aplica el procedimiento de contingencia documentado cuando surge una falla común, informando a su jefatura en los tiempos previstos.',
          feedback: 'Correcto. Ejecución fiel del manual de procesos estándar (Grado C).'
        }),
        Object.freeze({
          id: 'sort-7',
          level: 'D',
          targetSlot: 'slot-d',
          text: 'Posterga decisiones rutinarias ante contingencias menores por temor al error o falta de criterio propio, requiriendo supervisión constante.',
          feedback: 'Correcto. Dependencia de supervisión continua; no alcanza el estándar del puesto (Grado D).'
        }),
        Object.freeze({
          id: 'sort-8',
          level: 'D',
          targetSlot: 'slot-d',
          text: 'Aplica soluciones impulsivas sin verificar el impacto inmediato en el flujo de trabajo de su puesto de trabajo.',
          feedback: 'Correcto. Conducta desalineada que genera retrabajo operativo (Grado D).'
        })
      ])
    })
  }),

  // =========================================================================
  // MÓDULO 4
  // =========================================================================
  Object.freeze({
    id: 'mod-4',
    number: 4,
    title: 'Entrevistas por Incidentes Críticos (BBI / STAR)',
    subtitle: 'Desarmando al candidato diplomático mediante preguntas de sondeo',
    leadIntro: 'Las preguntas formuladas en condicional permiten que postulantes con elocuencia oculten brechas críticas tras respuestas teóricas, distorsionando las decisiones de contratación y elevando el riesgo operativo.',
    badge: 'Módulo 4 • Evidencia STAR',
    duration: '20 min',
    theoryId: 'mod-4-theory',
    objective: 'Diseñar y conducir entrevistas por competencias (BBI) formulando preguntas de sondeo que aíslen la conducta real pasada.',
    overview: `
      Aprenderás a neutralizar las respuestas preparadas y los discursos ensayados de los postulantes,
      aplicando la técnica de incidentes críticos de Flanagan y el modelo STAR para obtener evidencias
      conductuales verificables.
    `,
    challenge: Object.freeze({
      id: 'challenge-4',
      moduleId: 'mod-4',
      badge: 'Reto Invertido • Error de Selección',
      title: 'El Caso del "Candidato Diplomático"',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-diplomatic-candidate.svg',
        alt: 'El Caso del Candidato Diplomático',
        caption: 'Entrevista STAR: Desarmando respuestas hipotéticas ensayadas mediante indagación de hechos pasados.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            Estás auditando un proceso de selección fallido para la posición de <strong>Líder de Ciberseguridad e Infraestructura</strong>.
            En la grabación de la entrevista, el entrevistador de RRHH pregunta:
          </p>
          <div class="rise-dialogue-box" style="background: var(--slate-100); padding: 1rem; border-radius: 6px; margin: 0.75rem 0;">
            <p><strong>Entrevistador RRHH:</strong> <em>"¿Qué harías si se cae un servidor de misión crítica un domingo a las 3:00 AM?"</em></p>
            <p><strong>Candidato (con elocuencia impecable):</strong> <em>"Ah, soy una persona extremadamente comprometida. Mantendría la calma, llamaría a mi equipo, revisaría los logs y resolvería la situación con resiliencia y liderazgo."</em></p>
            <p><strong>Calificación de RRHH:</strong> <strong>Nivel A - Candidato Excepcional</strong>.</p>
          </div>
          <p>
            <strong>Desenlace:</strong> El candidato fue contratado. A las 3 semanas colapsó la pasarela de pagos.
            El profesional no documentó el incidente, entró en pánico y culpó por completo al proveedor de internet.
          </p>
        </div>
      `,
      question: '¿Cuál fue el pecado capital de la pregunta formulada por el entrevistador de RRHH?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c3-a',
          key: 'A',
          text: 'Omitir la exigencia de certificaciones técnicas vigentes de infraestructura crítica, impidiendo verificar formalmente los conocimientos técnicos requeridos para administrar servidores.',
          isCorrect: false,
          consequence: 'Exigir certificaciones verifica conocimientos formales (cúspide del iceberg), pero no anticipa cómo reaccionará la persona bajo estrés real, pánico operativo o ante la necesidad de coordinar equipos en crisis.',
          feedback: 'Las credenciales y conocimientos técnicos son condiciones necesarias pero insuficientes; no predicen la competencia conductual puesta en acción.'
        }),
        Object.freeze({
          id: 'c3-b',
          key: 'B',
          text: 'Formular la indagación en tiempo condicional hipotético, facilitando un discurso conceptual ensayado en lugar de exigir la descripción de un incidente conductual pasado efectivamente demostrado.',
          isCorrect: true,
          consequence: '¡Exacto! El axioma fundamental de Martha Alles: "El mejor predictor de cómo actuará alguien mañana es cómo actuó ayer en una situación semejante". Las preguntas hipotéticas premian la elocuencia y la simpatía, no la competencia real.',
          feedback: 'Brillante. Has identificado el origen del 70% de las malas contrataciones: sustituir la evidencia fáctica STAR por proyecciones hipotéticas bien articuladas.'
        }),
        Object.freeze({
          id: 'c3-c',
          key: 'C',
          text: 'Prescindir de inventarios psicométricos estandarizados y pruebas de personalidad, limitando la sesión a un diálogo informal sin la calibración psicotécnica previa del perfil emocional.',
          isCorrect: false,
          consequence: 'Los inventarios psicotécnicos tradicionales poseen una validez predictiva moderada o baja frente a la Entrevista por Incidentes Críticos estructurada, y no eximen al evaluador de comprobar hechos reales en el puesto.',
          feedback: 'La técnica BBI/STAR tiene una validez predictiva superior (r = 0.51 - 0.65) frente a inventarios abstractos, porque audita directamente comportamientos laborales concretos.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'Estructura de la Pregunta BBI / STAR y Preguntas de Sondeo',
        content: `
          Toda indagación de competencias debe anclarse en la metodología STAR:
        `,
        components: Object.freeze([
          { letter: 'S', name: 'Situación', desc: 'Contexto real pasado específico (últimos 12 a 24 meses).' },
          { letter: 'T', name: 'Tarea', desc: 'Desafío concreto o meta que el sujeto debía alcanzar.' },
          { letter: 'A', name: 'Acción individual', desc: 'Qué hizo exactamente la persona (desarmar el "hicimos" corporativo).' },
          { letter: 'R', name: 'Resultado', desc: 'Impacto medible, indicador final y aprendizaje obtenido.' }
        ]),
        takeaways: Object.freeze([
          'Prohibidas las preguntas en condicional: jamás formules "¿Qué harías si...?".',
          'Abre siempre en pretérito perfecto: "Cuéntame de una ocasión concreta en que tuviste que...".',
          'Sondeo quirúrgico: Usa repreguntas para bajar del discurso conceptual al hecho demostrable.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Fase 2 • Simulación Conversacional en Vivo',
      title: 'Del Diagnóstico de Sesgo al Interrogatorio de Incidentes Críticos',
      lead: 'Has descubierto por qué las preguntas condicionales ("¿Qué harías si...?") facilitan discursos ensayados y causan contrataciones fallidas.',
      description: 'El único predictor fiable del desempeño futuro es la conducta demostrada en el pasado reciente. En este simulador te sentarás frente a Javier Méndez: deberás formular preguntas y repreguntas de sondeo bajo la técnica BBI/STAR para desarmar su retórica y extraer evidencia fáctica demostrable.',
      focus: 'Misión: Conduce los 3 turnos de entrevista eligiendo preguntas en pretérito perfecto y focalizadas en el rol individual del postulante.'
    }),
    chatSimulator: Object.freeze({
      candidate: Object.freeze({
        name: 'Javier Méndez',
        role: 'Postulante a Líder de Operaciones y Continuidad',
        avatarText: 'JM'
      }),
      initialDialogue: Object.freeze({
        text: 'Buenas tardes. Como habrán visto en mi perfil, soy una persona con altísima vocación por la resiliencia y el trabajo bajo presión. Ante cualquier crisis operativa, mantengo la calma, lidero con optimismo y hago que las cosas sucedan sin dudarlo.'
      }),
      turns: Object.freeze([
        Object.freeze({
          id: 'turn-1',
          prompt: 'Turno 1: El postulante responde con un discurso ensayado y abstracto. ¿Qué pregunta de sondeo formulas?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-1a',
              key: 'A',
              text: '¿Qué harías si este fin de semana se cae la plataforma principal durante un evento masivo de ventas?',
              isEffective: false,
              feedback: 'Error grave: formulaste una pregunta hipotética ("¿Qué harías?"). El candidato volverá a desplegar su discurso idealizado.',
              candidateResponse: 'Excelente pregunta. De inmediato activaría a todos los equipos, aplicaría metodologías ágiles y no descansaría hasta restablecer el servicio, manteniendo al cliente siempre informado.'
            }),
            Object.freeze({
              id: 'opt-1b',
              key: 'B',
              text: '¿Por qué consideras que eres mejor que otros candidatos para ocupar este rol?',
              isEffective: false,
              feedback: 'Pregunta de opinión y auto-concepto. Solo estimula respuestas narcisistas y no aporta evidencia conductual.',
              candidateResponse: 'Bueno, mi dedicación es del 200%. No tengo horario cuando la empresa me necesita y mi lealtad es total hacia la marca.'
            }),
            Object.freeze({
              id: 'opt-1c',
              key: 'C',
              text: 'Relata una ocasión concreta en los últimos 12 meses donde un sistema crítico colapsó en tu guardia. ¿Cuál era la situación y cuál fue tu primera decisión en los primeros 15 minutos?',
              isEffective: true,
              feedback: '¡Excelente! Has formulado una pregunta BBI/STAR pura: anclada en el pasado reciente, situacional y orientada a la acción inmediata.',
              candidateResponse: 'El pasado noviembre, durante el CyberMonday, el balanceador de carga cayó a las 02:15 AM dejando fuera el checkout. En los primeros 10 minutos, antes de llamar a nadie, revisé la consola de CloudWatch para aislar si era un ataque DDoS o saturación de base de datos.'
            })
          ])
        }),
        Object.freeze({
          id: 'turn-2',
          prompt: 'Turno 2: El candidato comenzó a relatar hechos. ¿Cómo continúas el sondeo para desarmar el rol individual y medir el impacto (STAR)?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-2a',
              key: 'A',
              text: '¿Sentiste mucho miedo o nerviosismo al ver que la pasarela de pagos estaba caída?',
              isEffective: false,
              feedback: 'Indaga emociones personales en lugar de conductas observables y resultados operativos.',
              candidateResponse: 'La verdad no, siempre mantengo el temple de acero bajo presión extrema, es algo innato en mi personalidad.'
            }),
            Object.freeze({
              id: 'opt-2b',
              key: 'B',
              text: 'Mencionas que el balanceador saturó. Concretamente tú, ¿qué acción ejecutaste para restablecer el servicio y qué indicador de negocio confirmó la recuperación?',
              isEffective: true,
              feedback: '¡Precisión quirúrgica! Desarmas el constructo y exiges la métrica objetiva del resultado (R de STAR).',
              candidateResponse: 'Redirigí el tráfico al clúster secundario de contingencia mediante un script propio y ajusté el timeout a 3 segundos. A las 02:38 AM el checkout recuperó el 99.4% de transacciones exitosas sin pérdida de carritos.'
            }),
            Object.freeze({
              id: 'opt-2c',
              key: 'C',
              text: '¿Te parece que la gerencia debió invertir más en infraestructura antes del CyberMonday?',
              isEffective: false,
              feedback: 'Pregunta sugestiva de queja política. Desvía el foco de la competencia conductual del postulante.',
              candidateResponse: 'Totalmente, siempre avisé que faltaban servidores, pero nunca quisieron gastar presupuesto.'
            })
          ])
        }),
        Object.freeze({
          id: 'turn-3',
          prompt: 'Turno 3: Has obtenido Acción y Resultado. ¿Cuál es tu pregunta de calibración para discriminar si califica en Grado C, B o A?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-3a',
              key: 'A',
              text: 'Tras resolver la emergencia inmediata, ¿qué medidas tomaste para evitar que ese fallo volviera a repetirse en toda la compañía?',
              isEffective: true,
              feedback: '¡Maestría metodológica! Esta pregunta discrimina entre Grado C (operativo inmediato) y Grado B/A (mejora de procesos y diseño de políticas preventivas corporativas).',
              candidateResponse: 'Durante la semana siguiente documenté el post-mortem, creé la regla de auto-escalado predictivo y redacté el nuevo protocolo de contingencia que hoy aplican los 4 equipos regionales de infraestructura.'
            }),
            Object.freeze({
              id: 'opt-3b',
              key: 'B',
              text: '¿La empresa te otorgó un bono o reconocimiento económico por quedarte trabajando de madrugada?',
              isEffective: false,
              feedback: 'Irrelevante. La compensación recibida no refleja el nivel de desarrollo de la competencia conductual.',
              candidateResponse: 'Me felicitaron por Slack, pero no hubo bono económico.'
            }),
            Object.freeze({
              id: 'opt-3c',
              key: 'C',
              text: '¿Consideras que Martha Alles estaría conforme con tu desempeño en esa noche?',
              isEffective: false,
              feedback: 'Pregunta metalingüística informal. No aporta valor a la calibración BBI.',
              candidateResponse: 'No conozco a Martha Alles, pero en mi equipo todos estaban conformes con el resultado.'
            })
          ])
        })
      ])
    })
  }),

  // =========================================================================
  // MÓDULO 5
  // =========================================================================
  Object.freeze({
    id: 'mod-5',
    number: 5,
    title: 'Capstone Studio: Banco de Pruebas y Calibración',
    subtitle: 'Auditoría técnica de la ficha y certificación binaria 100%',
    leadIntro: 'Un diccionario corporativo solo protege la toma de decisiones cuando cada ficha técnica resiste el escrutinio de la alta dirección y supera un control de calidad metodológico riguroso antes de su implementación formal.',
    badge: 'Módulo 5 • Certificación Final',
    duration: '25 min',
    theoryId: 'mod-5-theory',
    objective: 'Construir y auditar la Ficha Técnica de Competencia definitiva superando el 100% de la rúbrica binaria de 4 criterios.',
    overview: `
      En este módulo integrador final actúas como Consultor Líder de Talento.
      Deberás auditar y calibrar la ficha técnica completa de la competencia
      "Gestión del Cambio Organizacional" para una empresa en transformación digital,
      cumpliendo estrictamente con los 4 estándares de calidad de la Trilogía Martha Alles.
    `,
    capstoneCase: Object.freeze({
      company: 'Retail Sur Americana',
      businessContext: `
        Cadena de retail tradicional con 45 tiendas físicas y 2,800 colaboradores.
        Se encuentra en un proceso crítico de transformación digital y omnicanalidad para competir con gigantes del e-commerce.
        La Dirección General requiere incorporar en todos los perfiles de liderazgo la competencia cardinal:
        <strong>Gestión del Cambio Organizacional</strong>.
      `,
      competencyName: 'Gestión del Cambio Organizacional',
      type: 'Competencia Cardinal (Aplica al 100% de líderes de la organización)'
    }),
    rubricCriteria: Object.freeze([
      Object.freeze({
        id: 'c1',
        name: 'Criterio 1: Definición Conceptual Limpia',
        question: '¿La definición está formulada según la sintaxis Alles y libre de juicios morales/emocionales?',
        requirement: 'Debe contener Verbo en infinitivo + Objeto + Contexto + Propósito, sin palabras como "amar", "bueno", "leal" o "con entusiasmo".'
      }),
      Object.freeze({
        id: 'c2',
        name: 'Criterio 2: Graduación por Alcance e Impacto',
        question: '¿Los comportamientos A-D están graduados por autonomía y ámbito de impacto, sin adjetivos cosméticos?',
        requirement: 'Prohibido usar "bien", "muy bien", "excelente". La diferencia debe sustentarse en la complejidad y horizonte temporal.'
      }),
      Object.freeze({
        id: 'c3',
        name: 'Criterio 3: Anclaje de Grado C y Grado A',
        question: '¿El Grado C representa el estándar mínimo operativo y el Grado A el impacto sistémico corporativo?',
        requirement: 'Grado C debe reflejar ejecución estándar y Grado A debe incluir modelaje, mentoría o creación de doctrina corporativa.'
      }),
      Object.freeze({
        id: 'c4',
        name: 'Criterio 4: Preguntas BBI / STAR Pasadas Reales',
        question: '¿Las preguntas de incidentes críticos indagan hechos reales pasados y prohíben el condicional ("¿Qué harías?")?',
        requirement: 'Deben exigir eventos específicos de los últimos 12-24 meses con seguimiento de preguntas de sondeo sobre la acción individual.'
      })
    ]),
    submissionBlueprint: Object.freeze({
      definition: 'Impulsar y facilitar la adopción de nuevos modelos de trabajo y tecnologías en equipos multidisciplinarios, minimizando la resistencia y garantizando la continuidad operativa del negocio durante la transición.',
      levels: Object.freeze({
        A: 'Diseña la estrategia corporativa de cambio organizacional, modela conductas de adaptabilidad para toda la compañía y neutraliza resistencias sistémicas en comités ejecutivos.',
        B: 'Lidera la transición operativa en su departamento de forma autónoma, rediseña procesos para absorber contingencias y asesora a pares de otras áreas.',
        C: 'Aplica los protocolos de transición y herramientas digitales estándar en su equipo directo, retroalimentando desvíos según los lineamientos establecidos.',
        D: 'Muestra resistencia pasiva a los nuevos procesos o requiere supervisión continua para adoptar las directivas operativas de cambio.'
      }),
      bbiQuestions: Object.freeze([
        'Relate una situación concreta en los últimos 18 meses donde su equipo se resistió formalmente a la implementación de un nuevo sistema o política corporativa. ¿Cuál fue su intervención directa en los primeros días?',
        '¿Cuál fue el indicador cuantitativo u objetivo que demostró que el cambio se consolidó en la rutina operativa de su equipo?',
        'Pregunta de sondeo: Cuando la transición generó retrasos en la entrega, ¿qué decisión tomó usted individualmente para preservar el estándar de servicio sin vulnerar la nueva directriz?'
      ])
    })
  })
]);

export const MODULES_DATA_EN = Object.freeze([
  // =========================================================================
  // MODULE 0: INTRODUCTION AND ANDRAGOGIC ORIENTATION
  // =========================================================================
  Object.freeze({
    id: 'mod-0',
    number: 0,
    title: 'Introduction to the Methodological Program',
    subtitle: 'Course purpose, terminal competencies map, and dual-track dynamics',
    leadIntro: 'Talent management often collapses when adopting catalogs decoupled from operational reality. This space sets the work standards, scientific criteria, and self-direction model guiding your development.',
    badge: 'Module 0 • Introduction & Orientation',
    duration: '5 min',
    theoryId: 'mod-0-theory',
    objective: 'Understand the strategic purpose of the course, review performance objectives for modules 1 to 5, and self-manage the dual-track pathway (practice or theory).',
    overview: `
      Welcome to the specialized program on Creation and Calibration of Workplace Competencies under the Martha Alles methodology.
      This introductory module establishes course objectives, outlines competencies acquired in each lesson, and explains how to use dual-track learning to learn at your own pace.
    `,
    introData: Object.freeze({
      questions: Object.freeze([
        Object.freeze({
          id: 'q1-purpose',
          number: 1,
          question: 'Why are you here?',
          title: 'Strategic Purpose of the Course',
          icon: '🎯',
          summary: 'Eradicate evaluation inflation and build talent frameworks hyper-aligned with business strategy.',
          details: `
            <p>
              In 80% of organizations, a destructive pattern repeats: Human Resources departments
              <strong>download generic catalogs from the internet</strong> or copy dictionaries from other companies.
            </p>
            <p>
              The result is <em>artificial rating inflation</em>: performance reviews where
              <strong>94% of employees score "Outstanding"</strong>, while strategic projects
              are delayed due to lack of coordination, internal disputes, and hiring errors.
            </p>
            <div class="rise-callout-metric" style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.85rem 1.15rem; margin: 0.75rem 0; border-radius: 6px;">
              <strong>Training mission:</strong> This program trains you as a <strong>Talent Architect and Consultant</strong>
              capable of building, graduating, and auditing your own rigorous competency framework anchored to real business strategy,
              utilizing the scientific standard of the <strong>Martha Alles Trilogy</strong>.
            </div>
            <figure class="rise-figure" style="margin: 0.85rem 0;">
              <div class="rise-figure-media">
                <img src="assets/img/diagrams/trilogia-circuito-en.svg" alt="Martha Alles Trilogy Closed Circuit" class="rise-figure-img" loading="lazy">
              </div>
              <figcaption class="rise-figure-caption">
                <span class="rise-figure-caption-icon">📊</span> The integrated circuit of the 3 Martha Alles volumes: Definitions, Behaviors, and Questions
              </figcaption>
            </figure>
          `
        }),
        Object.freeze({
          id: 'q2-objectives',
          number: 2,
          question: 'What will you achieve upon completion?',
          title: 'Compendium of Performance Objectives',
          icon: '🏆',
          summary: 'Five operational and consulting capabilities ready to apply in the workplace.',
          details: `
            <p>Upon completing the 5 subsequent modules you will master the following technical capabilities:</p>
            <div class="rise-roadmap-grid" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Module 1 • Inverted Diagnosis:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Identify the root cause of copied catalog failure and isolate competency as observable result-oriented behavior (overcoming the "Copied Dictionary Syndrome").</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Module 2 • Competency Engineering:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Master the 4-component technical Alles formula (Verb + Object + Context + Purpose) to draft definitions free from moral bias and apply the Law of Parsimony (cardinal vs. specific).</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Module 3 • Behavioral Calibration (BARS A-B-C-D):</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Graduate behaviors into 4 objective tiers (A-D) based on autonomy and organizational impact (Elliott Jaques), eradicating subjective adjective rating scales in calibration committees.</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Module 4 • Critical Incident Interviews (BBI / STAR):</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Design interview protocols and past probing questions to neutralize rehearsed candidate rhetoric and predict job performance with high validity (r = 0.51-0.65).</p>
              </div>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem 1rem;">
                <strong style="color: var(--mint-dark);">Module 5 • Capstone Studio and Certification:</strong>
                <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: var(--slate-700);">Build, audit, and certify a complete Specification Sheet achieving 100% on the 4-criterion binary rubric, ready for formal export to Word (.docx) and corporate deployment.</p>
              </div>
            </div>
          `
        }),
        Object.freeze({
          id: 'q3-reto-invertido',
          number: 3,
          question: 'What is the "Inverted Challenge" and why do we learn this way?',
          title: 'Andragogic Methodology: The Inverted Challenge',
          icon: '🔄',
          summary: 'Learn from real dilemma and crisis before formal theory: the principle of productive failure.',
          details: `
            <p>
              In traditional corporate training, a passive model dominates: you are first forced to memorize
              dozens of conceptual slides, followed by an abstract recall test.
              In adult learning (andragogy), that approach fails: professionals forget 80% the next day
              because it does not connect to their urgent job challenges.
            </p>
            <div style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.85rem 1.15rem; margin: 0.75rem 0; border-radius: 6px;">
              <strong style="color: var(--mint-dark); font-size: 0.95rem;">How does the Inverted Challenge operate in this course?</strong>
              <ul style="margin: 0.5rem 0 0; padding-left: 1.2rem; font-size: 0.9rem; color: var(--slate-800); line-height: 1.55;">
                <li><strong>Start in the trenches:</strong> Every module starts by immersing you directly into a dilemma, crisis, or broken artifact from a real company (an executive committee fighting over adjectives, a downloaded catalog inflating ratings, an evasive candidate interview).</li>
                <li><strong>Cognitive Break and Productive Failure:</strong> You immediately experience why conventional intuition fails, gaining precise awareness of your competency gap.</li>
                <li><strong>Theory as a living solution:</strong> Grounding from the Martha Alles Trilogy is no longer academic paperwork; it becomes the indispensable technical tool to diagnose and solve the problem.</li>
              </ul>
            </div>
            <p style="margin: 0.5rem 0 0; font-size: 0.9rem; color: var(--slate-600); font-style: italic;">
              "We do not memorize definitions to figure out where to apply them; we confront the real challenge so methodology gains immediate operational meaning."
            </p>
          `
        }),
        Object.freeze({
          id: 'q4-how-it-works',
          number: 4,
          question: 'How does the Dual-Track system work?',
          title: 'Flexible Navigation: Practice vs. Theory',
          icon: '⚡',
          summary: 'Total autonomy: solve practical challenges and consult off-canvas methodological support whenever needed.',
          details: `
            <p>
              This course is not a digitized textbook or a passive slide deck.
              It is engineered under the <strong>Action Mapping model (Kathy Moore)</strong> and the principle of <strong>Productive Failure</strong>:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <div style="background: var(--mint-light); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 6px;">
                <h5 style="color: var(--mint-dark); margin: 0 0 0.5rem; font-size: 0.95rem;">🚀 Practical Track (Action-First)</h5>
                <p style="margin: 0; font-size: 0.86rem; color: var(--slate-700);">
                  Confront realistic dilemmas, conflicted managerial committees, and conversational interview simulators.
                  Learn by experiencing the operational consequences of your decisions.
                </p>
              </div>
              <div style="background: #F1F5F9; border: 1px solid #CBD5E1; padding: 1rem; border-radius: 6px;">
                <h5 style="color: var(--slate-900); margin: 0 0 0.5rem; font-size: 0.95rem;">📖 Theoretical Track (Optional Deep-Dive)</h5>
                <p style="margin: 0; font-size: 0.86rem; color: var(--slate-700);">
                  Every module features an off-canvas panel with rigorous scientific grounding
                  (McClelland, Spencer & Spencer, Elliott Jaques, Flanagan, Cohen, Martha Alles).
                </p>
              </div>
            </div>
            <div class="rise-callout-metric" style="background: #FFFFFF; border: 2px dashed var(--mint-primary); padding: 0.85rem 1.15rem; border-radius: 6px;">
              <strong>You choose where to start:</strong> You can jump straight into solving practical challenges and open theory when you feel the need, or review methodological foundations before tackling the cases. Both learning paths are valid and recognized!
            </div>
            <figure class="rise-figure" style="margin: 0.85rem 0;">
              <div class="rise-figure-media">
                <img src="assets/img/diagrams/dual-track-pathway-en.svg" alt="Dual-Track Dynamics: Practice vs. Theory" class="rise-figure-img" loading="lazy">
              </div>
              <figcaption class="rise-figure-caption">
                <span class="rise-figure-caption-icon">⚡</span> Dual-Track Dynamics: Inverted practical challenge with non-blocking on-demand theory
              </figcaption>
            </figure>
          `
        })
      ]),
      pathways: Object.freeze({
        title: 'Where would you like to start your journey?',
        practiceChoice: Object.freeze({
          title: 'Start with Practice (Module 1 Challenge)',
          description: 'Immerse yourself immediately in the Novatech Case: 94% false outstanding evaluations.',
          targetModuleIndex: 1
        }),
        theoryChoice: Object.freeze({
          title: 'Review Theoretical Foundations First',
          description: 'Open the methodological panel to explore the Martha Alles Trilogy architecture and andragogic model.',
          theoryId: 'mod-0-theory'
        })
      })
    })
  }),

  // =========================================================================
  // MODULE 1
  // =========================================================================
  Object.freeze({
    id: 'mod-1',
    number: 1,
    title: 'The Copied Dictionary Syndrome',
    subtitle: 'Why competency frameworks downloaded from the internet fail',
    leadIntro: 'Importing generic catalogs creates critical distortions: inflated performance ratings while productivity, internal team climate, and cross-functional coordination suffer continuous deterioration.',
    badge: 'Module 1 • Inverted Diagnosis',
    duration: '10 min',
    theoryId: 'mod-1-theory',
    objective: 'Identify the root cause of generic catalog failures and adopt the concept of competency as observable business-oriented behavior.',
    overview: `
      In this opening module, experience the most common talent pain point:
      extensive catalogs where all employees score outstanding while productivity and culture deteriorate.
    `,
    challenge: Object.freeze({
      id: 'challenge-1',
      moduleId: 'mod-1',
      badge: 'Inverted Challenge • Action Mapping',
      title: 'The Novatech Case: 94% Outstanding Evaluations',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-novatech-crisis-en.svg',
        alt: 'Novatech S.A. Case and Rating Inflation',
        caption: 'Novatech S.A.: Evaluation paradox (94% outstanding vs. delayed delivery).'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            You have just assumed the role of <strong>Head of Talent at Novatech</strong>, a cloud technology services company.
            Eight months ago, prior management downloaded a standard 50-competency catalog from an HR website.
          </p>
          <div class="rise-callout-metric" style="background: var(--mint-light); border-left: 4px solid var(--mint-dark); padding: 0.75rem 1rem; margin: 0.75rem 0; border-radius: 4px;">
            <strong>Result of the latest performance review:</strong><br>
            <strong>94% of employees</strong> were rated <em>"Outstanding"</em> in the competency <em>"Teamwork"</em>.
          </div>
          <p>
            <strong>The real crisis:</strong> Product, Operations, and Sales have paralyzed the quarter's three major product launches
            due to territorial infighting, withheld information, and lack of cross-functional commitment.
          </p>
          <p>
            The CEO calls an urgent meeting demanding answers:
            <em>"If 94% of our workforce is outstanding in teamwork, why is no one collaborating to deliver our projects?"</em>
          </p>
        </div>
      `,
      question: 'What is the technical root cause of this discrepancy at Novatech?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c0-a',
          key: 'A',
          text: 'The deficiency lies in leadership style; lacking managerial skills, supervisors rewarded hierarchical compliance instead of collective delivery.',
          isCorrect: false,
          consequence: '6-month simulation: You invested $40,000 in generic leadership seminars. The next evaluation cycle showed 96% outstanding ratings, yet releases remained stalled.',
          feedback: 'You treated a methodological symptom rather than the technical root cause. When competency definitions lack behavioral anchors, even skilled managers cannot rate objectively.'
        }),
        Object.freeze({
          id: 'c0-b',
          key: 'B',
          text: 'The issue stems from arbitrary grading; lacking objective anchors, managers gave everyone top scores to preserve artificial team harmony.',
          isCorrect: false,
          consequence: '6-month simulation: Imposing arbitrary forced quotas created resentment, demoralized high performers, and destroyed team psychological safety.',
          feedback: 'Forced ranking cures fever by breaking the thermometer. Imposing forced bell curves without objective behavioral anchors simply punishes employees arbitrarily.'
        }),
        Object.freeze({
          id: 'c0-c',
          key: 'C',
          text: 'The cause lies in the generic copied competency; lacking observable business anchors, evaluators rated cordiality rather than delivery behaviors.',
          isCorrect: true,
          consequence: 'Accurate diagnosis! An audit of the copied definition revealed: it required "maintaining a cordial and respectful attitude with peers". The catalog rewarded coffee-break politeness without measuring cross-team operational coordination.',
          feedback: 'Outstanding diagnosis. You isolated the methodological root cause before wasting budget on cosmetic training or artificial quotas.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'Martha Alles Principle #1: What a Competency Really Is',
        content: `
          A competency <strong>is not a moral value, a well-meaning wish, or an evaluative adjective</strong>.
          It is a measurable individual characteristic translatable into <em>observable behaviors</em> that ensure
          successful performance in a specific organization and strategy.
        `,
        takeaways: Object.freeze([
          'A competency without associated observable behaviors is merely corporate poetry.',
          'Copying catalogs imports foreign cultures that have nothing to do with your business operational pain points.',
          'Objective evaluation requires behaviorally anchored rating scales (BARS).'
        ])
      })
    })
  }),

  // =========================================================================
  // MODULE 2
  // =========================================================================
  Object.freeze({
    id: 'mod-2',
    number: 2,
    title: 'Competency Engineering',
    subtitle: 'Alles drafting formula and decoupling cardinal vs. specific competencies',
    leadIntro: 'Definitions drafted with moral judgments, emotional demands, or merged competencies distort talent assessment and produce unresolvable discrepancies between evaluators and collaborators.',
    badge: 'Module 2 • Operational Drafting',
    duration: '15 min',
    theoryId: 'mod-2-theory',
    objective: 'Master the 4-element technical formula to draft definitions free from moral judgments and apply the Law of Parsimony.',
    overview: `
      Learn to dismantle Frankenstein definitions and draft clean, verifiable competencies
      decoupled into organization-wide (cardinal) and role-specific competencies.
    `,
    challenge: Object.freeze({
      id: 'challenge-2',
      moduleId: 'mod-2',
      badge: 'Inverted Challenge • Anti-Pattern Detection',
      title: 'Broken Artifact Audit: Proactivity and Digital Resilience',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-broken-artifact-en.svg',
        alt: 'Broken Artifact Audit',
        caption: 'Defective Corporate Artifact: Moral judgments and unobservable drafting.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            An external consulting firm submitted the following draft to the HR Department for inclusion in the corporate job catalog:
          </p>
          <div class="rise-broken-artifact" style="background: var(--danger-bg, #FEF2F2); border: 2px dashed var(--danger-border, #DC2626); padding: 1rem; border-radius: 6px; margin: 1rem 0; font-family: monospace;">
            <strong>COMPETENCY:</strong> Proactivity and Digital Resilience<br><br>
            <strong>DEFINITION:</strong> Ability to be a good person, maintain a positive attitude toward software issues, and love the company working with passion without complaining.
          </div>
          <p>
            Your mission before reviewing the methodology guide is to audit this artifact and identify its structural technical defects.
          </p>
        </div>
      `,
      question: 'What are the critical flaws that technically invalidate this definition under the Martha Alles standard?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c1-a',
          key: 'A',
          text: 'It fails to specify required programming languages and software tools, preventing formal assessment of specialized technical hard skills.',
          isCorrect: false,
          consequence: 'You conflated behavioral competencies with role technical knowledge (hard skills). Detailing software technologies turns competencies into obsolete syllabi once software updates.',
          feedback: 'Technical tools belong to knowledge inventories (visible iceberg), whereas behavioral competencies assess underlying operational conduct.'
        }),
        Object.freeze({
          id: 'c1-b',
          key: 'B',
          text: 'It incurs subjective moral judgments and unprovable affective demands, fusing multiple competencies without an observable action verb.',
          isCorrect: true,
          consequence: 'Flawless audit! You caught the toxic blend of moralizing preaching with behavioral competencies. No evaluator can audit whether someone "loves the company with passion without complaining".',
          feedback: 'Exactly. Moral virtues and emotional states cannot be graduated into competencies. Martha Alles demands univocal constructs and measurable action verbs.'
        }),
        Object.freeze({
          id: 'c1-c',
          key: 'C',
          text: 'It lacks extensive conceptual grounding and corporate culture quotes, leaving expected employee behavior without philosophical support.',
          isCorrect: false,
          consequence: 'Lengthening definitions with doctrinal citations or philosophical manifestos creates 400-page bureaucratic binders that no line manager ever reads.',
          feedback: 'Verbosity and philosophical rhetoric do not replace operational rigor. Martha Alles demands conciseness, technical precision, and behavioral anchoring in a single well-crafted sentence.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'Martha Alles Construction Formula (Volume I)',
        content: `
          Every technical competency definition must articulate <strong>4 immutable components</strong> to guarantee psychometric objectivity and behavioral anchoring:
        `,
        formula: '[Action verb in infinitive] + [Impact object / Technical domain] + [Organizational context and complexity] + [Strategic purpose / Expected outcome]',
        components: Object.freeze([
          Object.freeze({
            num: '1',
            name: 'Action verb in infinitive',
            desc: 'Defines directly observable and measurable workplace behavior, eradicating moral judgments or emotional states.',
            example: '"Design, structure, and execute..." (Externally auditable operational behaviors).',
            contraExample: '"Be an enthusiastic person, love the company, or feel true calling..." (Subjective value judgments or unmeasurable emotional states).'
          }),
          Object.freeze({
            num: '2',
            name: 'Impact object / Technical domain',
            desc: 'The deliverable, system, process, or asset on which workplace action directly acts.',
            example: '"...the logistics distribution master plan and Service Level Agreements (SLAs)..." (Concrete business deliverable).',
            contraExample: '"...the positive departmental vibe or office happiness..." (Vague, intangible concepts decoupled from workflow).'
          }),
          Object.freeze({
            num: '3',
            name: 'Organizational context and complexity',
            desc: 'The environment of uncertainty, time pressures (SLAs), or required stakeholder interaction level.',
            example: '"...under volatile demand conditions and critical delivery deadlines under 24 hours..." (Realistic constraints).',
            contraExample: '"...only when weather conditions are favorable or when no emergencies arise..." (Trivial permissive conditions nullifying role expectations).'
          }),
          Object.freeze({
            num: '4',
            name: 'Strategic purpose / Expected outcome',
            desc: 'Tangible business value or quantifiable impact justifying the competency.',
            example: '"...guaranteeing on-time dispatch rates above 98% without exceeding budgeted costs." (Measurable impact on KPIs and profitability).',
            contraExample: '"...so managers feel pleased and coworkers greet us warmly." (Subjective social approval without corporate return).'
          })
        ]),
        takeaways: Object.freeze([
          'Zero moral terms: forbidden words include "good", "loyal", "healthy", "enthusiastic", "passion for the badge".',
          'Uniqueness: A competency assesses a single construct; never merge "Leadership and Agile Negotiation".',
          'Law of Parsimony: Maximum 3-5 Cardinal competencies for the entire company and 3-4 Specific competencies per role.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Phase 2 • Practical Application Workshop',
      title: 'From Critical Audit to Technical Assembly',
      lead: 'You successfully identified drafting defects, the trap of moral judgments, and construct blending in a broken definition.',
      description: 'The next methodological step moves from passive diagnosis to active construction: apply the Martha Alles 4-component formula to draft a pure, measurable, outcome-oriented competency definition.',
      focus: 'Mission: Select the correct fragments in each block to assemble a Golden Standard definition free from emotional bias.'
    }),
    practiceBuilder: Object.freeze({
      title: 'Assembly Workshop: Outcome Orientation in Critical Logistics',
      instructions: 'Build the golden definition by combining the correct components according to the Alles formula:',
      sections: Object.freeze([
        Object.freeze({
          id: 'sec-verb',
          name: '1. Verb and Core Action',
          options: Object.freeze([
            Object.freeze({ id: 'v-1', text: 'Identify and execute operational priorities...', isCorrect: true }),
            Object.freeze({ id: 'v-2', text: 'Love the work and possess passion for dispatching orders...', isCorrect: false }),
            Object.freeze({ id: 'v-3', text: 'Be a kind collaborator who never says no...', isCorrect: false })
          ])
        }),
        Object.freeze({
          id: 'sec-context',
          name: '2. Operational Context and Complexity',
          options: Object.freeze([
            Object.freeze({ id: 'c-1', text: '...in high-pressure environments with tight delivery timelines...', isCorrect: true }),
            Object.freeze({ id: 'c-2', text: '...only when weather conditions are favorable...', isCorrect: false }),
            Object.freeze({ id: 'c-3', text: '...regardless of costs or whether merchandise is damaged in transit...', isCorrect: false })
          ])
        }),
        Object.freeze({
          id: 'sec-purpose',
          name: '3. Strategic Purpose and Outcome',
          options: Object.freeze([
            Object.freeze({ id: 'p-1', text: '...guaranteeing SLA compliance without exceeding budgeted costs.', isCorrect: true }),
            Object.freeze({ id: 'p-2', text: '...so that clients give us an affectionate smile.', isCorrect: false }),
            Object.freeze({ id: 'p-3', text: '...proving to other departments who has the superior team.', isCorrect: false })
          ])
        })
      ]),
      goldenDefinition: 'Identify and execute operational priorities in high-pressure environments with tight delivery timelines, guaranteeing SLA compliance without exceeding budgeted costs.'
    })
  }),

  // =========================================================================
  // MODULE 3
  // =========================================================================
  Object.freeze({
    id: 'mod-3',
    number: 3,
    title: 'Taxonomy and Graduation of Behaviors (A-B-C-D)',
    subtitle: 'The executive adjective war and the zero-adjectivism rule',
    leadIntro: 'Calibration committees frequently stall in subjective debates when evaluation scales rely on intensity adverbs or vague adjectives that lack verifiable behavioral anchoring.',
    badge: 'Module 3 • Behavioral Calibration',
    duration: '20 min',
    theoryId: 'mod-3-theory',
    objective: 'Graduate behaviors across 4 objective levels (A-D) based on autonomy and organizational impact, eradicating subjective adjectives.',
    overview: `
      Discover how to resolve calibration committee disputes using behaviorally anchored rating scales (BARS)
      where Level A is not "working harder", but expanding systemic scope and discretionary autonomy.
    `,
    challenge: Object.freeze({
      id: 'challenge-3',
      moduleId: 'mod-3',
      badge: 'Inverted Challenge • Calibration Committee',
      title: 'The "Battle of the Managers" Dilemma',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-gerentes-debate-en.svg',
        alt: 'Calibration Committee Dilemma',
        caption: 'Calibration Committee: Subjective adjective dispute vs. objective BARS graduation.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            You are attending the Annual Talent Calibration Committee. Two managers argue heatedly
            over the rating for a senior analyst in the competency <em>"Decision-Making"</em>:
          </p>
          <div class="rise-dialogue-box" style="background: var(--slate-100); padding: 1rem; border-radius: 6px; margin: 0.75rem 0;">
            <p><strong>Finance Manager:</strong> <em>"Must be Level B; works very well and rarely makes mistakes."</em></p>
            <p><strong>Operations Manager:</strong> <em>"No! It is Level A; works in an extraordinary and excellent manner."</em></p>
          </div>
          <p>
            Neither manager can prove the objective difference between "very well" and "excellent".
            The debate has dragged on for 45 minutes and the committee is deadlocked.
          </p>
        </div>
      `,
      question: 'Which of the following behavioral descriptor pairs resolves this dispute objectively and conclusively?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c2-a',
          key: 'A',
          text: 'B: "Regularly meets operational targets with great enthusiasm"; A: "Consistently exceeds assigned goals demonstrating outstanding commitment".',
          isCorrect: false,
          consequence: 'The committee debate intensified: What is the verifiable difference between "great enthusiasm" and "outstanding commitment"? The appraisal remained trapped in adjectives.',
          feedback: 'You fell into the trap of frequency adverbs and praise adjectives. Alles scales forbid graduating by intensifying adjectives; they demand shifting behavioral scope.'
        }),
        Object.freeze({
          id: 'c2-b',
          key: 'B',
          text: 'B: "Autonomously resolves complex departmental contingencies"; A: "Designs corporate policies and methodology impacting the entire company".',
          isCorrect: true,
          consequence: 'Committee aligned in 30 seconds! Both managers checked the analyst dossier: Did this person design a corporate-wide policy or solve departmental contingencies autonomously? Factual evidence settled the debate.',
          feedback: 'Brilliant. Alles graduation relies on Scope of Impact and Time-Span of Discretion (Elliott Jaques), not cosmetic adjective intensification.'
        }),
        Object.freeze({
          id: 'c2-c',
          key: 'C',
          text: 'B: "Possesses two to four years of practical job experience"; A: "Accumulates over five years in leadership roles holding advanced certificates".',
          isCorrect: false,
          consequence: 'The committee rejected the criterion: seniority and diplomas prove time served or academic credits, but do not demonstrate observed workplace effectiveness.',
          feedback: 'You confused credentials and tenure with workplace competence. An employee with 10 years experience can exhibit Grade C behaviors if they do not model or create systemic impact.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'The Alles 4-Grade Matrix and Zero-Adjectivism Rule',
        content: `
          Under Martha Alles methodology, BARS behavioral graduation completely eradicates subjective modifiers
          (<em>"well"</em>, <em>"very well"</em>, <em>"excellent"</em>). No grade intensifies adjectives; instead, each level
          <strong>broadens impact scope and operational autonomy</strong> across 4 objective tiers:
        `,
        levelsLabel: 'Alles 4-Grade Matrix (BARS Taxonomy):',
        levels: Object.freeze([
          Object.freeze({
            level: 'A',
            badge: 'Grade A • 100%',
            name: 'Superior / Organizational Benchmark:',
            desc: 'Models institutional behavior, creates corporate doctrine or policies, and generates systemic impact beyond immediate department.'
          }),
          Object.freeze({
            level: 'B',
            badge: 'Grade B • 75%',
            name: 'Very Good / Autonomous in Complexity:',
            desc: 'Resolves complex operational contingencies with full autonomy in department without supervision.'
          }),
          Object.freeze({
            level: 'C',
            badge: 'Grade C • 50%',
            name: 'Required Standard / Operational:',
            desc: 'Effectively and autonomously fulfills regular processes required for the role under standard working conditions.'
          }),
          Object.freeze({
            level: 'D',
            badge: 'Grade D • 25%',
            name: 'Initial / In Development:',
            desc: 'Does not meet minimum regular job standard; exhibits behavioral gaps or requires continuous supervision.'
          })
        ]),
        components: Object.freeze([
          Object.freeze({ letter: 'A', name: 'Grade A (100% - Superior)', desc: 'Benchmark, role modeling, corporate systemic impact, and internal doctrine creation.' }),
          Object.freeze({ letter: 'B', name: 'Grade B (75% - Very Good)', desc: 'Total autonomy in severe contingencies and complex resolution within own department.' }),
          Object.freeze({ letter: 'C', name: 'Grade C (50% - Required Standard)', desc: 'Strict, autonomous compliance with operational standards under normal conditions.' }),
          Object.freeze({ letter: 'D', name: 'Grade D (25% - Initial / In Development)', desc: 'Does not reach regular minimum standard; requires ongoing oversight.' })
        ]),
        takeawaysLabel: 'Alles Graduation Key Rules:',
        takeaways: Object.freeze([
          'Zero Adjectivism: Banned "good attitude", "very good performance", or "excellent commitment" in rating scales.',
          'Cumulative Inclusion: Anyone reaching Grade A necessarily masters and executes the behaviors of B, C, and D.',
          'Time-Span of Discretion (Elliott Jaques): The scale measures the time horizon and autonomy in decision-making.',
          'Operational Anchor: Grade C (50%) is the baseline benchmark for the regular job profile.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Phase 2 • Taxonomic Calibration Lab',
      title: 'From Calibration Dilemma to BARS Graduation (A-B-C-D)',
      lead: 'You witnessed in committee how subjective adjectives and adverbs create endless debates and assessment paralysis.',
      description: 'The Martha Alles methodology resolves this conflict through the Zero Adjectivism rule and graduation by levels of autonomy and systemic impact (Elliott Jaques): Grade A (organizational benchmark), Grade B (full contingency autonomy), Grade C (regular job standard), and Grade D (continuous supervision or deviation).',
      focus: 'Mission: Assume the role of technical calibrator and classify each of the 8 observable behaviors into its exact BARS quadrant (A, B, C, or D).'
    }),
    sortingActivity: Object.freeze({
      competencyName: 'Strategic Decision-Making',
      instructions: 'Classify the 8 behavioral descriptors into their respective quadrants (A, B, C, or D):',
      slots: Object.freeze([
        Object.freeze({ id: 'slot-a', level: 'A', title: 'Level A • Systemic / Strategic (100%)', badgeClass: 'rise-level-badge--a' }),
        Object.freeze({ id: 'slot-b', level: 'B', title: 'Level B • Autonomous in Complexity (75%)', badgeClass: 'rise-level-badge--b' }),
        Object.freeze({ id: 'slot-c', level: 'C', title: 'Level C • Operational Standard (50%)', badgeClass: 'rise-level-badge--c' }),
        Object.freeze({ id: 'slot-d', level: 'D', title: 'Level D • Initial / In Development (25%)', badgeClass: 'rise-level-badge--d' })
      ]),
      items: Object.freeze([
        Object.freeze({
          id: 'sort-1',
          level: 'A',
          targetSlot: 'slot-a',
          text: 'Designs and establishes corporate policies and governance frameworks for critical decision-making during unprecedented crisis situations.',
          feedback: 'Correct. Models doctrine with systemic scope company-wide (Grade A).'
        }),
        Object.freeze({
          id: 'sort-2',
          level: 'A',
          targetSlot: 'slot-a',
          text: 'Acts as reference advisor to senior executives and mentors departmental leaders in evaluating high-risk organizational dilemmas.',
          feedback: 'Correct. Institutional mentoring and role modeling (Grade A).'
        }),
        Object.freeze({
          id: 'sort-3',
          level: 'B',
          targetSlot: 'slot-b',
          text: 'Evaluates departmental risks and impacts, making autonomous decisions in unforeseen high-complexity scenarios without supervision.',
          feedback: 'Correct. Full autonomy in departmental contingencies (Grade B).'
        }),
        Object.freeze({
          id: 'sort-4',
          level: 'B',
          targetSlot: 'slot-b',
          text: 'Articulates solutions and cross-functional consensus to unblock critical projects that threaten departmental objectives.',
          feedback: 'Correct. Resolves inter-departmental conflict within tactical horizon (Grade B).'
        }),
        Object.freeze({
          id: 'sort-5',
          level: 'C',
          targetSlot: 'slot-c',
          text: 'Selects the appropriate operational alternative from established options within defined role boundaries under normal working conditions.',
          feedback: 'Correct. Minimum operational standard expected for the position (Grade C).'
        }),
        Object.freeze({
          id: 'sort-6',
          level: 'C',
          targetSlot: 'slot-c',
          text: 'Executes documented contingency procedures when common errors occur, notifying direct supervisors within established response times.',
          feedback: 'Correct. Faithful execution of standard operating procedures (Grade C).'
        }),
        Object.freeze({
          id: 'sort-7',
          level: 'D',
          targetSlot: 'slot-d',
          text: 'Postpones routine operational decisions during minor issues due to fear of error or lack of initiative, requiring continuous supervision.',
          feedback: 'Correct. Dependent on continuous supervision; does not meet role standard (Grade D).'
        }),
        Object.freeze({
          id: 'sort-8',
          level: 'D',
          targetSlot: 'slot-d',
          text: 'Applies impulsive ad-hoc solutions without verifying the immediate operational impact on standard daily team workflow.',
          feedback: 'Correct. Misaligned behavior generating operational rework (Grade D).'
        })
      ])
    })
  }),

  // =========================================================================
  // MODULE 4
  // =========================================================================
  Object.freeze({
    id: 'mod-4',
    number: 4,
    title: 'Critical Incident Interviews (BBI / STAR)',
    subtitle: 'Dismantling the diplomatic candidate through probing questions',
    leadIntro: 'Conditional hypothetical questions allow articulate candidates to hide critical behavioral deficiencies behind theoretical speeches, distorting hiring decisions and elevating operational risk.',
    badge: 'Module 4 • STAR Evidence',
    duration: '20 min',
    theoryId: 'mod-4-theory',
    objective: 'Design and conduct competency interviews (BBI) formulating probing questions that isolate actual past behavior.',
    overview: `
      Learn to neutralize rehearsed answers and diplomatic speeches from applicants,
      applying Flanagan critical incidents technique and the STAR model to gather verifiable behavioral evidence.
    `,
    challenge: Object.freeze({
      id: 'challenge-4',
      moduleId: 'mod-4',
      badge: 'Inverted Challenge • Selection Error',
      title: 'The Case of the "Diplomatic Candidate"',
      visualAsset: Object.freeze({
        src: 'assets/img/scenarios/scenario-diplomatic-candidate-en.svg',
        alt: 'The Diplomatic Candidate Case',
        caption: 'STAR Interview: Dismantling rehearsed hypothetical answers with past factual inquiry.'
      }),
      context: `
        <div class="rise-scenario-briefing">
          <p>
            You are auditing a failed hiring process for the position of <strong>Cybersecurity and Infrastructure Lead</strong>.
            In the interview recording, the HR interviewer asks:
          </p>
          <div class="rise-dialogue-box" style="background: var(--slate-100); padding: 1rem; border-radius: 6px; margin: 0.75rem 0;">
            <p><strong>HR Interviewer:</strong> <em>"What would you do if a mission-critical server crashed on Sunday at 3:00 AM?"</em></p>
            <p><strong>Candidate (with impeccable eloquence):</strong> <em>"Ah, I am an exceptionally committed individual. I would stay calm, call my team, inspect system logs, and resolve the situation with resilience and leadership."</em></p>
            <p><strong>HR Rating:</strong> <strong>Level A - Outstanding Candidate</strong>.</p>
          </div>
          <p>
            <strong>Outcome:</strong> The candidate was hired. Three weeks later, the payment gateway collapsed.
            The engineer failed to document the incident, panicked, and blamed the internet service provider.
          </p>
        </div>
      `,
      question: 'What was the cardinal sin in the question asked by the HR interviewer?',
      choices: Object.freeze([
        Object.freeze({
          id: 'c3-a',
          key: 'A',
          text: 'Failing to demand current critical infrastructure certifications, preventing formal verification of technical server management skills.',
          isCorrect: false,
          consequence: 'Demanding certificates validates formal knowledge (tip of iceberg), but cannot anticipate how someone reacts under intense operational panic.',
          feedback: 'Credentials and certifications are necessary prerequisites but insufficient; they cannot predict real workplace behavior under stress.'
        }),
        Object.freeze({
          id: 'c3-b',
          key: 'B',
          text: 'Framing inquiry in hypothetical conditional tense, enabling a canned theoretical speech rather than demanding demonstrated past behavior.',
          isCorrect: true,
          consequence: 'Exactly! Martha Alles core axiom: "The best predictor of how someone will act tomorrow is how they acted yesterday in a similar situation". Hypothetical questions reward eloquence, not real competence.',
          feedback: 'Brilliant. You identified the source of 70% of hiring mistakes: substituting factual STAR evidence with well-delivered hypothetical projections.'
        }),
        Object.freeze({
          id: 'c3-c',
          key: 'C',
          text: 'Dispensing with standardized psychometric tests and personality inventories, reducing the interview to an informal dialogue without calibration.',
          isCorrect: false,
          consequence: 'Traditional psychometric batteries have modest predictive validity compared to structured critical incident interviews, and do not exempt checking facts.',
          feedback: 'The BBI/STAR technique exhibits superior predictive validity (r = 0.51 - 0.65) versus abstract tests because it audits verifiable workplace behavior.'
        })
      ]),
      jitPill: Object.freeze({
        title: 'BBI / STAR Question Structure and Probing Questions',
        content: `
          All competency inquiry must be anchored in the STAR methodology:
        `,
        components: Object.freeze([
          { letter: 'S', name: 'Situation', desc: 'Real past context (past 12 to 24 months).' },
          { letter: 'T', name: 'Task', desc: 'Specific challenge or objective to be reached.' },
          { letter: 'A', name: 'Individual Action', desc: 'What the individual specifically executed (dismantling corporate "we").' },
          { letter: 'R', name: 'Result', desc: 'Measurable impact, quantifiable outcome, and key takeaway.' }
        ]),
        takeaways: Object.freeze([
          'Prohibit conditional questions: never ask "What would you do if...?".',
          'Always open in the past tense: "Tell me about a specific occasion when you had to...".',
          'Surgical probing: Use follow-up questions to drill down from conceptual rhetoric to demonstrable fact.'
        ])
      })
    }),
    exerciseTransition: Object.freeze({
      badge: 'Phase 2 • Live Conversational Simulation',
      title: 'From Bias Diagnosis to Critical Incident Interrogation',
      lead: 'You discovered why conditional questions ("What would you do if...?") facilitate rehearsed speeches and cause disastrous hires.',
      description: 'The only reliable predictor of future performance is behavior demonstrated in the recent past. In this simulator you will interview candidate Javier Méndez: formulate probing questions under the BBI/STAR technique to dismantle his rhetoric and extract verifiable evidence.',
      focus: 'Mission: Conduct the 3 interview turns selecting questions anchored in the past tense and focused on the candidate individual role.'
    }),
    chatSimulator: Object.freeze({
      candidate: Object.freeze({
        name: 'Javier Mendez',
        role: 'Applicant for Operations & Continuity Lead',
        avatarText: 'JM'
      }),
      initialDialogue: Object.freeze({
        text: 'Good afternoon. As you have seen in my profile, I am an individual with a deep vocation for resilience and thriving under pressure. In any operational crisis, I stay calm, lead with optimism, and make things happen without hesitation.'
      }),
      turns: Object.freeze([
        Object.freeze({
          id: 'turn-1',
          prompt: 'Turn 1: The candidate replies with a rehearsed abstract speech. Which probing question do you ask?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-1a',
              key: 'A',
              text: 'What would you do if our core platform went down this weekend during a major sales event?',
              isEffective: false,
              feedback: 'Critical error: you asked a hypothetical question ("What would you do?"). The candidate will simply deliver an idealized script.',
              candidateResponse: 'Terrific question. I would immediately mobilize all teams, apply agile problem-solving, and work non-stop until systems recovered while keeping clients updated.'
            }),
            Object.freeze({
              id: 'opt-1b',
              key: 'B',
              text: 'Why do you believe you are a better fit for this position than other candidates?',
              isEffective: false,
              feedback: 'Subjective self-concept question. Elicits vanity and produces zero behavioral proof.',
              candidateResponse: 'Well, my dedication is 200%. I work whatever hours are needed and my loyalty to the brand is absolute.'
            }),
            Object.freeze({
              id: 'opt-1c',
              key: 'C',
              text: 'Describe a specific occasion in the past 12 months when a mission-critical server crashed on your watch. What was the situation and what was your immediate action in the first 15 minutes?',
              isEffective: true,
              feedback: 'Outstanding! Pure BBI/STAR question: anchored in the past, situational, and focused on immediate personal action.',
              candidateResponse: 'Last November during CyberMonday, the load balancer crashed at 02:15 AM dropping the checkout service. In the first 10 minutes, before calling anyone, I inspected the CloudWatch console to isolate whether it was a DDoS spike or database lock.'
            })
          ])
        }),
        Object.freeze({
          id: 'turn-2',
          prompt: 'Turn 2: The candidate began detailing facts. How do you continue probing to isolate individual action and results (STAR)?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-2a',
              key: 'A',
              text: 'Did you feel frightened or nervous when seeing the payment gateway go down?',
              isEffective: false,
              feedback: 'Investigates personal emotions rather than observable actions and operational outcomes.',
              candidateResponse: 'Not really, I always maintain nerves of steel under pressure; it is an innate trait in my temperament.'
            }),
            Object.freeze({
              id: 'opt-2b',
              key: 'B',
              text: 'You mentioned the balancer saturated. Specifically you, what action did you execute to restore service and what business metric confirmed recovery?',
              isEffective: true,
              feedback: 'Surgical precision! You dismantled the collective pronoun and required the objective result metric (R in STAR).',
              candidateResponse: 'I redirected traffic to our secondary failover cluster using a script I wrote and set timeouts to 3 seconds. By 02:38 AM checkout resumed 99.4% transaction success without lost carts.'
            }),
            Object.freeze({
              id: 'opt-2c',
              key: 'C',
              text: 'Do you feel management should have invested more in infrastructure before CyberMonday?',
              isEffective: false,
              feedback: 'Suggestive organizational grievance question. Diverts focus from candidate behavior.',
              candidateResponse: 'Definitely. I warned them servers were insufficient, but they declined to allocate the budget.'
            })
          ])
        }),
        Object.freeze({
          id: 'turn-3',
          prompt: 'Turn 3: You have Action and Result. What calibration question distinguishes whether the candidate rates Grade C, B, or A?',
          options: Object.freeze([
            Object.freeze({
              id: 'opt-3a',
              key: 'A',
              text: 'After resolving the immediate emergency, what steps did you take to prevent this failure from recurring across the company?',
              isEffective: true,
              feedback: 'Methodological mastery! This question separates Grade C (immediate fix) from Grade B/A (process overhaul and preventive corporate policy design).',
              candidateResponse: 'During the following week I authored the post-mortem, created predictive auto-scaling rules, and drafted the incident playbook currently applied by all 4 regional infrastructure teams.'
            }),
            Object.freeze({
              id: 'opt-3b',
              key: 'B',
              text: 'Did the company reward you with a bonus or monetary bonus for working through the night?',
              isEffective: false,
              feedback: 'Irrelevant. Financial compensation received does not reflect developmental competency level.',
              candidateResponse: 'They commended me on Slack, but there was no monetary bonus.'
            }),
            Object.freeze({
              id: 'opt-3c',
              key: 'C',
              text: 'Do you believe Martha Alles would be satisfied with your performance that night?',
              isEffective: false,
              feedback: 'Informal meta-question. Adds no value to BBI calibration.',
              candidateResponse: 'I am unfamiliar with Martha Alles, but my team was very satisfied with the outcome.'
            })
          ])
        })
      ])
    })
  }),

  // =========================================================================
  // MODULE 5
  // =========================================================================
  Object.freeze({
    id: 'mod-5',
    number: 5,
    title: 'Capstone Studio: Test Bench and Calibration',
    subtitle: 'Technical audit of specification sheet and 100% binary certification',
    leadIntro: 'A corporate dictionary only safeguards decision-making when every technical specification sheet withstands executive scrutiny and passes rigorous methodological quality control before rollout.',
    badge: 'Module 5 • Final Certification',
    duration: '25 min',
    theoryId: 'mod-5-theory',
    objective: 'Build and audit the definitive Competency Specification Sheet achieving 100% on the 4-criterion binary rubric.',
    overview: `
      In this integrative capstone module, act as Lead Talent Consultant.
      Audit and calibrate the complete specification sheet for "Organizational Change Management"
      for a company undergoing digital transformation, strictly fulfilling the 4 quality standards of the Martha Alles Trilogy.
    `,
    capstoneCase: Object.freeze({
      company: 'Retail Sur Americana',
      businessContext: `
        Traditional retail chain with 45 physical stores and 2,800 employees.
        Undergoing critical digital transformation and omnichannel restructuring to compete with e-commerce giants.
        General Management requires adding to all leadership profiles the cardinal competency:
        <strong>Organizational Change Management</strong>.
      `,
      competencyName: 'Organizational Change Management',
      type: 'Cardinal Competency (Applies to 100% of organizational leaders)'
    }),
    rubricCriteria: Object.freeze([
      Object.freeze({
        id: 'c1',
        name: 'Criterion 1: Clean Conceptual Definition',
        question: 'Is the definition drafted using Alles syntax and free from moral/emotional judgments?',
        requirement: 'Must contain Infinitive verb + Object + Context + Purpose, without words like "love", "good", "loyal", or "with enthusiasm".'
      }),
      Object.freeze({
        id: 'c2',
        name: 'Criterion 2: Graduation by Scope and Impact',
        question: 'Are behaviors A-D graduated by autonomy and scope of impact, without cosmetic adjectives?',
        requirement: 'Forbidden to use "well", "very well", "excellent". Differences must be based on complexity and time horizon.'
      }),
      Object.freeze({
        id: 'c3',
        name: 'Criterion 3: Taxonomic Anchoring Grades A and C',
        question: 'Does Grade C represent the minimum operational standard and Grade A systemic corporate impact?',
        requirement: 'Grade C must reflect standard execution and Grade A must include modeling, mentoring, or creating corporate doctrine.'
      }),
      Object.freeze({
        id: 'c4',
        name: 'Criterion 4: Past Real BBI / STAR Questions',
        question: 'Do critical incident questions investigate real past events and ban conditional phrasing ("What would you do?")?',
        requirement: 'Must demand specific events from the last 12-24 months with follow-up probing questions on individual action.'
      })
    ]),
    submissionBlueprint: Object.freeze({
      definition: 'Drive and facilitate the adoption of new work models and technologies across multidisciplinary teams, minimizing resistance and guaranteeing operational business continuity during transition.',
      levels: Object.freeze({
        A: 'Designs corporate organizational change strategy, models adaptability behaviors company-wide, and neutralizes systemic resistance in executive committees.',
        B: 'Leads operational transition in department autonomously, redesigns workflows to absorb contingencies, and advises peers across other areas.',
        C: 'Applies standard transition protocols and digital tools in direct team, providing feedback on deviations according to established guidelines.',
        D: 'Exhibits passive resistance to new processes or requires continuous supervision to adopt operational change directives.'
      }),
      bbiQuestions: Object.freeze([
        'Describe a specific situation in the last 18 months where your team formally resisted implementing a new corporate system or policy. What was your direct intervention during the first days?',
        'What was the quantitative or objective indicator that proved the change was consolidated in your team operational routine?',
        'Probing question: When the transition caused delivery delays, what decision did you make individually to preserve service standards without breaching the new directive?'
      ])
    })
  })
]);

export const I18N_MODULES_DATA = Object.freeze({
  es: MODULES_DATA,
  en: MODULES_DATA_EN
});

export function getModulesData(lang = 'es') {
  return lang === 'en' ? MODULES_DATA_EN : MODULES_DATA;
}

