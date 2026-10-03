/**
 * Router SPA & Controller Principal del Curso SCORM
 * Emula la experiencia Articulate Rise con identidad de diseño Mint:
 * - Navegación lateral y barra de progreso de lecciones
 * - Renderizado dinámico de Módulos 0 a 4
 * - Coordinación de ScenarioBlock, TheoryDrawer, SortingBlock, ChatSimulator y RubricEvaluator
 * - Sincronización automática de progreso con CourseStore y LMS ScormAdapter
 * - Modal de certificación binaria y exportación de Ficha Técnica (Markdown/JSON)
 *
 * Layer: UI (DOM Controller)
 */

import { MODULES_DATA, getModulesData } from '../data/modules-content.js?v=20261001e';
import { THEORY_DATA, getTheoryData } from '../data/theory-drawers.js?v=20261001e';
import { ScenarioBlock } from './scenario-block.js?v=20261001e';
import { TheoryDrawer } from './theory-drawer.js?v=20261001e';
import { SortingBlock } from './sorting-block.js?v=20261001e';
import { ChatSimulator } from './chat-simulator.js?v=20261001e';
import { RubricEvaluator } from '../services/rubric-evaluator.js?v=20261001e';
import { DocxExporter } from '../services/docx-exporter.js?v=20261001e';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const UI_TRANSLATIONS = Object.freeze({
  es: {
    brandBadge: 'Trilogía Martha Alles',
    brandTitle: 'Creación de Marcos de Competencias',
    progressLabel: 'Progreso del Curso:',
    sidebarTitle: 'Índice del Programa',
    sidebarNavAria: 'Navegación de módulos',
    theoryBadgesTitle: 'Insignias Teóricas Opcionales',
    theoryBadgesCount: (viewed, total) => `${viewed} de ${total} fundamentos consultados`,
    objectiveBadge: 'Objetivo de Desempeño',
    theoryBtn: 'Fundamento Metodológico Martha Alles (Opcional)',
    floatingTheoryBtn: 'Fundamentos Metodológicos',
    floatingTheoryAria: 'Abrir Fundamentos Metodológicos',
    prevBtn: '← Módulo Anterior',
    nextBtn: 'Continuar al Siguiente Módulo →',
    finishBtn: 'Finalizar Curso y Certificar',
    completedBadge: '✓ Completado',
    completedText: 'Has completado satisfactoriamente todas las actividades de este módulo.',
    pendingBadge: 'En Curso',
    pendingLead: 'Para marcar este módulo como completado:',
    moduleLockedAlert: 'Módulo bloqueado. Para acceder debes completar previamente las actividades de los módulos anteriores.',
    pendingActivitiesAlert: (acts) => `Para avanzar al siguiente módulo debes completar las actividades pendientes:\n\n${acts.join('\n')}`,
    coursePassedAlert: '¡Felicitaciones! Has completado y certificado el Curso de Creación de Marcos de Competencias Martha Alles.',
    courseNotPassedAlert: 'Para obtener la certificación oficial SCORM debes superar el 100% de la Rúbrica Binaria en el Capstone Studio.',
    clearFieldsConfirm: '¿Deseas vaciar los campos para redactar tu ficha desde cero?',
    caseIntegrator: 'Caso Integrador:',
    fichaTitle: 'Ficha Técnica de Competencia',
    fichaSubtitle: 'Completa los campos con tu propuesta o consulta el ejemplo de referencia para calibrar tu redacción.',
    btnViewExample: '💡 Ver Ficha de Ejemplo',
    btnHideExample: '✕ Ocultar Ejemplo',
    btnClearFields: '🗑️ Limpiar Campos',
    btnExportWord: '📄 Exportar a Word (.docx)',
    refModelBadge: 'Modelo de Referencia Martha Alles',
    calibratedExample: 'Ejemplo Calibrado:',
    modelInstruction: 'Usa este modelo para contrastar la redacción o cárgalo en tu formulario para auditarlo con la rúbrica binaria.',
    btnLoadExample: '📥 Cargar Ejemplo en Formulario',
    secDefTitle: '1. Definición Conceptual:',
    secDefLabel: '1. Definición Conceptual',
    secDefPlaceholder: 'Escribe la definición conceptual usando la fórmula Alles: Verbo infinitivo + Objeto + Contexto + Propósito...',
    secBarsTitle: '2. Graduación de Comportamientos BARS (A-B-C-D):',
    secBarsLabel: '2. Graduación de Comportamientos A-D',
    secBbiTitle: '3. Protocolo de Incidentes Críticos (BBI / STAR):',
    secBbiLabel: '3. Preguntas BBI / STAR Pasadas',
    placeholderLvlA: 'Nivel A (Superior / Referente Sistémico): Diseña estrategia, modela conductas a nivel organizacional...',
    placeholderLvlB: 'Nivel B (Muy Bueno / Autónomo): Lidera la transición operativa de forma autónoma...',
    placeholderLvlC: 'Nivel C (Estándar Requerido): Aplica protocolos y herramientas estándar en su equipo directo...',
    placeholderLvlD: 'Nivel D (Inicial / Requiere Supervisión): Manifiesta dificultades para aplicar nuevos procesos o requiere apoyo continuo...',
    placeholderBbi0: 'Pregunta 1: Relate una situación concreta en los últimos 18 meses donde su equipo se resistió al cambio... ¿Cuál fue su acción concreta?',
    placeholderBbi1: 'Pregunta 2: ¿Cuál fue el indicador cuantitativo u objetivo que demostró que el cambio se consolidó en la rutina operativa?',
    placeholderBbi2: 'Pregunta 3 (Sondeo): Cuando la transición generó retrasos en la entrega, ¿qué decisión tomó individualmente para preservar el estándar?',
    btnAuditCapstone: '🔍 Auditar Ficha con Rúbrica Binaria (100% Pass)',
    rubricPassedTitle: '🎉 Ficha Certificada Apta (100% de Cumplimiento)',
    rubricFailedTitle: '⚠️ Auditoría Observada',
    statusApproved: 'APROBADO',
    statusObserved: 'OBSERVADO',
    btnDownloadDocx: '📄 Descargar Ficha en Word (.docx)',
    btnDownloadMd: '📝 Descargar Ficha (.md)',
    builderSelectDefault: '-- Selecciona el fragmento correcto --',
    builderValidateBtn: 'Validar Fórmula Ensamblada',
    builderSelectAllWarning: 'Selecciona una opción en cada uno de los 3 bloques de la fórmula.',
    builderSuccessPrefix: '¡Fórmula Perfecta!',
    builderSuccessMsg: 'Has ensamblado una definición técnica 100% pura:',
    builderFailureMsg: 'La combinación contiene antipatrones morales o de actitud. Revisa la fórmula Alles.',
    contractBadge: 'Contrato Andragógico & Navegación',
    introKeysTitle: (count) => `${count} Claves Esenciales antes de Comenzar`,
    introKeysDesc: 'Explora las tres premisas fundamentales para aprovechar al máximo los casos prácticos, la espina teórica y el banco de calibración.',
    pathwaysLead: 'En este programa eres el protagonista de tu aprendizaje. Puedes lanzarte a resolver los casos o estudiar primero los fundamentos metodológicos.',
    btnStartPractice: 'Comenzar con la Práctica →',
    btnStartTheory: 'Consultar Fundamento Metodológico 0.E',
    missingMod0: 'Elegir una ruta inicial (Práctica o Teoría) o explorar las 3 preguntas clave',
    missingMod1: 'Resolver el Reto Crítico (Caso Novatech)',
    missingMod2Challenge: 'Resolver el Reto Crítico (Auditoría del Artefacto Roto)',
    missingMod2Builder: 'Validar la Fórmula Ensamblada en el Taller',
    missingMod3Challenge: 'Resolver el Reto Crítico (Dilema Guerra de Gerentes)',
    missingMod3Sorting: 'Completar la Clasificación Taxonómica A-B-C-D',
    missingMod4Challenge: 'Resolver el Reto Crítico (Candidato Diplomático)',
    missingMod4Chat: 'Finalizar la Simulación de Entrevista STAR',
    missingMod5Rubric: 'Aprobar el 100% de la Rúbrica Binaria en el Capstone Studio'
  },
  en: {
    brandBadge: 'Martha Alles Trilogy',
    brandTitle: 'Competency Framework Architecture',
    progressLabel: 'Course Progress:',
    sidebarTitle: 'Program Outline',
    sidebarNavAria: 'Modules navigation',
    theoryBadgesTitle: 'Optional Theory Badges',
    theoryBadgesCount: (viewed, total) => `${viewed} of ${total} foundations viewed`,
    objectiveBadge: 'Performance Objective',
    theoryBtn: 'Martha Alles Methodological Foundation (Optional)',
    floatingTheoryBtn: 'Methodological Foundations',
    floatingTheoryAria: 'Open Methodological Foundations',
    prevBtn: '← Previous Module',
    nextBtn: 'Continue to Next Module →',
    finishBtn: 'Finish Course & Certify',
    completedBadge: '✓ Completed',
    completedText: 'You have successfully completed all activities in this module.',
    pendingBadge: 'In Progress',
    pendingLead: 'To mark this module as completed:',
    moduleLockedAlert: 'Module locked. You must complete the activities of previous modules to access this module.',
    pendingActivitiesAlert: (acts) => `To advance to the next module you must complete the pending activities:\n\n${acts.join('\n')}`,
    coursePassedAlert: 'Congratulations! You have completed and certified the Martha Alles Competency Framework Architecture Course.',
    courseNotPassedAlert: 'To obtain official SCORM certification you must achieve 100% pass on the Binary Rubric in the Capstone Studio.',
    clearFieldsConfirm: 'Do you want to clear all fields to write your competency specification from scratch?',
    caseIntegrator: 'Integrative Case:',
    fichaTitle: 'Competency Technical Specification',
    fichaSubtitle: 'Complete the fields with your proposal or consult the reference example to calibrate your phrasing.',
    btnViewExample: '💡 View Example Specification',
    btnHideExample: '✕ Hide Example',
    btnClearFields: '🗑️ Clear Fields',
    btnExportWord: '📄 Export to Word (.docx)',
    refModelBadge: 'Martha Alles Benchmark Model',
    calibratedExample: 'Calibrated Example:',
    modelInstruction: 'Use this model to calibrate your draft or load it into your form to audit it against the binary rubric.',
    btnLoadExample: '📥 Load Example into Form',
    secDefTitle: '1. Conceptual Definition:',
    secDefLabel: '1. Conceptual Definition',
    secDefPlaceholder: 'Write the conceptual definition using the Alles formula: Infinitive verb + Direct object + Organizational context + Strategic purpose...',
    secBarsTitle: '2. BARS Behavioral Graduation (A-B-C-D):',
    secBarsLabel: '2. Behavioral Graduation A-D',
    secBbiTitle: '3. Behavioral Event Interview Protocol (BBI / STAR):',
    secBbiLabel: '3. Past BBI / STAR Questions',
    placeholderLvlA: 'Level A (Executive / Systemic Benchmark): Designs organizational strategy, models behaviors enterprise-wide...',
    placeholderLvlB: 'Level B (Tactical / Autonomous): Autonomously leads operational transition across departments...',
    placeholderLvlC: 'Level C (Required Standard): Consistently executes standard operating procedures within immediate team...',
    placeholderLvlD: 'Level D (Initial / Needs Supervision): Demonstrates difficulty adopting new workflows or requires ongoing coaching...',
    placeholderBbi0: 'Question 1: Describe a concrete situation in the past 18 months where your team actively resisted change... What specific action did you take?',
    placeholderBbi1: 'Question 2: What quantitative metric or objective metric proved that the change became consolidated in daily operations?',
    placeholderBbi2: 'Question 3 (Probing): When the transition caused delivery delays, what individual decision did you make to safeguard the standard?',
    btnAuditCapstone: '🔍 Audit Specification with Binary Rubric (100% Pass)',
    rubricPassedTitle: '🎉 Certified Compliant Specification (100% Pass)',
    rubricFailedTitle: '⚠️ Audit Findings Detected',
    statusApproved: 'PASSED',
    statusObserved: 'FLAGGED',
    btnDownloadDocx: '📄 Download Specification in Word (.docx)',
    btnDownloadMd: '📝 Download Specification (.md)',
    builderSelectDefault: '-- Select the correct phrase snippet --',
    builderValidateBtn: 'Validate Assembled Formula',
    builderSelectAllWarning: 'Select an option in each of the 3 formula blocks.',
    builderSuccessPrefix: 'Perfect Formula!',
    builderSuccessMsg: 'You assembled a 100% methodologically pure definition:',
    builderFailureMsg: 'The combination contains moral judgments or attitudinal anti-patterns. Review the Alles formula.',
    contractBadge: 'Andragogical Contract & Navigation',
    introKeysTitle: (count) => `${count} Essential Keys Before You Begin`,
    introKeysDesc: 'Explore the three fundamental premises to get the most out of practical cases, the theoretical spine, and the calibration bench.',
    pathwaysLead: 'In this program you drive your own learning journey. You can dive straight into solving crisis cases or study the methodological foundations first.',
    btnStartPractice: 'Start with Practice →',
    btnStartTheory: 'Consult Methodological Foundation 0.E',
    missingMod0: 'Choose an initial pathway (Practice or Theory) or explore the 3 key questions',
    missingMod1: 'Solve the Critical Challenge (Novatech Case)',
    missingMod2Challenge: 'Solve the Critical Challenge (Broken Artifact Audit)',
    missingMod2Builder: 'Validate the Assembled Formula in Practice Builder',
    missingMod3Challenge: 'Solve the Critical Challenge (Managers\' War Dilemma)',
    missingMod3Sorting: 'Complete the A-B-C-D Taxonomic Classification',
    missingMod4Challenge: 'Solve the Critical Challenge (Diplomatic Candidate)',
    missingMod4Chat: 'Finish the STAR Interview Simulation',
    missingMod5Rubric: 'Pass 100% of the Binary Rubric in Capstone Studio'
  }
});

