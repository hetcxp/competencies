/**
 * Rubric Evaluator - Servicio de Auditoría y Certificación Binaria Capstone
 * Aplica la rúbrica binaria de 4 criterios obligatorios (100% pass) según Martha Alles:
 * - C1: Definición conceptual libre de términos morales y formulada con sintaxis técnica.
 * - C2: Comportamientos graduados por alcance e impacto sin intensificación adjetival.
 * - C3: Anclaje de Grado C en estándar mínimo operativo y Grado A en impacto sistémico / doctrina.
 * - C4: Preguntas BBI ancladas en eventos pasados reales (cero condicional "¿qué harías?").
 *
 * Layer: SERVICE (Zero UI / Zero DOM dependencies)
 */

export const FORBIDDEN_MORAL_TERMS = Object.freeze([
  'bueno', 'buena', 'buenos', 'buenas',
  'leal', 'lealtad',
  'entusiasta', 'entusiasmo',
  'amor', 'amar',
  'pasión', 'pasion',
  'sano', 'sana',
  'cariño', 'cariñosa', 'cariñoso'
]);

export const FORBIDDEN_MORAL_TERMS_EN = Object.freeze([
  'good', 'loyal', 'loyalty',
  'enthusiastic', 'enthusiasm',
  'love', 'passion', 'passionate',
  'healthy', 'affection', 'caring'
]);

export const FORBIDDEN_HYPOTHETICAL_PATTERNS = Object.freeze([
  /qu[eé]\s+har[ií]as/i,
  /c[oó]mo\s+actuar[ií]as/i,
  /qu[eé]\s+sentir[ií]as/i,
  /c[oó]mo\s+manejar[ií]as/i,
  /qu[eé]\s+opinas\s+de/i
]);

export const FORBIDDEN_HYPOTHETICAL_PATTERNS_EN = Object.freeze([
  /what\s+would\s+you\s+do/i,
  /how\s+would\s+you\s+act/i,
  /how\s+would\s+you\s+feel/i,
  /how\s+would\s+you\s+handle/i,
  /what\s+do\s+you\s+think\s+about/i
]);

export const FORBIDDEN_ADJECTIVE_CHAINS = Object.freeze([
  /comunica\s+(bien|muy\s+bien|excelente)/i,
  /trabaja\s+(bien|muy\s+bien|excelente)/i,
  /cumple\s+(bien|muy\s+bien|excelente)/i,
  /\b(regular\b.*\bbueno\b.*\bmuy\s+bueno\b.*\bexcelente)\b/i
]);

export const FORBIDDEN_ADJECTIVE_CHAINS_EN = Object.freeze([
  /communicates?\s+(well|very\s+well|excellent)/i,
  /works?\s+(well|very\s+well|excellent)/i,
  /performs?\s+(well|very\s+well|excellent)/i,
  /\b(fair\b.*\bgood\b.*\bvery\s+good\b.*\bexcellent)\b/i
]);

export class RubricEvaluator {
  /**
   * @param {Object} [options]
   * @param {Object} [options.store] - Instancia opcional de CourseStore
   * @param {string} [options.lang] - 'es' | 'en'
   */
  constructor(options = {}) {
    this.store = options.store || null;
    this.lang = options.lang === 'en' ? 'en' : 'es';
  }

