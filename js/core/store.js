/**
 * State Store Reactivo del Curso SCORM
 * Gestiona el estado inmutable, suscripciones reactivas y sincronización con ScormAdapter.
 * Separa estrictamente la Ruta Crítica de Acción de las Espinas Teóricas Opcionales.
 */

const DEFAULT_INITIAL_STATE = Object.freeze({
  currentModule: 0,
  completedModules: [],
  challengesState: {}, // [moduleId]: { passed: boolean, attempts: number, choices: Array<any> }
  activitiesState: {}, // [activityKey]: boolean (e.g. 'builder-mod-2', 'sorting-mod-3', 'chat-mod-4')
  theoryDrawersViewed: [], // Array de badgeId desbloqueados
  capstoneRubric: { c1: false, c2: false, c3: false, c4: false },
  finalScore: 0,
  courseStatus: 'incomplete' // 'passed' si capstone cumple 100% de rúbrica
});

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

export class CourseStore {
  /**
   * @param {Object} [scormAdapter] - Instancia de ScormAdapter
   * @param {Object} [initialState] - Estado inicial personalizado
   */
  constructor(scormAdapter = null, initialState = {}) {
    this.adapter = scormAdapter;
    this.listeners = new Set();
    this.state = {
      ...deepClone(DEFAULT_INITIAL_STATE),
      ...deepClone(initialState),
      challengesState: {
        ...(DEFAULT_INITIAL_STATE.challengesState),
        ...(initialState.challengesState || {})
      },
      activitiesState: {
        ...(DEFAULT_INITIAL_STATE.activitiesState),
        ...(initialState.activitiesState || {})
      },
      capstoneRubric: {
        ...(DEFAULT_INITIAL_STATE.capstoneRubric),
        ...(initialState.capstoneRubric || {})
      },
      completedModules: Array.isArray(initialState.completedModules)
        ? [...initialState.completedModules]
        : [],
      theoryDrawersViewed: Array.isArray(initialState.theoryDrawersViewed)
        ? [...initialState.theoryDrawersViewed]
        : []
    };

    if (this.adapter) {
      this._hydrateFromAdapter();
    }
  }

  /**
   * Intenta restaurar progreso previo almacenado en suspend_data o lesson_location
   */
  _hydrateFromAdapter() {
    if (!this.adapter) return;

    // 1. Restaurar ubicación con clamping estricto [0..5]
    const loc = this.adapter.getValue('cmi.core.lesson_location');
    if (loc && loc.startsWith('mod-')) {
      const modNum = parseInt(loc.replace('mod-', ''), 10);
      if (!isNaN(modNum)) {
        this.state.currentModule = Math.max(0, Math.min(5, modNum));
      }
    }

    // 2. Restaurar estado de suspend_data
    const suspendRaw = this.adapter.getValue('cmi.suspend_data');
    if (suspendRaw) {
      try {
        const parsed = JSON.parse(suspendRaw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (parsed.courseStoreState && typeof parsed.courseStoreState === 'object') {
            this.state = {
              ...this.state,
              ...parsed.courseStoreState,
              challengesState: {
                ...this.state.challengesState,
                ...(parsed.courseStoreState.challengesState || {})
              },
              activitiesState: {
                ...this.state.activitiesState,
                ...(parsed.courseStoreState.activitiesState || {})
              },
              capstoneRubric: {
                ...this.state.capstoneRubric,
                ...(parsed.courseStoreState.capstoneRubric || {})
              },
              completedModules: parsed.courseStoreState.completedModules || this.state.completedModules,
              theoryDrawersViewed: parsed.courseStoreState.theoryDrawersViewed || this.state.theoryDrawersViewed
            };
          } else if (Array.isArray(parsed.theoryExplored)) {
            // Si solo hay badges registrados por el adapter
            this.state.theoryDrawersViewed = parsed.theoryExplored.map(item => item.badgeId);
          }
        }
      } catch (e) {
        // En caso de parse error, conserva el estado base
      }
    }

    // 3. Restaurar status
    const status = this.adapter.getStatus();
    if (status === 'passed') {
      this.state.courseStatus = 'passed';
      this.state.finalScore = 100;
    } else if (status === 'completed') {
      this.state.courseStatus = 'completed';
    }

    // 4. Clamping canónico final de currentModule [0..5] y sincronización inmediata con LMS
    const cleanCurrentModule = Math.max(0, Math.min(5, Number.isInteger(this.state.currentModule) ? this.state.currentModule : 0));
    this.state.currentModule = cleanCurrentModule;
    this.adapter.setValue('cmi.core.lesson_location', `mod-${cleanCurrentModule}`);
  }

  /**
   * Retorna una copia inmutable del estado actual
   * @returns {Object}
   */
  getState() {
    return deepClone(this.state);
  }