export class CourseRouter {
  /**
   * @param {Object} options
   * @param {Object} options.store - Instancia de CourseStore
   * @param {Object} [options.adapter] - Instancia de ScormAdapter
   * @param {HTMLElement|string} [options.rootContainer] - Contenedor raíz '#app'
   * @param {string} [options.lang] - 'es' | 'en'
   */
  constructor({ store, adapter = null, rootContainer = '#app', lang = null }) {
    this.store = store;
    this.adapter = adapter;
    this.container = typeof rootContainer === 'string'
      ? (typeof document !== 'undefined' ? document.querySelector(rootContainer) : null)
      : rootContainer;

    let initialLang = lang || 'es';
    try {
      if (!lang && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('trilogia_course_lang');
        if (saved === 'en' || saved === 'es') {
          initialLang = saved;
        }
      }
    } catch (e) {}

    this.currentLanguage = initialLang === 'en' ? 'en' : 'es';
    this.currentModuleIndex = 0;
    this.theoryDrawer = null;
    this.rubricEvaluator = new RubricEvaluator({ store: this.store, lang: this.currentLanguage });

    if (this.store) {
      const state = this.store.getState();
      const requestedIndex = typeof state.currentModule === 'number' ? state.currentModule : 0;
      this.currentModuleIndex = this._getHighestUnlockedModule(requestedIndex);
      if (this.currentModuleIndex !== requestedIndex) {
        this.store.dispatchAction('NAVIGATE_MODULE', { moduleIndex: this.currentModuleIndex, moduleId: this.currentModuleIndex });
      }
    }

    if (this.container && typeof this.container === 'object') {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = this.currentLanguage;
      }
      this.init();
    }
  }

  get modules() {
    return getModulesData(this.currentLanguage);
  }

  get theoryData() {
    return getTheoryData(this.currentLanguage);
  }

  /**
   * Cambia el idioma global del curso y re-renderiza manteniendo el estado
   * @param {'es'|'en'} lang 
   */
  setLanguage(lang) {
    const targetLang = lang === 'en' ? 'en' : 'es';
    if (this.currentLanguage === targetLang) return;
    this.currentLanguage = targetLang;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('trilogia_course_lang', targetLang);
      }
    } catch (e) {}

    if (typeof document !== 'undefined') {
      document.documentElement.lang = targetLang;
      document.title = targetLang === 'en'
        ? 'Competency Framework Architecture | Martha Alles Methodology'
        : 'Construcción de Modelos de Competencias | Metodología Martha Alles';
    }

    if (this.theoryDrawer) {
      this.theoryDrawer.setLanguage(targetLang);
    }
    if (this.rubricEvaluator) {
      this.rubricEvaluator.setLanguage(targetLang);
    }

    this.render();
  }

  /**
   * Inicializa la interfaz SPA y monta la vista actual
   */
  init() {
    if (!this.container || typeof this.container !== 'object') return;

    // Inicializa el drawer de espinas teóricas opcionales si hay DOM
    if (typeof document !== 'undefined') {
      this.theoryDrawer = new TheoryDrawer({
        store: this.store,
        container: document.body,
        lang: this.currentLanguage
      });
    }

    // Suscripción al Store para reactividad
    if (this.store) {
      this.store.subscribe((state) => {
        this._updateProgressUI(state);
      });
    }

    this.render();
  }

  /**
   * Determina si las actividades pedagógicas requeridas para un módulo específico
   * han sido completadas satisfactoriamente.
   * @param {number} moduleIndex
   * @returns {{ completed: boolean, missingActivities: string[] }}
   */
  isModuleActivitiesCompleted(moduleIndex) {
    if (!this.store) {
      return { completed: false, missingActivities: [] };
    }

    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const state = this.store.getState();
    const challengesState = state.challengesState || {};
    const activitiesState = state.activitiesState || {};
    const missingActivities = [];

    switch (moduleIndex) {
      case 0: { // Módulo 0: Introducción
        const hasPathway = Boolean(activitiesState['mod-0-pathway']);
        const hasQuestions = Boolean(activitiesState['mod-0-questions']);
        if (!hasPathway && !hasQuestions) {
          missingActivities.push(t.missingMod0);
        }
        break;
      }

      case 1: { // Módulo 1: El Síndrome del Diccionario Copiado
        const challengePassed = Boolean(challengesState['mod-1']?.passed);
        if (!challengePassed) {
          missingActivities.push(t.missingMod1);
        }
        break;
      }

      case 2: { // Módulo 2: Ingeniería de Competencias
        const challengePassed = Boolean(challengesState['mod-2']?.passed);
        const builderPassed = Boolean(activitiesState['builder-mod-2']);
        if (!challengePassed) {
          missingActivities.push(t.missingMod2Challenge);
        }
        if (!builderPassed) {
          missingActivities.push(t.missingMod2Builder);
        }
        break;
      }

      case 3: { // Módulo 3: Taxonomía y Graduación de Comportamientos
        const challengePassed = Boolean(challengesState['mod-3']?.passed);
        const sortingPassed = Boolean(activitiesState['sorting-mod-3']);
        if (!challengePassed) {
          missingActivities.push(t.missingMod3Challenge);
        }
        if (!sortingPassed) {
          missingActivities.push(t.missingMod3Sorting);
        }
        break;
      }

      case 4: { // Módulo 4: Entrevistas por Incidentes Críticos
        const challengePassed = Boolean(challengesState['mod-4']?.passed);
        const chatPassed = Boolean(activitiesState['chat-mod-4']);
        if (!challengePassed) {
          missingActivities.push(t.missingMod4Challenge);
        }
        if (!chatPassed) {
          missingActivities.push(t.missingMod4Chat);
        }
        break;
      }

      case 5: { // Módulo 5: Capstone Studio
        const rubric = state.capstoneRubric || {};
        const allPassed = Boolean(rubric.c1 && rubric.c2 && rubric.c3 && rubric.c4);
        if (!allPassed) {
          missingActivities.push(t.missingMod5Rubric);
        }
        break;
      }

      default:
        break;
    }

    return {
      completed: missingActivities.length === 0,
      missingActivities
    };
  }

  /**
   * Verifica y marca como completado el módulo si todas sus actividades están listas
   * @param {number} moduleIndex
   * @returns {boolean}
   */
  _checkAndCompleteModule(moduleIndex) {
    if (!this.store) return false;
    const { completed } = this.isModuleActivitiesCompleted(moduleIndex);
    const state = this.store.getState();
    if (completed) {
      if (!state.completedModules.includes(moduleIndex)) {
        this.store.dispatchAction('COMPLETE_MODULE', moduleIndex);
      }
      return true;
    }
    return false;
  }

  /**
   * Verifica si un módulo está desbloqueado para navegación secuencial.
   * Regla pedagógica:
   * - Módulo 0 siempre está desbloqueado.
   * - Cualquier módulo posterior (N) requiere que el módulo previo (N - 1) haya sido completado.
   * @param {number} moduleIndex 
   * @returns {boolean}
   */
  isModuleUnlocked(moduleIndex) {
    if (moduleIndex <= 0) return true;
    const modules = this.modules;
    if (moduleIndex >= modules.length) return false;
    const state = this.store ? this.store.getState() : { completedModules: [] };
    const completed = state.completedModules || [];
    const prevMod = modules[moduleIndex - 1];
    return completed.includes(moduleIndex - 1) || (prevMod && completed.includes(prevMod.id));
  }

  /**
   * Obtiene el índice de módulo permitido más cercano según el progreso real
   * @param {number} targetIndex 
   * @returns {number}
   */
  _getHighestUnlockedModule(targetIndex) {
    if (targetIndex <= 0) return 0;
    const modules = this.modules;
    const clamped = Math.min(targetIndex, modules.length - 1);
    for (let i = clamped; i >= 0; i--) {
      if (this.isModuleUnlocked(i)) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Navega a un módulo específico
   * @param {number} moduleIndex 
   * @param {boolean} [force=false]
   */
  navigateTo(moduleIndex, force = false) {
    const modules = this.modules;
    if (moduleIndex < 0 || moduleIndex >= modules.length) return;
    if (!force && !this.isModuleUnlocked(moduleIndex) && this.container && typeof window !== 'undefined') {
      return;
    }
    this.currentModuleIndex = moduleIndex;

    if (this.store) {
      this.store.dispatchAction('NAVIGATE_MODULE', moduleIndex);
    }

    this.render();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Renderiza el shell principal y la página del módulo actual
   */
  render() {
    if (!this.container || typeof this.container !== 'object') return;

    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const isEn = this.currentLanguage === 'en';
    const allModules = this.modules;
    const mod = allModules[this.currentModuleIndex];
    const state = this.store ? this.store.getState() : { completedModules: [], theoryDrawersViewed: [] };
    const progressPercent = Math.round(((state.completedModules.length) / allModules.length) * 100);
    const modStatus = this.isModuleActivitiesCompleted(this.currentModuleIndex);

    const statusBannerHtml = modStatus.completed
      ? `
        <div class="rise-module-status-banner rise-module-status-banner--completed" id="module-status-banner">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="rise-module-status-badge rise-module-status-badge--completed">${escapeHtml(t.completedBadge)}</span>
            <span style="font-weight: 600;">${escapeHtml(t.completedText)}</span>
          </div>
        </div>
      `
      : `
        <div class="rise-module-status-banner rise-module-status-banner--pending" id="module-status-banner">
          <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
            <span class="rise-module-status-badge rise-module-status-badge--pending">${escapeHtml(t.pendingBadge)}</span>
            <span>${escapeHtml(t.pendingLead)}</span>
            ${modStatus.missingActivities.map(act => `<span class="rise-activity-tag">• ${escapeHtml(act)}</span>`).join('')}
          </div>
        </div>
      `;

    this.container.innerHTML = `
      <div class="rise-app-layout">
        <!-- Barra de Progreso Superior Mint -->
        <header class="rise-top-bar" role="banner">
          <div class="rise-brand">
            <span class="rise-brand-badge">${escapeHtml(t.brandBadge)}</span>
            <h1 class="rise-brand-title">${escapeHtml(t.brandTitle)}</h1>
          </div>
          <div class="rise-top-actions">
            <div class="rise-lang-toggle" role="group" aria-label="${isEn ? 'Language selection' : 'Selección de idioma'}">
              <button type="button" class="rise-lang-btn ${!isEn ? 'is-active' : ''}" data-lang="es" aria-pressed="${!isEn}">ES</button>
              <button type="button" class="rise-lang-btn ${isEn ? 'is-active' : ''}" data-lang="en" aria-pressed="${isEn}">EN</button>
            </div>
            <div class="rise-progress-widget">
              <div class="rise-progress-info">
                <span class="rise-progress-label">${escapeHtml(t.progressLabel)}</span>
                <span class="rise-progress-value" id="top-progress-text">${progressPercent}%</span>
              </div>
              <div class="rise-progress-track" role="progressbar" aria-label="${escapeHtml(t.progressLabel)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPercent}">
                <div class="rise-progress-fill" id="top-progress-bar" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>
        </header>

        <div class="rise-body-layout">
          <!-- Barra Lateral de Navegación Rise -->
          <nav class="rise-sidebar" aria-label="${escapeHtml(t.sidebarNavAria)}">
            <div class="rise-sidebar-header">
              <span class="rise-sidebar-title">${escapeHtml(t.sidebarTitle)}</span>
            </div>
            <ul class="rise-nav-list">
              ${allModules.map((m, idx) => {
                const isActive = idx === this.currentModuleIndex;
                const isCompleted = state.completedModules.includes(idx) || state.completedModules.includes(m.id);
                const isUnlocked = this.isModuleUnlocked(idx);
                return `
                  <li class="rise-nav-item">
                    <button
                      type="button"
                      class="rise-nav-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''} ${!isUnlocked ? 'is-locked' : ''}"
                      data-module-index="${idx}"
                      ${!isUnlocked ? 'disabled aria-disabled="true"' : 'aria-disabled="false"'}
                      ${isActive ? 'aria-current="step"' : ''}
                    >
                      <span class="rise-nav-status">${isCompleted ? '✓' : (isUnlocked ? (idx + 1) : '🔒')}</span>
                      <div class="rise-nav-text">
                        <span class="rise-nav-badge">${escapeHtml(m.badge)}</span>
                        <span class="rise-nav-label">${escapeHtml(m.title)}</span>
                      </div>
                    </button>
                  </li>
                `;
              }).join('')}
            </ul>

            <!-- Sección de Insignias Teóricas Opcionales -->
            <div class="rise-theory-badges-box" style="margin-top: 1.5rem; padding: 1rem; background: var(--mint-light, #F0FDFA); border-radius: 8px; border: 1px solid var(--border-subtle, #CCFBF1);">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--mint-dark, #0F766E); text-transform: uppercase;">${escapeHtml(t.theoryBadgesTitle)}</span>
              <div style="font-size: 0.82rem; margin-top: 0.35rem; color: var(--slate-700, #334155);">
                ${escapeHtml(t.theoryBadgesCount(state.theoryDrawersViewed.length, Object.keys(this.theoryData).length))}
              </div>
            </div>
          </nav>

          <!-- Área Principal de Contenido del Módulo (Landmark Semántico Canónico Único) -->
          <main class="rise-main-content" id="module-viewport">
            <article class="rise-module-card">
              <!-- Cabecera del Módulo -->
              <header class="rise-module-header">
                <div class="rise-module-meta">
                  <span class="rise-scenario-badge">${escapeHtml(mod.badge)}</span>
                  <span class="rise-module-duration">⏱ ${escapeHtml(mod.duration)}</span>
                </div>
                <h2 class="rise-module-title">${escapeHtml(mod.title)}</h2>
                <p class="rise-module-subtitle">${escapeHtml(mod.subtitle)}</p>

                ${mod.leadIntro ? `
                  <div class="rise-module-lead-intro">
                    <p>${escapeHtml(mod.leadIntro)}</p>
                  </div>
                ` : ''}

                <div class="rise-objective-callout">
                  <div class="rise-objective-badge">
                    <span aria-hidden="true">🎯</span> ${escapeHtml(t.objectiveBadge)}
                  </div>
                  <p>${escapeHtml(mod.objective)}</p>
                </div>

                <!-- Botón de Acceso a la Espina Teórica Opcional -->
                ${mod.theoryId ? `
                  <div style="margin-top: 1rem;">
                    <button type="button" class="rise-btn-theory-drawer" id="btn-open-theory" data-theory-id="${mod.theoryId}">
                      <span aria-hidden="true">📖</span> ${escapeHtml(t.theoryBtn)}
                    </button>
                  </div>
                ` : ''}
              </header>

              <!-- Contenedor de Bloques Interactivos del Módulo -->
              <div class="rise-module-interactive-area" id="interactive-area">
              </div>

              <!-- Banner de Estado de Actividades del Módulo -->
              ${statusBannerHtml}

              <!-- Pie de Navegación del Módulo -->
              <footer class="rise-module-footer" style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #E2E8F0; padding-top: 1.5rem;">
                <button
                  type="button"
                  class="rise-btn rise-btn-secondary"
                  id="btn-prev-mod"
                  ${this.currentModuleIndex === 0 ? 'disabled style="visibility: hidden;"' : ''}
                >
                  ${escapeHtml(t.prevBtn)}
                </button>
                <button
                  type="button"
                  class="rise-btn rise-btn-primary"
                  id="btn-next-mod"
                >
                  ${escapeHtml(this.currentModuleIndex === allModules.length - 1 ? t.finishBtn : t.nextBtn)}
                </button>
              </footer>
            </article>
          </main>
        </div>

        <!-- Botón Flotante Permanente de Fundamentos Metodológicos (Esquina Inferior Derecha) -->
        <button
          type="button"
          class="rise-floating-theory-btn"
          id="btn-floating-theory"
          aria-label="${escapeHtml(t.floatingTheoryAria)}"
          title="${escapeHtml(t.floatingTheoryBtn)}"
          data-theory-id="${mod.theoryId || `mod-${this.currentModuleIndex}-theory`}"
        >
          <span class="rise-floating-theory-icon" aria-hidden="true">📖</span>
        </button>
      </div>
    `;

    this._bindShellEvents();
    this._mountModuleInteractiveBlocks(mod);
  }

  /**
   * Vincula los escuchadores de eventos de la barra lateral y navegación general
   */
  _bindShellEvents() {
    if (typeof document === 'undefined' || !this.container || typeof this.container.querySelectorAll !== 'function') return;

    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;

    // Clics en la barra lateral
    const navButtons = this.container.querySelectorAll('.rise-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-module-index'), 10);
        if (!isNaN(idx)) {
          if (this.isModuleUnlocked(idx)) {
            this.navigateTo(idx);
          } else {
            alert(t.moduleLockedAlert);
          }
        }
      });
    });

    // Helper para abrir teoría con datos en el idioma activo
    const openTheoryModal = (theoryId) => {
      const activeTheory = (this.theoryData && this.theoryData[theoryId]) || THEORY_DATA[theoryId];
      if (this.theoryDrawer && activeTheory) {
        this.theoryDrawer.open(theoryId, activeTheory);
      }
    };

    // Botón de Espina Teórica Opcional en el header
    const theoryBtn = this.container.querySelector('#btn-open-theory');
    if (theoryBtn) {
      theoryBtn.addEventListener('click', () => {
        const theoryId = theoryBtn.getAttribute('data-theory-id');
        openTheoryModal(theoryId);
      });
    }

    // Botón Flotante Permanente de Fundamentos Metodológicos
    const floatingTheoryBtn = this.container.querySelector('#btn-floating-theory');
    if (floatingTheoryBtn) {
      floatingTheoryBtn.addEventListener('click', () => {
        const theoryId = floatingTheoryBtn.getAttribute('data-theory-id') || `mod-${this.currentModuleIndex}-theory`;
        openTheoryModal(theoryId);
      });
    }

    // Selector Toggle de Idioma (ES / EN)
    const langBtns = this.container.querySelectorAll('.rise-lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang) {
          this.setLanguage(targetLang);
        }
      });
    });

    // Botón anterior
    const prevBtn = this.container.querySelector('#btn-prev-mod');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigateTo(this.currentModuleIndex - 1);
      });
    }

    // Botón siguiente
    const nextBtn = this.container.querySelector('#btn-next-mod');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        // Valida si las actividades del módulo actual están completadas antes de marcarlo
        const isCurrentCompleted = this._checkAndCompleteModule(this.currentModuleIndex);

        if (this.currentModuleIndex < this.modules.length - 1) {
          const nextIndex = this.currentModuleIndex + 1;
          if (isCurrentCompleted || this.isModuleUnlocked(nextIndex)) {
            this.navigateTo(nextIndex);
          } else {
            const modStatus = this.isModuleActivitiesCompleted(this.currentModuleIndex);
            alert(t.pendingActivitiesAlert(modStatus.missingActivities));
          }
        } else {
          // Si es el módulo final, evalúa la certificación final
          this._handleCourseCompletion();
        }
      });
    }
  }

  /**
   * Monta los componentes interactivos específicos de cada módulo
   * @param {Object} mod 
   */
  _mountModuleInteractiveBlocks(mod) {
    if (typeof document === 'undefined' || !this.container || typeof this.container.querySelector !== 'function') return;
    const area = this.container.querySelector('#interactive-area');
    if (!area) return;

    // 0. Módulo 0: Introducción (3 preguntas clave & Pathway Selector)
    if (mod.id === 'mod-0' && mod.introData) {
      this._mountIntroBlock(area, mod.introData);
    }

    // 1. Si tiene reto ScenarioBlock (Módulos 1, 2, 3, 4)
    if (mod.challenge) {
      const scenarioContainer = document.createElement('div');
      scenarioContainer.className = 'rise-block-wrapper';
      area.appendChild(scenarioContainer);

      new ScenarioBlock({
        container: scenarioContainer,
        challengeData: mod.challenge,
        store: this.store,
        lang: this.currentLanguage,
        onResolved: () => {
          this._checkAndCompleteModule(this.currentModuleIndex);
          this._updateModuleStatusBanner();
        }
      }).render();
    }

    // Separador semántico / Puente pedagógico hacia el segundo ejercicio (Módulos 2, 3, 4)
    if (mod.exerciseTransition) {
      this._mountExerciseTransition(area, mod.exerciseTransition);
    }

    // 2. Módulo 2: Practice Text Builder (antes Módulo 1)
    if (mod.id === 'mod-2' && mod.practiceBuilder) {
      this._mountPracticeBuilder(area, mod.practiceBuilder);
    }

    // 3. Módulo 3: SortingBlock (antes Módulo 2)
    if (mod.id === 'mod-3' && mod.sortingActivity) {
      const sortingWrapper = document.createElement('div');
      sortingWrapper.className = 'rise-block-wrapper';
      sortingWrapper.style.marginTop = '1.25rem';

      const barsFigure = document.createElement('figure');
      barsFigure.className = 'rise-figure';
      barsFigure.style.marginBottom = '1.25rem';
      barsFigure.innerHTML = `
        <div class="rise-figure-media">
          <img src="assets/img/diagrams/escala-bars-jaques${this.currentLanguage === 'en' ? '-en' : ''}.svg" alt="${this.currentLanguage === 'en' ? 'BARS Taxonomic Scale' : 'Escala Taxonómica BARS A-B-C-D'}" class="rise-figure-img" loading="lazy">
        </div>
        <figcaption class="rise-figure-caption">
          <span class="rise-figure-caption-icon">📊</span> ${this.currentLanguage === 'en' ? 'BARS Scale: 4 objective tiers anchored in discretion, time-horizon, and impact' : 'Graduación BARS A-B-C-D basada en autonomía, horizonte temporal e impacto organizacional'}
        </figcaption>
      `;
      sortingWrapper.appendChild(barsFigure);
      area.appendChild(sortingWrapper);

      const sorting = new SortingBlock({ store: this.store, lang: this.currentLanguage });
      sorting.render(
        sortingWrapper,
        mod.sortingActivity.items,
        mod.sortingActivity.slots,
        () => {
          if (this.store) {
            this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'sorting-mod-3', passed: true });
          }
          this._checkAndCompleteModule(3);
          this._updateModuleStatusBanner();
        }
      );
    }

    // 4. Módulo 4: ChatSimulator (antes Módulo 3)
    if (mod.id === 'mod-4' && mod.chatSimulator) {
      const chatWrapper = document.createElement('div');
      chatWrapper.className = 'rise-block-wrapper';
      chatWrapper.style.marginTop = '1.25rem';

      const starFigure = document.createElement('figure');
      starFigure.className = 'rise-figure';
      starFigure.style.marginBottom = '1.25rem';
      starFigure.innerHTML = `
        <div class="rise-figure-media">
          <img src="assets/img/diagrams/flujo-star-sondeo${this.currentLanguage === 'en' ? '-en' : ''}.svg" alt="${this.currentLanguage === 'en' ? 'STAR Funnel and Probing Protocol' : 'El Embudo STAR y Protocolo de Sondeo'}" class="rise-figure-img" loading="lazy">
        </div>
        <figcaption class="rise-figure-caption">
          <span class="rise-figure-caption-icon">📊</span> ${this.currentLanguage === 'en' ? 'STAR Methodology: Situation, Task, Action, Result and probing questions' : 'Metodología STAR: Situación, Tarea, Acción, Resultado y técnica de sondeo conductual'}
        </figcaption>
      `;
      chatWrapper.appendChild(starFigure);
      area.appendChild(chatWrapper);

      const simulator = new ChatSimulator({ store: this.store, lang: this.currentLanguage });
      simulator.init(chatWrapper, mod.chatSimulator, () => {
        if (this.store) {
          this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'chat-mod-4', passed: true });
        }
        this._checkAndCompleteModule(4);
        this._updateModuleStatusBanner();
      });
    }

    // 5. Módulo 5: Capstone Studio & Rúbrica (antes Módulo 4)
    if (mod.id === 'mod-5') {
      this._mountCapstoneStudio(area, mod);
    }
  }

  /**
   * Monta el separador semántico y puente pedagógico hacia el segundo ejercicio práctico
   * (Módulos 2, 3 y 4)
   * @param {HTMLElement} container 
   * @param {Object} transitionData 
   */
  _mountExerciseTransition(container, transitionData) {
    if (!container || !transitionData) return;

    const transitionWrapper = document.createElement('section');
    transitionWrapper.className = 'rise-exercise-transition';
    transitionWrapper.setAttribute('aria-label', transitionData.title || (this.currentLanguage === 'en' ? 'Transition to Practical Activity' : 'Transición a Actividad Práctica'));

    const connectorText = this.currentLanguage === 'en' ? 'Methodological Transition' : 'Transición Metodológica';

    transitionWrapper.innerHTML = `
      <div class="rise-transition-divider" aria-hidden="true">
        <span class="rise-transition-connector">
          <span class="rise-transition-connector-icon">⚡</span> ${escapeHtml(connectorText)}
        </span>
      </div>

      <div class="rise-transition-card">
        <div class="rise-transition-header">
          <div class="rise-transition-badge-row">
            <span class="rise-transition-badge">
              <span class="rise-transition-dot" aria-hidden="true"></span>
              ${escapeHtml(transitionData.badge)}
            </span>
          </div>
          <h3 class="rise-transition-title">${escapeHtml(transitionData.title)}</h3>
        </div>

        <div class="rise-transition-body">
          ${transitionData.lead ? `
            <p class="rise-transition-lead">${escapeHtml(transitionData.lead)}</p>
          ` : ''}
          <p class="rise-transition-desc">${escapeHtml(transitionData.description)}</p>
          ${transitionData.focus ? `
            <div class="rise-transition-focus">
              <span class="rise-transition-focus-icon" aria-hidden="true">🎯</span>
              <span class="rise-transition-focus-text">${escapeHtml(transitionData.focus)}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.appendChild(transitionWrapper);
  }

  /**
   * Monta el taller de construcción de definiciones para Módulo 2
   */
  _mountPracticeBuilder(container, builderData) {
    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const builderBox = document.createElement('div');
    builderBox.className = 'rise-builder-card';
    builderBox.style.marginTop = '1.25rem';
    builderBox.style.padding = '1.5rem';
    builderBox.style.background = '#FFFFFF';
    builderBox.style.border = '1px solid #E2E8F0';
    builderBox.style.borderRadius = '8px';

    builderBox.innerHTML = `
      <h3 style="color: var(--slate-900); font-size: 1.15rem; margin-bottom: 0.5rem;">${escapeHtml(builderData.title)}</h3>
      <p style="color: var(--slate-700); font-size: 0.92rem; margin-bottom: 1.25rem;">${escapeHtml(builderData.instructions)}</p>

      <figure class="rise-figure" style="margin: 0 0 1.25rem;">
        <div class="rise-figure-media">
          <img src="assets/img/diagrams/formula-alles-blocks${this.currentLanguage === 'en' ? '-en' : ''}.svg" alt="${this.currentLanguage === 'en' ? 'Alles 4-Part Formula' : 'Fórmula Martha Alles de 4 Componentes'}" class="rise-figure-img" loading="lazy">
        </div>
        <figcaption class="rise-figure-caption">
          <span class="rise-figure-caption-icon">📐</span> ${this.currentLanguage === 'en' ? 'Alles Syntactic Formula: Infinitive Verb + Direct Object + Operating Context + Strategic Purpose' : 'Arquitectura Sintáctica Alles: Verbo Infinitivo + Objeto Directo + Contexto Operativo + Propósito Estratégico'}
        </figcaption>
      </figure>

      <div class="rise-builder-sections" style="display: flex; flex-direction: column; gap: 1rem;">
        ${builderData.sections.map(sec => `
          <div class="rise-builder-section" style="padding: 0.75rem 1rem; background: var(--mint-light); border-radius: 6px;">
            <label style="font-weight: 600; font-size: 0.85rem; color: var(--mint-dark);">${escapeHtml(sec.name)}</label>
            <select class="rise-builder-select" data-section-id="${sec.id}" style="width: 100%; margin-top: 0.35rem; padding: 0.5rem; border: 1px solid #CBD5E1; border-radius: 4px; font-size: 0.9rem;">
              <option value="">${escapeHtml(t.builderSelectDefault)}</option>
              ${sec.options.map(opt => `
                <option value="${opt.id}" data-correct="${opt.isCorrect ? '1' : '0'}">${escapeHtml(opt.text)}</option>
              `).join('')}
            </select>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1.25rem; display: flex; gap: 1rem; align-items: center;">
        <button type="button" class="rise-btn rise-btn-primary" id="btn-validate-builder">${escapeHtml(t.builderValidateBtn)}</button>
        <span id="builder-feedback" style="font-size: 0.9rem; font-weight: 500;"></span>
      </div>
    `;

    container.appendChild(builderBox);

    const validateBtn = builderBox.querySelector('#btn-validate-builder');
    const feedbackEl = builderBox.querySelector('#builder-feedback');

    validateBtn.addEventListener('click', () => {
      const selects = builderBox.querySelectorAll('.rise-builder-select');
      let allSelected = true;
      let allCorrect = true;

      selects.forEach(sel => {
        if (!sel.value) allSelected = false;
        const opt = sel.selectedOptions[0];
        if (!opt || opt.getAttribute('data-correct') !== '1') {
          allCorrect = false;
        }
      });

      if (!allSelected) {
        feedbackEl.style.color = '#B91C1C';
        feedbackEl.textContent = t.builderSelectAllWarning;
        return;
      }

      if (allCorrect) {
        feedbackEl.style.color = '#047857';
        feedbackEl.innerHTML = `<strong>${escapeHtml(t.builderSuccessPrefix)}</strong> ${escapeHtml(t.builderSuccessMsg)} <em>"${escapeHtml(builderData.goldenDefinition)}"</em>`;
        if (this.store) {
          this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'builder-mod-2', passed: true });
        }
        this._checkAndCompleteModule(2);
        this._updateModuleStatusBanner();
      } else {
        feedbackEl.style.color = '#B91C1C';
        feedbackEl.textContent = t.builderFailureMsg;
      }
    });
  }

  /**
   * Monta el bloque interactivo de Introducción (Módulo 0)
   * Responde a las 3 preguntas clave:
   * 1. ¿Por qué estás aquí? (Propósito del curso)
   * 2. ¿Qué lograrás al terminar? (Compendio de objetivos de desempeño M1-M5)
   * 3. ¿Cómo funciona el curso? (Dinámica dual-track práctica vs teoría)
   * Y permite elegir comenzar por la práctica o por la teoría.
   */
  _mountIntroBlock(container, introData) {
    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const introWrapper = document.createElement('div');
    introWrapper.className = 'rise-intro-container';
    introWrapper.style.display = 'flex';
    introWrapper.style.flexDirection = 'column';
    introWrapper.style.gap = '1.75rem';

    const keysCount = introData.questions ? introData.questions.length : 3;
    const keysTitle = typeof t.introKeysTitle === 'function' ? t.introKeysTitle(keysCount) : t.introKeysTitle;

    introWrapper.innerHTML = `
      <!-- Cabecera de Preguntas Clave -->
      <div class="rise-intro-header-card" style="background: linear-gradient(135deg, #0F766E 0%, #115E59 100%); color: #FFFFFF; padding: 1.75rem 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(15, 118, 110, 0.2);">
        <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 20px;">
          ${escapeHtml(t.contractBadge)}
        </span>
        <h3 style="font-size: 1.5rem; margin: 0.75rem 0 0.5rem; color: #FFFFFF; font-weight: 700;">
          ${escapeHtml(keysTitle)}
        </h3>
        <p style="margin: 0; font-size: 0.95rem; opacity: 0.95; line-height: 1.5;">
          ${escapeHtml(t.introKeysDesc)}
        </p>
      </div>

      <!-- Acordeón / Tarjetas Interactivas de las 3 Preguntas -->
      <div class="rise-inquiry-cards" style="display: flex; flex-direction: column; gap: 1rem;">
        ${introData.questions.map((q, idx) => `
          <div class="rise-inquiry-card ${idx === 0 ? 'is-open' : ''}" data-inquiry-index="${idx}" style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; overflow: hidden; transition: all 0.2s ease;">
            <button
              type="button"
              class="rise-inquiry-trigger"
              id="inquiry-trigger-${idx}"
              data-toggle-index="${idx}"
              aria-expanded="${idx === 0 ? 'true' : 'false'}"
              aria-controls="inquiry-body-${idx}"
              style="width: 100%; text-align: left; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer;"
            >
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--mint-light, #F0FDFA); color: var(--mint-dark, #0F766E); font-weight: 700; font-size: 1rem; border: 1px solid var(--border-subtle, #CCFBF1);">
                  ${q.number}
                </span>
                <div>
                  <span style="display: block; font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: var(--mint-dark, #0F766E); letter-spacing: 0.05em;">${escapeHtml(q.title)}</span>
                  <strong style="font-size: 1.15rem; color: var(--slate-900, #0F172A);">${escapeHtml(q.question)}</strong>
                </div>
              </div>
              <span class="rise-inquiry-chevron" style="font-size: 1.2rem; color: #475569; transition: transform 0.2s ease;">${idx === 0 ? '▲' : '▼'}</span>
            </button>
            <div
              class="rise-inquiry-body"
              id="inquiry-body-${idx}"
              role="region"
              aria-labelledby="inquiry-trigger-${idx}"
              style="padding: 0 1.5rem 1.5rem; display: ${idx === 0 ? 'block' : 'none'}; border-top: 1px solid #F1F5F9; color: var(--slate-700, #334155); font-size: 0.93rem; line-height: 1.6;"
            >
              ${q.details}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Selector de Ruta: Práctica vs. Teoría (Tú Decides) -->
      <div class="rise-pathway-card" style="background: #F8FAFC; border: 2px solid var(--mint-dark, #0F766E); border-radius: 12px; padding: 1.75rem; text-align: center;">
        <h4 style="color: var(--slate-900, #0F172A); font-size: 1.25rem; margin: 0 0 0.5rem;">
          ${escapeHtml(introData.pathways.title)}
        </h4>
        <p style="color: var(--slate-700, #334155); font-size: 0.95rem; margin: 0 auto 1.5rem; max-width: 600px;">
          ${escapeHtml(t.pathwaysLead)}
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; text-align: left;">
          <!-- Opción 1: Práctica -->
          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="font-size: 1.5rem;">🚀</span>
              <h5 style="color: var(--mint-dark, #0F766E); font-size: 1.05rem; margin: 0.5rem 0 0.35rem;">
                ${escapeHtml(introData.pathways.practiceChoice.title)}
              </h5>
              <p style="font-size: 0.88rem; color: var(--slate-700, #334155); margin: 0 0 1rem;">
                ${escapeHtml(introData.pathways.practiceChoice.description)}
              </p>
            </div>
            <button type="button" class="rise-btn rise-btn-primary" id="btn-start-practice" style="width: 100%;">
              ${escapeHtml(t.btnStartPractice)}
            </button>
          </div>

          <!-- Opción 2: Teoría -->
          <div style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <span style="font-size: 1.5rem;">📖</span>
              <h5 style="color: var(--slate-900, #0F172A); font-size: 1.05rem; margin: 0.5rem 0 0.35rem;">
                ${escapeHtml(introData.pathways.theoryChoice.title)}
              </h5>
              <p style="font-size: 0.88rem; color: var(--slate-700, #334155); margin: 0 0 1rem;">
                ${escapeHtml(introData.pathways.theoryChoice.description)}
              </p>
            </div>
            <button type="button" class="rise-btn rise-btn-secondary" id="btn-start-theory" style="width: 100%;">
              ${escapeHtml(t.btnStartTheory)}
            </button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(introWrapper);

    // Eventos de toggle en acordeón exclusivo de preguntas (un solo elemento abierto a la vez)
    const openedInquiries = new Set(['0']);
    const allCards = introWrapper.querySelectorAll('.rise-inquiry-card');
    const triggers = introWrapper.querySelectorAll('.rise-inquiry-trigger');

    triggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetIdx = btn.getAttribute('data-toggle-index');
        if (targetIdx !== null) {
          openedInquiries.add(targetIdx);
        }

        const targetCard = introWrapper.querySelector(`.rise-inquiry-card[data-inquiry-index="${targetIdx}"]`);
        const targetBody = introWrapper.querySelector(`#inquiry-body-${targetIdx}`);
        const isTargetOpen = targetBody && targetBody.style.display !== 'none';

        // Cierra todos los paneles del acordeón para evitar scroll excesivo
        allCards.forEach(card => {
          card.classList.remove('is-open');
          const cardBody = card.querySelector('.rise-inquiry-body');
          const cardChevron = card.querySelector('.rise-inquiry-chevron');
          if (cardBody) cardBody.style.display = 'none';
          if (cardChevron) cardChevron.textContent = '▼';
        });
        triggers.forEach(tr => tr.setAttribute('aria-expanded', 'false'));

        // Si el elemento clickeado estaba cerrado, lo abre en exclusiva
        if (!isTargetOpen && targetBody) {
          targetBody.style.display = 'block';
          if (targetCard) targetCard.classList.add('is-open');
          const targetChevron = btn.querySelector('.rise-inquiry-chevron');
          if (targetChevron) targetChevron.textContent = '▲';
          btn.setAttribute('aria-expanded', 'true');
        }

        if (openedInquiries.size >= 3) {
          if (this.store) {
            this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'mod-0-questions', passed: true });
          }
          this._checkAndCompleteModule(0);
          this._updateModuleStatusBanner();
        }
      });
    });

    // Acción: Iniciar por la práctica
    const btnStartPractice = introWrapper.querySelector('#btn-start-practice');
    if (btnStartPractice) {
      btnStartPractice.addEventListener('click', () => {
        if (this.store) {
          this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'mod-0-pathway', passed: true });
          this.store.dispatchAction('COMPLETE_MODULE', 0);
        }
        this.navigateTo(1);
      });
    }

    // Acción: Iniciar por la teoría
    const btnStartTheory = introWrapper.querySelector('#btn-start-theory');
    if (btnStartTheory) {
      btnStartTheory.addEventListener('click', () => {
        if (this.store) {
          this.store.dispatchAction('RECORD_ACTIVITY_COMPLETION', { activityKey: 'mod-0-pathway', passed: true });
          this.store.dispatchAction('COMPLETE_MODULE', 0);
        }
        const theoryId = introData.pathways.theoryChoice.theoryId;
        const theoryItem = this.theoryData[theoryId];
        if (this.theoryDrawer && theoryItem) {
          this.theoryDrawer.open(theoryId, theoryItem);
        }
        this._updateModuleStatusBanner();
      });
    }
  }

  /**
   * Monta el Capstone Studio y la Rúbrica Binaria en Módulo 5
   */
  _mountCapstoneStudio(container, mod) {
    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const studioBox = document.createElement('div');
    studioBox.className = 'rise-capstone-studio';
    studioBox.style.marginTop = '1.5rem';

    const bp = mod.submissionBlueprint;
    const isEn = this.currentLanguage === 'en';
    const lvlPrefix = isEn ? 'Level ' : 'Nivel ';

    studioBox.innerHTML = `
      <div class="rise-card" style="padding: 1.5rem; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; margin-bottom: 1.5rem;">
        <h3 style="color: var(--slate-900); font-size: 1.25rem;">${escapeHtml(t.caseIntegrator)} ${escapeHtml(mod.capstoneCase.company)}</h3>
        <p style="color: var(--slate-700); font-size: 0.95rem; margin-top: 0.5rem;">${mod.capstoneCase.businessContext}</p>
        <div style="margin-top: 0.75rem; padding: 0.5rem 1rem; background: var(--mint-light); border-left: 4px solid var(--mint-dark); font-weight: 600; font-size: 0.88rem;">
          ${escapeHtml(mod.capstoneCase.type)}: ${escapeHtml(mod.capstoneCase.competencyName)}
        </div>
      </div>

      <!-- Blueprint Visual de la Ficha Técnica -->
      <figure class="rise-figure" style="margin: 0 0 1.5rem;">
        <div class="rise-figure-media">
          <img src="assets/img/diagrams/ficha-tecnica-blueprint${isEn ? '-en' : ''}.svg" alt="${isEn ? 'Corporate Specification Blueprint' : 'Blueprint de la Ficha Técnica de Competencia'}" class="rise-figure-img" loading="lazy">
        </div>
        <figcaption class="rise-figure-caption">
          <span class="rise-figure-caption-icon">📐</span> ${isEn ? 'Corporate Technical Specification Blueprint: Structure and components for audit' : 'Blueprint de la Ficha Técnica Corporativa: Estructura y componentes a calibrar'}
        </figcaption>
      </figure>

      <!-- Ficha Técnica Generada para Auditoría -->
      <div class="rise-card" style="padding: 1.5rem; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 1.5rem;">
        <!-- Barra de herramientas superior -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1rem;">
          <div>
            <h4 style="color: var(--slate-900); margin: 0; font-size: 1.15rem;">${escapeHtml(t.fichaTitle)}</h4>
            <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--slate-600);">
              ${escapeHtml(t.fichaSubtitle)}
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="rise-btn rise-btn-secondary" id="btn-toggle-example" aria-expanded="false" aria-controls="capstone-example-panel" style="font-size: 0.85rem; padding: 0.45rem 0.85rem;">
              ${escapeHtml(t.btnViewExample)}
            </button>
            <button type="button" class="rise-btn rise-btn-secondary" id="btn-clear-fields" style="font-size: 0.85rem; padding: 0.45rem 0.85rem;" title="${escapeHtml(t.btnClearFields)}">
              ${escapeHtml(t.btnClearFields)}
            </button>
            <button type="button" class="rise-btn rise-btn-secondary" id="btn-export-direct-docx" style="font-size: 0.85rem; padding: 0.45rem 0.85rem;" title="${escapeHtml(t.btnExportWord)}">
              ${escapeHtml(t.btnExportWord)}
            </button>
          </div>
        </div>

        <!-- Panel Desplegable de Ejemplo Metodológico (Oculto por defecto) -->
        <div id="capstone-example-panel" role="region" aria-labelledby="btn-toggle-example" style="display: none; background: #F0FDFA; border: 1.5px solid #0F766E; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border-bottom: 1px solid #CCFBF1; padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: #0F766E; color: #FFFFFF; padding: 0.2rem 0.6rem; border-radius: 4px;">
                ${escapeHtml(t.refModelBadge)}
              </span>
              <h5 style="margin: 0.5rem 0 0.2rem; font-size: 1.05rem; color: #0F172A;">
                ${escapeHtml(t.calibratedExample)} ${escapeHtml(mod.capstoneCase.competencyName)}
              </h5>
              <p style="margin: 0; font-size: 0.85rem; color: #334155;">
                ${escapeHtml(t.modelInstruction)}
              </p>
            </div>
            <button type="button" class="rise-btn rise-btn-primary" id="btn-load-example-data" style="font-size: 0.82rem; padding: 0.45rem 0.85rem; white-space: nowrap;">
              ${escapeHtml(t.btnLoadExample)}
            </button>
          </div>

          <div style="font-size: 0.88rem; color: #1E293B; display: flex; flex-direction: column; gap: 0.75rem;">
            <div>
              <strong style="color: #0F766E;">${escapeHtml(t.secDefTitle)}</strong>
              <p style="margin: 0.25rem 0 0; background: #FFFFFF; padding: 0.6rem 0.85rem; border-radius: 4px; border: 1px solid #E2E8F0; line-height: 1.5;">
                ${escapeHtml(bp.definition)}
              </p>
            </div>
            <div>
              <strong style="color: #0F766E;">${escapeHtml(t.secBarsTitle)}</strong>
              <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.25rem;">
                <div style="background: #FFFFFF; padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid #E2E8F0;"><span class="rise-level-badge rise-level-badge--a">${lvlPrefix}A:</span> ${escapeHtml(bp.levels.A)}</div>
                <div style="background: #FFFFFF; padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid #E2E8F0;"><span class="rise-level-badge rise-level-badge--b">${lvlPrefix}B:</span> ${escapeHtml(bp.levels.B)}</div>
                <div style="background: #FFFFFF; padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid #E2E8F0;"><span class="rise-level-badge rise-level-badge--c">${lvlPrefix}C:</span> ${escapeHtml(bp.levels.C)}</div>
                <div style="background: #FFFFFF; padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid #E2E8F0;"><span class="rise-level-badge rise-level-badge--d">${lvlPrefix}D:</span> ${escapeHtml(bp.levels.D)}</div>
              </div>
            </div>
            <div>
              <strong style="color: #0F766E;">${escapeHtml(t.secBbiTitle)}</strong>
              <ol style="margin: 0.25rem 0 0; padding-left: 1.25rem; line-height: 1.5;">
                ${bp.bbiQuestions.map(q => `<li style="margin-bottom: 0.3rem;">${escapeHtml(q)}</li>`).join('')}
              </ol>
            </div>
          </div>
        </div>

        <!-- Campos del Formulario (Vacíos por defecto) -->
        <div style="margin-bottom: 1rem;">
          <label for="capstone-def" style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--slate-700);">${escapeHtml(t.secDefLabel)}</label>
          <textarea id="capstone-def" class="rise-input" placeholder="${escapeHtml(t.secDefPlaceholder)}" style="width: 100%; height: 75px; padding: 0.5rem; margin-top: 0.25rem; font-size: 0.9rem; border: 1px solid #CBD5E1; border-radius: 4px;"></textarea>
        </div>

        <div style="margin-bottom: 1rem;">
          <span id="label-capstone-levels" style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--slate-700);">${escapeHtml(t.secBarsLabel)}</span>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem;" role="group" aria-labelledby="label-capstone-levels">
            <div><label for="capstone-level-a" class="rise-level-badge rise-level-badge--a" style="cursor: pointer; display: inline-block; width: 80px;">${lvlPrefix}A:</label> <input type="text" id="capstone-level-a" aria-label="${lvlPrefix}A" placeholder="${escapeHtml(t.placeholderLvlA)}" style="width: calc(100% - 90px); padding: 0.4rem; font-size: 0.85rem;" value=""></div>
            <div><label for="capstone-level-b" class="rise-level-badge rise-level-badge--b" style="cursor: pointer; display: inline-block; width: 80px;">${lvlPrefix}B:</label> <input type="text" id="capstone-level-b" aria-label="${lvlPrefix}B" placeholder="${escapeHtml(t.placeholderLvlB)}" style="width: calc(100% - 90px); padding: 0.4rem; font-size: 0.85rem;" value=""></div>
            <div><label for="capstone-level-c" class="rise-level-badge rise-level-badge--c" style="cursor: pointer; display: inline-block; width: 80px;">${lvlPrefix}C:</label> <input type="text" id="capstone-level-c" aria-label="${lvlPrefix}C" placeholder="${escapeHtml(t.placeholderLvlC)}" style="width: calc(100% - 90px); padding: 0.4rem; font-size: 0.85rem;" value=""></div>
            <div><label for="capstone-level-d" class="rise-level-badge rise-level-badge--d" style="cursor: pointer; display: inline-block; width: 80px;">${lvlPrefix}D:</label> <input type="text" id="capstone-level-d" aria-label="${lvlPrefix}D" placeholder="${escapeHtml(t.placeholderLvlD)}" style="width: calc(100% - 90px); padding: 0.4rem; font-size: 0.85rem;" value=""></div>
          </div>
        </div>

        <div>
          <span id="label-capstone-bbi" style="display: block; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--slate-700);">${escapeHtml(t.secBbiLabel)}</span>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.25rem;" role="group" aria-labelledby="label-capstone-bbi">
            <input type="text" id="capstone-bbi-0" class="capstone-bbi-input" aria-label="${isEn ? 'BBI Question 1' : 'Pregunta BBI 1'}" placeholder="${escapeHtml(t.placeholderBbi0)}" style="width: 100%; padding: 0.4rem; font-size: 0.85rem;" value="">
            <input type="text" id="capstone-bbi-1" class="capstone-bbi-input" aria-label="${isEn ? 'BBI Question 2' : 'Pregunta BBI 2'}" placeholder="${escapeHtml(t.placeholderBbi1)}" style="width: 100%; padding: 0.4rem; font-size: 0.85rem;" value="">
            <input type="text" id="capstone-bbi-2" class="capstone-bbi-input" aria-label="${isEn ? 'BBI Question 3' : 'Pregunta BBI 3'}" placeholder="${escapeHtml(t.placeholderBbi2)}" style="width: 100%; padding: 0.4rem; font-size: 0.85rem;" value="">
          </div>
        </div>

        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="rise-btn rise-btn-primary" id="btn-audit-capstone">
            ${escapeHtml(t.btnAuditCapstone)}
          </button>
        </div>
      </div>

      <!-- Resultados de la Rúbrica y Certificación -->
      <div id="capstone-rubric-results" style="display: none; padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;"></div>
    `;

    container.appendChild(studioBox);

    // Referencias a elementos interactivos
    const auditBtn = studioBox.querySelector('#btn-audit-capstone');
    const resultsContainer = studioBox.querySelector('#capstone-rubric-results');
    const btnToggleExample = studioBox.querySelector('#btn-toggle-example');
    const examplePanel = studioBox.querySelector('#capstone-example-panel');
    const btnLoadExample = studioBox.querySelector('#btn-load-example-data');
    const btnClearFields = studioBox.querySelector('#btn-clear-fields');
    const btnExportDirectDocx = studioBox.querySelector('#btn-export-direct-docx');

    const defInput = studioBox.querySelector('#capstone-def');
    const lvlAInput = studioBox.querySelector('#capstone-level-a');
    const lvlBInput = studioBox.querySelector('#capstone-level-b');
    const lvlCInput = studioBox.querySelector('#capstone-level-c');
    const lvlDInput = studioBox.querySelector('#capstone-level-d');
    const bbiInputs = studioBox.querySelectorAll('.capstone-bbi-input');

    // Toggle para ver / ocultar el ejemplo de referencia
    if (btnToggleExample && examplePanel) {
      btnToggleExample.addEventListener('click', () => {
        const isHidden = examplePanel.style.display === 'none';
        examplePanel.style.display = isHidden ? 'block' : 'none';
        btnToggleExample.setAttribute('aria-expanded', String(isHidden));
        btnToggleExample.textContent = isHidden ? t.btnHideExample : t.btnViewExample;
      });
    }

    // Cargar datos del ejemplo en el formulario
    if (btnLoadExample) {
      btnLoadExample.addEventListener('click', () => {
        defInput.value = bp.definition;
        lvlAInput.value = bp.levels.A;
        lvlBInput.value = bp.levels.B;
        lvlCInput.value = bp.levels.C;
        lvlDInput.value = bp.levels.D;
        bbiInputs.forEach((input, idx) => {
          if (bp.bbiQuestions[idx]) {
            input.value = bp.bbiQuestions[idx];
          }
        });
      });
    }

    // Limpiar todos los campos del formulario
    if (btnClearFields) {
      btnClearFields.addEventListener('click', () => {
        if (confirm(t.clearFieldsConfirm)) {
          defInput.value = '';
          lvlAInput.value = '';
          lvlBInput.value = '';
          lvlCInput.value = '';
          lvlDInput.value = '';
          bbiInputs.forEach(i => { i.value = ''; });
        }
      });
    }

    // Helper para capturar el estado actual de la ficha
    const getCurrentFichaData = () => ({
      competencyName: mod.capstoneCase.competencyName,
      company: mod.capstoneCase.company,
      type: mod.capstoneCase.type,
      definition: defInput.value.trim(),
      levels: {
        A: lvlAInput.value.trim(),
        B: lvlBInput.value.trim(),
        C: lvlCInput.value.trim(),
        D: lvlDInput.value.trim()
      },
      bbiQuestions: Array.from(bbiInputs).map(i => i.value.trim()).filter(Boolean)
    });

    // Botón de exportación directa a Word (.docx)
    if (btnExportDirectDocx) {
      btnExportDirectDocx.addEventListener('click', () => {
        const ficha = getCurrentFichaData();
        DocxExporter.downloadDocx('ficha_tecnica_gestion_cambio.docx', ficha);
      });
    }

    // Ejecución de la auditoría con rúbrica binaria
    auditBtn.addEventListener('click', () => {
      const ficha = getCurrentFichaData();

      if (this.rubricEvaluator && typeof this.rubricEvaluator.setLanguage === 'function') {
        this.rubricEvaluator.setLanguage(this.currentLanguage);
      }

      const evaluation = this.rubricEvaluator.evaluateSubmission({
        definition: ficha.definition,
        levels: ficha.levels,
        bbiQuestions: ficha.bbiQuestions
      });

      resultsContainer.style.display = 'block';
      resultsContainer.className = evaluation.passed ? 'rise-rubric-passed' : 'rise-rubric-failed';
      resultsContainer.style.background = evaluation.passed ? '#ECFDF5' : '#FEF2F2';
      resultsContainer.style.border = `2px solid ${evaluation.passed ? '#047857' : '#B91C1C'}`;

      resultsContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h4 style="color: ${evaluation.passed ? '#047857' : '#B91C1C'}; margin: 0;">
            ${evaluation.passed ? escapeHtml(t.rubricPassedTitle) : escapeHtml(t.rubricFailedTitle)}
          </h4>
          <span style="font-weight: 700; font-size: 1.25rem; color: ${evaluation.passed ? '#047857' : '#B91C1C'};">
            ${evaluation.score} / 100 pts
          </span>
        </div>
        <p style="margin: 0.5rem 0 1rem; font-size: 0.92rem; color: var(--slate-700);">${escapeHtml(evaluation.feedback)}</p>

        <ul class="rise-rubric-checklist" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem;">
          ${evaluation.checklist.map(item => `
            <li style="padding: 0.6rem 0.85rem; background: #FFFFFF; border-radius: 4px; border-left: 4px solid ${item.passed ? '#047857' : '#B91C1C'}; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong>${escapeHtml(item.name)}:</strong>
                <span style="font-size: 0.85rem; color: #475569; display: block;">${escapeHtml(item.feedback)}</span>
              </div>
              <span style="font-weight: 700; color: ${item.passed ? '#047857' : '#B91C1C'};">${item.passed ? escapeHtml(t.statusApproved) : escapeHtml(t.statusObserved)}</span>
            </li>
          `).join('')}
        </ul>

        ${evaluation.passed ? `
          <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <button type="button" class="rise-btn rise-btn-primary" id="btn-export-docx">${escapeHtml(t.btnDownloadDocx)}</button>
            <button type="button" class="rise-btn rise-btn-secondary" id="btn-export-md">${escapeHtml(t.btnDownloadMd)}</button>
          </div>
        ` : ''}
      `;

      if (evaluation.passed) {
        if (this.store) {
          this.store.dispatchAction('COMPLETE_MODULE', 5);
        }
        this._updateModuleStatusBanner();

        const btnExportDocx = resultsContainer.querySelector('#btn-export-docx');
        const btnExportMd = resultsContainer.querySelector('#btn-export-md');

        if (btnExportDocx) {
          btnExportDocx.addEventListener('click', () => {
            DocxExporter.downloadDocx('ficha_tecnica_gestion_cambio.docx', ficha);
          });
        }
        if (btnExportMd) {
          btnExportMd.addEventListener('click', () => {
            DocxExporter.downloadMarkdown('ficha_tecnica_gestion_cambio.md', ficha);
          });
        }
      }
    });
  }

  /**
   * Genera el contenido Markdown de la Ficha Técnica
   */
  _generateMarkdownFicha(def, levels, questions) {
    const isEn = this.currentLanguage === 'en';
    return DocxExporter.generateMarkdown({
      competencyName: isEn ? 'Organizational Change Management' : 'Gestión del Cambio Organizacional',
      definition: def,
      levels,
      bbiQuestions: questions
    });
  }

  /**
   * Descarga un archivo en el navegador
   */
  _downloadFile(filename, content) {
    if (typeof document === 'undefined') return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Manejador de finalización del curso
   */
  _handleCourseCompletion() {
    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const state = this.store ? this.store.getState() : {};
    if (state.courseStatus === 'passed') {
      alert(t.coursePassedAlert);
    } else {
      alert(t.courseNotPassedAlert);
    }
  }

  /**
   * Actualiza el widget superior de progreso
   * @param {Object} state 
   */
  _updateProgressUI(state) {
    if (typeof document === 'undefined') return;
    const totalModules = (this.modules && this.modules.length) ? this.modules.length : MODULES_DATA.length;
    const progressPercent = Math.round(((state.completedModules.length) / totalModules) * 100);
    const textEl = document.querySelector('#top-progress-text');
    const barEl = document.querySelector('#top-progress-bar');
    const trackEl = barEl ? barEl.parentElement : null;
    if (textEl) textEl.textContent = `${progressPercent}%`;
    if (barEl) barEl.style.width = `${progressPercent}%`;
    if (trackEl) trackEl.setAttribute('aria-valuenow', String(progressPercent));
  }

  /**
   * Actualiza dinámicamente el banner de estado de actividades del módulo y los iconos de la barra lateral
   */
  _updateModuleStatusBanner() {
    if (typeof document === 'undefined' || !this.container) return;
    const t = UI_TRANSLATIONS[this.currentLanguage] || UI_TRANSLATIONS.es;
    const bannerEl = this.container.querySelector('#module-status-banner');
    const modStatus = this.isModuleActivitiesCompleted(this.currentModuleIndex);
    if (bannerEl) {
      if (modStatus.completed) {
        bannerEl.className = 'rise-module-status-banner rise-module-status-banner--completed';
        bannerEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="rise-module-status-badge rise-module-status-badge--completed">${escapeHtml(t.completedBadge)}</span>
            <span style="font-weight: 600;">${escapeHtml(t.completedText)}</span>
          </div>
        `;
      } else {
        bannerEl.className = 'rise-module-status-banner rise-module-status-banner--pending';
        bannerEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
            <span class="rise-module-status-badge rise-module-status-badge--pending">${escapeHtml(t.pendingBadge)}</span>
            <span>${escapeHtml(t.pendingLead)}</span>
            ${modStatus.missingActivities.map(act => `<span class="rise-activity-tag">• ${escapeHtml(act)}</span>`).join('')}
          </div>
        `;
      }
    }

    // Actualiza estados en la barra lateral
    const state = this.store ? this.store.getState() : { completedModules: [] };
    const navButtons = this.container.querySelectorAll('.rise-nav-btn');
    navButtons.forEach(btn => {
      const idx = parseInt(btn.getAttribute('data-module-index'), 10);
      if (!isNaN(idx)) {
        const isCompleted = state.completedModules.includes(idx);
        const isUnlocked = this.isModuleUnlocked(idx);
        btn.classList.toggle('is-completed', isCompleted);
        btn.classList.toggle('is-locked', !isUnlocked);
        btn.disabled = !isUnlocked;
        btn.setAttribute('aria-disabled', String(!isUnlocked));
        const statusEl = btn.querySelector('.rise-nav-status');
        if (statusEl) {
          statusEl.textContent = isCompleted ? '✓' : (isUnlocked ? (idx + 1) : '🔒');
        }
      }
    });
  }
}