  /**
   * Actualiza el idioma de la rúbrica
   * @param {'es'|'en'} lang
   */
  setLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'es';
  }

  /**
   * Evalúa Criterio 1: Definición conceptual limpia y fórmula técnica
   * @param {string|boolean} input 
   * @returns {{ passed: boolean, feedback: string }}
   */
  evaluateCriterion1(input) {
    const isEn = this.lang === 'en';
    if (typeof input === 'boolean') {
      return {
        passed: input,
        feedback: input
          ? (isEn
              ? 'Criterion 1 met: Definition formulated according to technical standards and free of moral judgments.'
              : 'Criterio 1 cumplido: Definición formulada según estándar técnico y libre de juicios morales.')
          : (isEn
              ? 'Criterion 1 not met: The definition contains moral judgments or lacks the components of the Alles formula.'
              : 'Criterio 1 no cumplido: La definición contiene juicios morales o carece de los componentes de la fórmula Alles.')
      };
    }

    if (typeof input !== 'string' || input.trim().length < 15) {
      return {
        passed: false,
        feedback: isEn
          ? 'The definition must be descriptive text with a minimum of 15 characters.'
          : 'La definición debe ser un texto descriptivo con un mínimo de 15 caracteres.'
      };
    }

    const textLower = input.toLowerCase();
    const activeTerms = isEn ? FORBIDDEN_MORAL_TERMS_EN : FORBIDDEN_MORAL_TERMS;
    const foundForbidden = activeTerms.filter(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      return regex.test(textLower);
    });

    if (foundForbidden.length > 0) {
      return {
        passed: false,
        feedback: isEn
          ? `Flaw detected: The definition contains forbidden moral or emotional terms (${foundForbidden.join(', ')}). It must describe observable behaviors.`
          : `Defecto detectado: La definición contiene términos morales o emocionales vetados (${foundForbidden.join(', ')}). Debe describir conductas observables.`
      };
    }

    return {
      passed: true,
      feedback: isEn
        ? 'Criterion 1 passed: Technical conceptual definition free of moral judgments.'
        : 'Criterio 1 superado: Definición conceptual técnica libre de juicios morales.'
    };
  }

  /**
   * Evalúa Criterio 2: Graduación por alcance e impacto sin adjetivos subjetivos
   * @param {Object|boolean} input 
   * @returns {{ passed: boolean, feedback: string }}
   */
  evaluateCriterion2(input) {
    const isEn = this.lang === 'en';
    if (typeof input === 'boolean') {
      return {
        passed: input,
        feedback: input
          ? (isEn
              ? 'Criterion 2 met: Behaviors graduated by autonomy and scope of impact.'
              : 'Criterio 2 cumplido: Comportamientos graduados por autonomía y ámbito de impacto.')
          : (isEn
              ? 'Criterion 2 not met: Behaviors are differentiated by subjective adjective intensity.'
              : 'Criterio 2 no cumplido: Los comportamientos se diferencian por intensidad adjetival subjetiva.')
      };
    }

    if (input && typeof input === 'object') {
      const levels = [input.A, input.B, input.C, input.D].filter(Boolean);
      if (levels.length < 4) {
        return {
          passed: false,
          feedback: isEn
            ? 'All 4 complete levels must be defined (Grades A, B, C, and D).'
            : 'Deben definirse los 4 niveles completos (Grados A, B, C y D).'
        };
      }

      const joinedText = levels.join(' ');
      const activePatterns = isEn
        ? [...FORBIDDEN_ADJECTIVE_CHAINS_EN, ...FORBIDDEN_ADJECTIVE_CHAINS]
        : FORBIDDEN_ADJECTIVE_CHAINS;

      for (const pattern of activePatterns) {
        if (pattern.test(joinedText)) {
          return {
            passed: false,
            feedback: isEn
              ? 'Flaw detected: An adjectival scale was detected (well / very well / excellent). Graduation must be based on BARS impact and autonomy.'
              : 'Defecto detectado: Se detectó una escala adjetival (bien / muy bien / excelente). La graduación debe basarse en impacto y autonomía BARS.'
          };
        }
      }

      return {
        passed: true,
        feedback: isEn
          ? 'Criterion 2 passed: Four-dimensional graduation based on autonomy and complexity.'
          : 'Criterio 2 superado: Graduación cuatridimensional basada en autonomía y complejidad.'
      };
    }

    return {
      passed: false,
      feedback: isEn
        ? 'Insufficient data to validate Criterion 2.'
        : 'Datos insuficientes para validar el Criterio 2.'
    };
  }

  /**
   * Evalúa Criterio 3: Anclaje de Grado C (estándar operativo) y Grado A (sistémico/doctrina)
   * @param {Object|boolean} input 
   * @returns {{ passed: boolean, feedback: string }}
   */
  evaluateCriterion3(input) {
    const isEn = this.lang === 'en';
    if (typeof input === 'boolean') {
      return {
        passed: input,
        feedback: input
          ? (isEn
              ? 'Criterion 3 met: Grade C represents the standard and Grade A models systemic impact.'
              : 'Criterio 3 cumplido: Grado C representa el estándar y Grado A modela el impacto sistémico.')
          : (isEn
              ? 'Criterion 3 not met: Grade C or Grade A lack adequate scope anchoring.'
              : 'Criterio 3 no cumplido: Grado C o Grado A carecen de anclaje de alcance adecuado.')
      };
    }

    if (input && typeof input === 'object') {
      const levelA = String(input.A || '').toLowerCase();
      const levelC = String(input.C || '').toLowerCase();

      if (!levelA || !levelC) {
        return {
          passed: false,
          feedback: isEn
            ? 'Explicit description of Grade A and Grade C is required.'
            : 'Se requiere la descripción explícita de Grado A y Grado C.'
        };
      }

      const hasSystemicMarkers = /estrategia|corporativ|sist[eé]mic|doctrina|pol[ií]tica|mentor|alta direcci[oó]n|referente|strategy|corporate|systemic|doctrine|policy|executive|benchmark/i.test(levelA);
      const hasStandardMarkers = /est[aá]ndar|operativ|protocolo|normal|puesto|rutinari|equipo|standard|operational|protocol|routine|team|role/i.test(levelC);

      if (!hasSystemicMarkers) {
        return {
          passed: false,
          feedback: isEn
            ? 'Grade A must encompass impact outside the immediate area, mentorship, doctrine, or systemic scope.'
            : 'El Grado A debe contemplar impacto fuera del área inmediata, mentoría, doctrina o alcance sistémico.'
        };
      }
      if (!hasStandardMarkers) {
        return {
          passed: false,
          feedback: isEn
            ? 'Grade C must reflect compliance with the expected operational standard for the position.'
            : 'El Grado C debe reflejar el cumplimiento del estándar operativo esperado para el puesto.'
        };
      }

      return {
        passed: true,
        feedback: isEn
          ? 'Criterion 3 passed: Grades A and C correctly anchored in the Alles taxonomy.'
          : 'Criterio 3 superado: Grados A y C anclados correctamente en la taxonomía Alles.'
      };
    }

    return {
      passed: false,
      feedback: isEn
        ? 'Insufficient data to validate Criterion 3.'
        : 'Datos insuficientes para validar el Criterio 3.'
    };
  }

  /**
   * Evalúa Criterio 4: Preguntas BBI basadas en hechos pasados reales (prohibido "¿qué harías?")
   * @param {Array<string>|boolean} input 
   * @returns {{ passed: boolean, feedback: string }}
   */
  evaluateCriterion4(input) {
    const isEn = this.lang === 'en';
    if (typeof input === 'boolean') {
      return {
        passed: input,
        feedback: input
          ? (isEn
              ? 'Criterion 4 met: Questions anchored in real past critical events with probing follow-up.'
              : 'Criterio 4 cumplido: Preguntas ancladas en eventos críticos reales pasados con seguimiento de sondeo.')
          : (isEn
              ? 'Criterion 4 not met: Hypothetical questions in conditional detected ("what would you do?").'
              : 'Criterio 4 no cumplido: Se detectaron preguntas hipotéticas en condicional ("¿qué harías?").')
      };
    }

    if (Array.isArray(input)) {
      if (input.length === 0) {
        return {
          passed: false,
          feedback: isEn
            ? 'At least one core Behavioral Event Interview (BBI) question is required.'
            : 'Se requiere al menos una pregunta troncal de Incidentes Críticos (BBI).'
        };
      }

      const activeHypotheticals = isEn
        ? [...FORBIDDEN_HYPOTHETICAL_PATTERNS_EN, ...FORBIDDEN_HYPOTHETICAL_PATTERNS]
        : FORBIDDEN_HYPOTHETICAL_PATTERNS;

      for (const question of input) {
        const qStr = String(question);
        for (const pattern of activeHypotheticals) {
          if (pattern.test(qStr)) {
            return {
              passed: false,
              feedback: isEn
                ? `Flaw detected in question: "${qStr}". Hypothetical questions ("What would you do?") are prohibited in the BBI technique.`
                : `Defecto detectado en pregunta: "${qStr}". Las preguntas hipotéticas ("¿Qué harías?") están prohibidas en la técnica BBI.`
            };
          }
        }
      }

      return {
        passed: true,
        feedback: isEn
          ? 'Criterion 4 passed: Past behavioral event questions without conditional phrasing.'
          : 'Criterio 4 superado: Preguntas de eventos conductuales pasados sin formulaciones condicionales.'
      };
    }

    return {
      passed: false,
      feedback: isEn
        ? 'Insufficient data to validate Criterion 4.'
        : 'Datos insuficientes para validar el Criterio 4.'
    };
  }

  /**
   * Evalúa una entrega completa de Ficha Técnica contra la rúbrica binaria de 4 criterios
   * @param {Object} submissionDto 
   * @returns {Object} Resultado de la auditoría con checklist y certificación
   */
  evaluateSubmission(submissionDto = {}) {
    const isEn = this.lang === 'en';
    // Si viene un objeto con respuestas binarias directas
    const c1Input = submissionDto.c1 !== undefined ? submissionDto.c1 : (submissionDto.definition ?? null);
    const c2Input = submissionDto.c2 !== undefined ? submissionDto.c2 : (submissionDto.levels ?? null);
    const c3Input = submissionDto.c3 !== undefined ? submissionDto.c3 : (submissionDto.levels ?? null);
    const c4Input = submissionDto.c4 !== undefined ? submissionDto.c4 : (submissionDto.bbiQuestions ?? null);

    const res1 = this.evaluateCriterion1(c1Input);
    const res2 = this.evaluateCriterion2(c2Input);
    const res3 = this.evaluateCriterion3(c3Input);
    const res4 = this.evaluateCriterion4(c4Input);

    const criteriaDetails = {
      c1: res1.passed,
      c2: res2.passed,
      c3: res3.passed,
      c4: res4.passed
    };

    const checklist = [
      {
        id: 'c1',
        name: isEn ? 'Clean Conceptual Definition' : 'Definición Conceptual Limpia',
        passed: res1.passed,
        feedback: res1.feedback
      },
      {
        id: 'c2',
        name: isEn ? 'Graduation by Impact and Autonomy' : 'Graduación por Impacto y Autonomía',
        passed: res2.passed,
        feedback: res2.feedback
      },
      {
        id: 'c3',
        name: isEn ? 'Taxonomic Anchoring Grades A & C' : 'Anclaje Taxonómico Grados A y C',
        passed: res3.passed,
        feedback: res3.feedback
      },
      {
        id: 'c4',
        name: isEn ? 'Real Past BBI / STAR Questions' : 'Preguntas BBI / STAR Pasadas Reales',
        passed: res4.passed,
        feedback: res4.feedback
      }
    ];

    const passedCount = Object.values(criteriaDetails).filter(Boolean).length;
    const allPassed = passedCount === 4;
    const score = Math.round((passedCount / 4) * 100);

    // Sincroniza con CourseStore si está disponible
    if (this.store && typeof this.store.dispatchAction === 'function') {
      this.store.dispatchAction('UPDATE_CAPSTONE_RUBRIC', { rubric: criteriaDetails });
    }

    const overallFeedback = allPassed
      ? (isEn
          ? 'Successful Certification! The Technical Specification meets 100% of the methodological standards of the Martha Alles Trilogy. Ready for export to Word (.docx) and corporate deployment.'
          : '¡Certificación Exitosa! La Ficha Técnica cumple el 100% de los estándares metodológicos de la Trilogía Martha Alles. Lista para su exportación a Word (.docx) y despliegue corporativo.')
      : (isEn
          ? `Incomplete audit (${passedCount}/4 criteria passed). Correct the flagged criteria to obtain technical certification.`
          : `Auditoría incompleta (${passedCount}/4 criterios aprobados). Corrige los criterios observados para obtener la certificación técnica.`);

    return {
      passed: allPassed,
      score,
      checklist,
      criteriaDetails,
      feedback: overallFeedback
    };
  }
}

/**
 * Función helper de conveniencia para evaluación directa
 * @param {Object} submissionDto 
 * @param {Object} [store] 
 * @returns {Object}
 */
export function evaluateCapstoneSubmission(submissionDto, store = null) {
  const evaluator = new RubricEvaluator({ store });
  return evaluator.evaluateSubmission(submissionDto);
}