  /**
   * Suscribe un listener a cambios en el estado
   * @param {Function} listener 
   * @returns {Function} Función para cancelar suscripción
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notifica a todos los suscriptores
   * @param {Object} action 
   */
  _notify(action) {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(currentState, action);
      } catch (e) {
        // Evita que el fallo de un listener interrumpa el flujo
      }
    }
  }

  /**
   * Persiste snapshot en el LMS Adapter
   */
  _syncToAdapter() {
    if (!this.adapter) return;

    // 0. Clamping estricto de tipos y rangos de las variables troncales
    const cleanCurrentModule = Math.max(0, Math.min(5, Number.isInteger(this.state.currentModule) ? this.state.currentModule : 0));
    const cleanFinalScore = Math.max(0, Math.min(100, Math.round(Number(this.state.finalScore) || 0)));
    const cleanCourseStatus = (['passed', 'failed', 'incomplete'].includes(this.state.courseStatus))
      ? this.state.courseStatus
      : 'incomplete';
    const cleanCompletedModules = Array.isArray(this.state.completedModules)
      ? [...new Set(this.state.completedModules.filter(n => Number.isInteger(n) && n >= 0 && n <= 5))].sort((a, b) => a - b)
      : [];

    // Actualiza ubicación en LMS asegurando módulo clamped
    this.adapter.setValue('cmi.core.lesson_location', `mod-${cleanCurrentModule}`);

    // Preserva estado extendido en suspend_data garantizando objeto plano
    let currentSuspend = {};
    const raw = this.adapter.getValue('cmi.suspend_data');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          currentSuspend = parsed;
        }
      } catch (e) {
        currentSuspend = {};
      }
    }

    // 1. Sanitizar y acotar challengesState
    const sanitizedChallenges = {};
    for (const [k, v] of Object.entries(this.state.challengesState || {})) {
      const cleanKey = String(k).slice(0, 15);
      sanitizedChallenges[cleanKey] = {
        passed: Boolean(v?.passed),
        attempts: Math.max(0, Math.min(999, Math.round(Number(v?.attempts) || 0))),
        choices: Array.isArray(v?.choices)
          ? v.choices.slice(-5).map(c => String(c).slice(0, 30))
          : []
      };
    }

    // 2. Sanitizar activitiesState (solo banderas booleanas activas, claves acotadas)
    const sanitizedActivities = {};
    for (const [k, v] of Object.entries(this.state.activitiesState || {})) {
      if (v) {
        sanitizedActivities[String(k).slice(0, 30)] = true;
      }
    }

    // 3. Sanitizar badges y colecciones
    const sanitizedTheory = Array.isArray(this.state.theoryDrawersViewed)
      ? this.state.theoryDrawersViewed.slice(0, 6).map(b => String(b).slice(0, 30))
      : [];

    currentSuspend.courseStoreState = {
      currentModule: cleanCurrentModule,
      completedModules: cleanCompletedModules,
      challengesState: sanitizedChallenges,
      activitiesState: sanitizedActivities,
      theoryDrawersViewed: sanitizedTheory,
      capstoneRubric: {
        c1: Boolean(this.state.capstoneRubric?.c1),
        c2: Boolean(this.state.capstoneRubric?.c2),
        c3: Boolean(this.state.capstoneRubric?.c3),
        c4: Boolean(this.state.capstoneRubric?.c4)
      },
      finalScore: cleanFinalScore,
      courseStatus: cleanCourseStatus
    };

    let serialized = JSON.stringify(currentSuspend);

    // Poda progresiva si se aproxima al límite SPM SCORM 1.2 (4096)
    if (serialized.length > 3800) {
      // Nivel 1: eliminar choices de retos
      for (const k of Object.keys(sanitizedChallenges)) {
        sanitizedChallenges[k] = {
          passed: sanitizedChallenges[k].passed,
          attempts: sanitizedChallenges[k].attempts
        };
      }
      currentSuspend.courseStoreState.challengesState = sanitizedChallenges;
      serialized = JSON.stringify(currentSuspend);
    }

    if (serialized.length > 3800) {
      // Nivel 2: aislar courseStoreState descartando suspend_data externo no esencial
      currentSuspend = { courseStoreState: currentSuspend.courseStoreState };
      serialized = JSON.stringify(currentSuspend);
    }

    if (serialized.length > 4000) {
      // Nivel 3: Fallback determinístico ultra-compacto (< 160 caracteres, JSON siempre 100% válido garantizado)
      currentSuspend = {
        courseStoreState: {
          currentModule: cleanCurrentModule,
          completedModules: cleanCompletedModules,
          finalScore: cleanFinalScore,
          courseStatus: cleanCourseStatus,
          capstoneRubric: {
            c1: Boolean(this.state.capstoneRubric?.c1),
            c2: Boolean(this.state.capstoneRubric?.c2),
            c3: Boolean(this.state.capstoneRubric?.c3),
            c4: Boolean(this.state.capstoneRubric?.c4)
          }
        }
      };
      serialized = JSON.stringify(currentSuspend);
    }

    this.adapter.setValue('cmi.suspend_data', serialized);
    this.adapter.commit();
  }

  /**
   * Despacha una mutación de estado determinística
   * @param {string} type 
   * @param {any} [payload={}] 
   * @returns {Object} Nuevo estado inmutable
   */
  dispatchAction(type, payload = {}) {
    const prevState = deepClone(this.state);
    let hasChanged = false;

    switch (type) {
      case 'NAVIGATE_MODULE': {
        const rawModId = typeof payload === 'number' ? payload : (payload?.moduleId ?? payload?.moduleIndex ?? this.state.currentModule);
        const parsed = typeof rawModId === 'number' ? rawModId : parseInt(rawModId, 10);
        const modId = Math.max(0, Math.min(5, !isNaN(parsed) ? parsed : 0));
        if (this.state.currentModule !== modId) {
          this.state.currentModule = modId;
          hasChanged = true;
          if (this.adapter) {
            this.adapter.setValue('cmi.core.lesson_location', `mod-${modId}`);
          }
        }
        break;
      }

      case 'RECORD_CHALLENGE_ATTEMPT': {
        const { moduleId, choiceId, passed } = payload;
        if (moduleId) {
          const prevChallenge = this.state.challengesState[moduleId] || {
            passed: false,
            attempts: 0,
            choices: []
          };

          const newAttempts = prevChallenge.attempts + 1;
          const prevChoices = Array.isArray(prevChallenge.choices) ? prevChallenge.choices : [];
          const newChoices = choiceId ? [...prevChoices, choiceId].slice(-5) : prevChoices.slice(-5);
          const newPassed = Boolean(prevChallenge.passed || passed);

          this.state.challengesState = {
            ...this.state.challengesState,
            [moduleId]: {
              passed: newPassed,
              attempts: newAttempts,
              choices: newChoices
            }
          };
          hasChanged = true;
        }
        break;
      }

      case 'COMPLETE_MODULE': {
        const modId = payload.moduleId ?? payload;
        if (modId !== undefined && !this.state.completedModules.includes(modId)) {
          this.state.completedModules = [...this.state.completedModules, modId];
          hasChanged = true;
        }
        break;
      }

      case 'RECORD_ACTIVITY_COMPLETION': {
        const key = typeof payload === 'string' ? payload : (payload.activityKey || payload.activityId);
        const passed = typeof payload === 'object' && payload.passed !== undefined ? payload.passed : true;
        if (key) {
          this.state.activitiesState = {
            ...this.state.activitiesState,
            [key]: Boolean(passed)
          };
          hasChanged = true;
        }
        break;
      }

      case 'VIEW_THEORY_DRAWER': {
        const badge = typeof payload === 'string' ? payload : (payload.badgeId || payload.drawerId);
        const modId = typeof payload === 'object' ? payload.moduleId : null;
        if (badge && !this.state.theoryDrawersViewed.includes(badge)) {
          this.state.theoryDrawersViewed = [...this.state.theoryDrawersViewed, badge];
          hasChanged = true;
          if (this.adapter && modId) {
            this.adapter.recordTheoreticalExploration(String(modId), badge);
          }
        }
        break;
      }

      case 'UPDATE_CAPSTONE_RUBRIC': {
        const updates = payload.rubric ? payload.rubric : { [payload.criterion]: payload.value };
        const updatedRubric = {
          ...this.state.capstoneRubric,
          ...updates
        };

        const totalCriteria = 4;
        const validCount = ['c1', 'c2', 'c3', 'c4'].filter(k => updatedRubric[k] === true).length;
        const allPassed = validCount === totalCriteria;
        const score = Math.round((validCount / totalCriteria) * 100);

        this.state.capstoneRubric = updatedRubric;
        this.state.finalScore = score;

        if (allPassed) {
          this.state.courseStatus = 'passed';
          if (!this.state.completedModules.includes(5)) {
            this.state.completedModules = [...this.state.completedModules, 5];
          }
          if (this.adapter) {
            this.adapter.setStatus('passed');
            this.adapter.setScore(100);
          }
        } else {
          this.state.courseStatus = 'incomplete';
          if (this.adapter) {
            this.adapter.setStatus('incomplete');
            this.adapter.setScore(score);
          }
        }

        hasChanged = true;
        break;
      }

      case 'SYNC_SCORM': {
        this._syncToAdapter();
        break;
      }

      case 'RESTORE_STATE': {
        this._hydrateFromAdapter();
        hasChanged = true;
        break;
      }

      default:
        // Acción no reconocida, no muta
        break;
    }

    if (hasChanged) {
      this._syncToAdapter();
      this._notify({ type, payload });
    }

    return this.getState();
  }
}

/**
 * Factory para instanciación limpia
 * @param {Object} [scormAdapter] 
 * @param {Object} [initialState] 
 * @returns {CourseStore}
 */
export function createCourseStore(scormAdapter = null, initialState = {}) {
  return new CourseStore(scormAdapter, initialState);
}
