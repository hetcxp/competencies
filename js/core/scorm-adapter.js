/**
 * SCORM Adapter Resiliente
 * Soporte dual SCORM 1.2 / SCORM 2004 con fallback transparente a LocalStorage / Memoria.
 * Cumple con aislamiento estricto de telemetría:
 * - Telemetría obligatoria: lesson_status, score.raw
 * - Telemetría opcional (espinas teóricas): suspend_data
 */

export class ScormAdapter {
  /**
   * @param {Object} [options]
   * @param {Object} [options.windowObj] - Objeto window para búsqueda de API (inyección para tests)
   * @param {Object} [options.storage] - Implementación de Storage (localStorage o similar)
   */
  constructor(options = {}) {
    this.windowObj = options.windowObj !== undefined 
      ? options.windowObj 
      : (typeof window !== 'undefined' ? window : null);
    
    let safeStorage = null;
    if (options.storage !== undefined) {
      safeStorage = options.storage;
    } else if (this.windowObj) {
      try {
        safeStorage = this.windowObj.localStorage;
      } catch (e) {
        // En sandbox restrictivo o file:// puede lanzar SecurityError
        safeStorage = null;
      }
    }
    this.storage = safeStorage;

    this.memoryStore = new Map();
    this.api = null;
    this.version = null; // '1.2' | '2004' | 'fallback'
    this.initialized = false;
    this.storageKey = 'SCORM_COURSE_ALLES_LOCAL_DATA';
    this.sessionStartTime = Date.now();
  }

  /**
   * Busca recursivamente el objeto API en la jerarquía de ventanas
   * @param {Window} win 
   * @param {string} apiName 
   * @returns {Object|null}
   */
  _findApi(win, apiName) {
    let attempts = 0;
    const maxAttempts = 10;
    let currentWin = win;

    while (currentWin && attempts < maxAttempts) {
      try {
        if (currentWin[apiName]) {
          return currentWin[apiName];
        }
        if (currentWin.parent && currentWin.parent !== currentWin) {
          currentWin = currentWin.parent;
        } else if (currentWin.opener) {
          currentWin = currentWin.opener;
        } else {
          break;
        }
      } catch (e) {
        break;
      }
      attempts++;
    }
    return null;
  }

  /**
   * Inicializa la conexión con el LMS o inicia modo fallback
   * @returns {boolean}
   */
  init() {
    if (this.initialized) {
      return true;
    }

    this.sessionStartTime = Date.now();

    if (this.windowObj) {
      // 1. Intentar SCORM 1.2
      const api12 = this._findApi(this.windowObj, 'API');
      if (api12 && typeof api12.LMSInitialize === 'function') {
        try {
          const res = api12.LMSInitialize('');
          if (res === 'true' || res === true || res === 1) {
            this.api = api12;
            this.version = '1.2';
            this.initialized = true;
            this.setValue('cmi.core.exit', 'suspend');
            return true;
          }
        } catch (e) {
          console.warn('[ScormAdapter] LMSInitialize exception, falling back:', e);
        }
      }

      // 2. Intentar SCORM 2004
      const api2004 = this._findApi(this.windowObj, 'API_1484_11');
      if (api2004 && typeof api2004.Initialize === 'function') {
        try {
          const res = api2004.Initialize('');
          if (res === 'true' || res === true || res === 1) {
            this.api = api2004;
            this.version = '2004';
            this.initialized = true;
            this.setValue('cmi.exit', 'suspend');
            return true;
          }
        } catch (e) {
          console.warn('[ScormAdapter] Initialize exception, falling back:', e);
        }
      }
    }

    // 3. Fallback transparente (Offline / LocalStorage / Memoria)
    this.version = 'fallback';
    this.initialized = true;
    this._loadFallbackStore();
    this.setValue('cmi.core.exit', 'suspend');
    return true;
  }

  /**
   * Degrada transparentemente a modo fallback ante excepciones en tiempo de ejecución del LMS
   * Preserva el snapshot más reciente en memoria antes de fusionar con el storage local
   * @private
   */
  _degradeToFallback() {
    this.version = 'fallback';
    this.api = null;
    const currentMemory = new Map(this.memoryStore);
    this._loadFallbackStore();
    for (const [k, v] of currentMemory.entries()) {
      this.memoryStore.set(k, v);
    }
    this._persistFallbackStore();
  }

  _loadFallbackStore() {
    if (this.storage) {
      try {
        const raw = this.storage.getItem(this.storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          for (const [k, v] of Object.entries(parsed)) {
            this.memoryStore.set(k, String(v));
          }
        }
      } catch (e) {
        // En caso de error de lectura, mantiene mapa limpio
      }
    }
  }

  _persistFallbackStore() {
    if (this.storage) {
      try {
        const obj = {};
        for (const [k, v] of this.memoryStore.entries()) {
          obj[k] = v;
        }
        this.storage.setItem(this.storageKey, JSON.stringify(obj));
      } catch (e) {
        // Ignora errores de cuota en storage
      }
    }
  }

  /**
   * Resuelve el nombre del elemento canónico según la versión SCORM
   * @param {string} standardElement 
   * @returns {string}
   */
  _mapElement(standardElement) {
    if (this.version === '2004') {
      switch (standardElement) {
        case 'cmi.core.lesson_status':
          return 'cmi.completion_status';
        case 'cmi.core.lesson_location':
          return 'cmi.location';
        case 'cmi.core.exit':
        case 'cmi.exit':
          return 'cmi.exit';
        case 'cmi.core.score.raw':
          return 'cmi.score.raw';
        case 'cmi.core.score.min':
          return 'cmi.score.min';
        case 'cmi.core.score.max':
          return 'cmi.score.max';
        case 'cmi.core.session_time':
          return 'cmi.session_time';
        case 'cmi.suspend_data':
        case 'suspend_data':
          return 'cmi.suspend_data';
        default:
          return standardElement;
      }
    }

    // SCORM 1.2 o fallback
    switch (standardElement) {
      case 'cmi.completion_status':
      case 'cmi.success_status':
        return 'cmi.core.lesson_status';
      case 'cmi.location':
        return 'cmi.core.lesson_location';
      case 'cmi.exit':
      case 'cmi.core.exit':
        return 'cmi.core.exit';
      case 'cmi.score.raw':
        return 'cmi.core.score.raw';
      case 'cmi.score.min':
        return 'cmi.core.score.min';
      case 'cmi.score.max':
        return 'cmi.core.score.max';
      case 'cmi.session_time':
        return 'cmi.core.session_time';
      case 'suspend_data':
        return 'cmi.suspend_data';
      default:
        return standardElement;
    }
  }

  /**
   * Obtiene un valor del LMS o del fallback
   * @param {string} element 
   * @returns {string}
   */
  getValue(element) {
    if (!this.initialized) {
      this.init();
    }

    const mapped = this._mapElement(element);

    if (this.version === '1.2' && this.api) {
      try {
        return String(this.api.LMSGetValue(mapped) || '');
      } catch (err) {
        console.warn('[ScormAdapter] LMSGetValue exception:', err);
        this._degradeToFallback();
        return this.memoryStore.get(mapped) || '';
      }
    }

    if (this.version === '2004' && this.api) {
      try {
        return String(this.api.GetValue(mapped) || '');
      } catch (err) {
        console.warn('[ScormAdapter] GetValue exception:', err);
        this._degradeToFallback();
        return this.memoryStore.get(mapped) || '';
      }
    }

    return this.memoryStore.get(mapped) || '';
  }

  /**
   * Establece un valor en el LMS o en el fallback
   * @param {string} element 
   * @param {string|number} value 
   * @returns {boolean}
   */
  setValue(element, value) {
    if (!this.initialized) {
      this.init();
    }

    const strVal = String(value);
    const mapped = this._mapElement(element);

    // Validación SPM SCORM (4096 caracteres para SCORM 1.2/Fallback, 64000 para SCORM 2004)
    if (mapped === 'cmi.suspend_data') {
      const maxLimit = this.version === '2004' ? 64000 : 4096;
      if (strVal.length > maxLimit) {
        console.warn(`[ScormAdapter] suspend_data exceeds SPM limit (${strVal.length} > ${maxLimit}). Value rejected.`);
        return false;
      }
    }

    // Mantiene espejo local en memoria para degradación y consistencia
    this.memoryStore.set(mapped, strVal);

    if (this.version === '1.2' && this.api) {
      try {
        const res = this.api.LMSSetValue(mapped, strVal);
        if (res === 'true' || res === true || res === 1) {
          return true;
        }
        console.warn(`[ScormAdapter] LMSSetValue returned unsuccessful code "${res}", degrading to fallback`);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      } catch (err) {
        console.warn('[ScormAdapter] LMSSetValue exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      }
    }

    if (this.version === '2004' && this.api) {
      try {
        const res = this.api.SetValue(mapped, strVal);
        if (res === 'true' || res === true || res === 1) {
          return true;
        }
        console.warn(`[ScormAdapter] SetValue returned unsuccessful code "${res}", degrading to fallback`);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      } catch (err) {
        console.warn('[ScormAdapter] SetValue exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      }
    }

    this._persistFallbackStore();
    return true;
  }

  /**
   * Calcula y formatea la duración de la sesión actual
   * SCORM 1.2: Formato CMITimespan (HH:MM:SS)
   * SCORM 2004: Formato ISO 8601 Duration (PT#H#M#S)
   * @param {'1.2' | '2004' | 'fallback' | null} [targetVersion]
   * @returns {string}
   */
  getSessionTime(targetVersion = null) {
    const ver = targetVersion || this.version || '1.2';
    const elapsedMs = Math.max(0, Date.now() - (this.sessionStartTime || Date.now()));
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (ver === '2004') {
      return `PT${hours}H${minutes}M${seconds}S`;
    }

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  /**
   * Sincroniza la telemetría de tiempo de sesión en el LMS
   * @returns {boolean}
   */
  syncSessionTime() {
    if (!this.initialized) return false;
    if (this.version === '1.2' && this.api) {
      const timeStr = this.getSessionTime('1.2');
      return this.setValue('cmi.core.session_time', timeStr);
    }
    if (this.version === '2004' && this.api) {
      const timeStr = this.getSessionTime('2004');
      return this.setValue('cmi.session_time', timeStr);
    }
    return true;
  }

  /**
   * Persiste datos en LMS o storage
   * @returns {boolean}
   */
  commit() {
    if (!this.initialized) {
      return false;
    }

    // Fuerza siempre cmi.core.exit = 'suspend' / cmi.exit = 'suspend' para garantizar reanudación
    this.setExit('suspend');
    this.syncSessionTime();

    if (this.version === '1.2' && this.api) {
      try {
        const res = this.api.LMSCommit('');
        if (res === 'true' || res === true || res === 1) {
          return true;
        }
        console.warn(`[ScormAdapter] LMSCommit returned unsuccessful code "${res}", degrading to fallback`);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      } catch (err) {
        console.warn('[ScormAdapter] LMSCommit exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      }
    }

    if (this.version === '2004' && this.api) {
      try {
        const res = this.api.Commit('');
        if (res === 'true' || res === true || res === 1) {
          return true;
        }
        console.warn(`[ScormAdapter] Commit returned unsuccessful code "${res}", degrading to fallback`);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      } catch (err) {
        console.warn('[ScormAdapter] Commit exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        return false;
      }
    }

    this._persistFallbackStore();
    return true;
  }

  /**
   * Finaliza la sesión SCORM
   * @returns {boolean}
   */
  finish() {
    if (!this.initialized) {
      return true;
    }

    this.setExit('suspend');
    this.syncSessionTime();
    const commitSuccess = this.commit();

    let apiSuccess = true;
    if (this.version === '1.2' && this.api) {
      try {
        const res = this.api.LMSFinish('');
        if (res === 'true' || res === true || res === 1) {
          apiSuccess = true;
        } else {
          console.warn(`[ScormAdapter] LMSFinish returned unsuccessful code "${res}", degrading to fallback`);
          this._degradeToFallback();
          this._persistFallbackStore();
          apiSuccess = false;
        }
      } catch (err) {
        console.warn('[ScormAdapter] LMSFinish exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        apiSuccess = false;
      }
    } else if (this.version === '2004' && this.api) {
      try {
        const res = this.api.Terminate('');
        if (res === 'true' || res === true || res === 1) {
          apiSuccess = true;
        } else {
          console.warn(`[ScormAdapter] Terminate returned unsuccessful code "${res}", degrading to fallback`);
          this._degradeToFallback();
          this._persistFallbackStore();
          apiSuccess = false;
        }
      } catch (err) {
        console.warn('[ScormAdapter] Terminate exception:', err);
        this._degradeToFallback();
        this._persistFallbackStore();
        apiSuccess = false;
      }
    }

    this.initialized = false;
    return Boolean(commitSuccess && apiSuccess);
  }

  /**
   * Establece el estado de salida para la sesión SCORM
   * @param {'suspend' | 'logout' | 'time-out' | ''} exitType 
   * @returns {boolean}
   */
  setExit(exitType = 'suspend') {
    return this.setValue('cmi.core.exit', exitType);
  }

  /**
   * Obtiene el estado de salida actual
   * @returns {string}
   */
  getExit() {
    return this.getValue('cmi.core.exit');
  }

  /**
   * Obtiene el estado del curso normalizado
   * @returns {'passed' | 'failed' | 'completed' | 'incomplete'}
   */
  getStatus() {
    if (this.version === '2004') {
      const success = this.getValue('cmi.success_status').toLowerCase();
      if (success === 'passed') return 'passed';
      if (success === 'failed') return 'failed';

      const completion = this.getValue('cmi.completion_status').toLowerCase();
      if (completion === 'completed') return 'completed';
      return 'incomplete';
    }

    // SCORM 1.2 o fallback
    const status = this.getValue('cmi.core.lesson_status').toLowerCase();
    if (status === 'passed') {
      return 'passed';
    }
    if (status === 'completed') {
      return 'completed';
    }
    if (status === 'failed') {
      return 'failed';
    }
    return 'incomplete';
  }

  /**
   * Asigna el estado del curso
   * @param {'passed' | 'failed' | 'completed' | 'incomplete'} status 
   * @returns {boolean}
   */
  setStatus(status) {
    if (this.version === '2004') {
      if (status === 'passed') {
        this.setValue('cmi.success_status', 'passed');
        this.setValue('cmi.completion_status', 'completed');
      } else if (status === 'completed') {
        this.setValue('cmi.success_status', 'unknown');
        this.setValue('cmi.completion_status', 'completed');
      } else if (status === 'failed') {
        this.setValue('cmi.success_status', 'failed');
        this.setValue('cmi.completion_status', 'incomplete');
      } else {
        this.setValue('cmi.success_status', 'unknown');
        this.setValue('cmi.completion_status', 'incomplete');
      }
      return this.commit();
    }

    // SCORM 1.2 y fallback
    const res = this.setValue('cmi.core.lesson_status', status);
    this.commit();
    return res;
  }

  /**
   * Registra el puntaje del estudiante (obligatorio)
   * @param {number} raw 
   * @param {number} [min=0] 
   * @param {number} [max=100] 
   * @returns {boolean}
   */
  setScore(raw, min = 0, max = 100) {
    const rawNum = Math.round(Number(raw));
    const minNum = Math.round(Number(min));
    const maxNum = Math.round(Number(max));

    if (this.version === '2004') {
      this.setValue('cmi.score.raw', rawNum);
      this.setValue('cmi.score.min', minNum);
      this.setValue('cmi.score.max', maxNum);
      const scaled = maxNum > minNum ? ((rawNum - minNum) / (maxNum - minNum)).toFixed(2) : '1.0';
      this.setValue('cmi.score.scaled', scaled);
    } else {
      this.setValue('cmi.core.score.raw', rawNum);
      this.setValue('cmi.core.score.min', minNum);
      this.setValue('cmi.core.score.max', maxNum);
    }

    return this.commit();
  }

  /**
   * Registra la exploración de una Espina Teórica Opcional en suspend_data
   * AISLAMIENTO ESTRICTO: No altera lesson_status ni score.raw.
   * @param {string} moduleId 
   * @param {string} badgeId 
   * @returns {boolean}
   */
  recordTheoreticalExploration(moduleId, badgeId) {
    if (!moduleId || !badgeId) return false;

    const cleanModuleId = String(moduleId).slice(0, 15);
    const cleanBadgeId = String(badgeId).slice(0, 30);

    let currentSuspend = {};
    const rawSuspend = this.getValue('cmi.suspend_data');

    if (rawSuspend) {
      try {
        const parsed = JSON.parse(rawSuspend);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          currentSuspend = parsed;
        }
      } catch (e) {
        currentSuspend = {};
      }
    }

    let theoryExplored = Array.isArray(currentSuspend.theoryExplored)
      ? currentSuspend.theoryExplored
      : [];

    const alreadyExists = theoryExplored.some(
      item => item && item.moduleId === cleanModuleId && item.badgeId === cleanBadgeId
    );

    if (!alreadyExists) {
      theoryExplored = [
        ...theoryExplored,
        {
          moduleId: cleanModuleId,
          badgeId: cleanBadgeId,
          unlockedAt: new Date().toISOString().split('T')[0]
        }
      ].slice(-6); // Acota estrictamente a los 6 módulos posibles

      currentSuspend.theoryExplored = theoryExplored;
      currentSuspend.version = 1;

      let serialized = JSON.stringify(currentSuspend);
      if (serialized.length > 4000) {
        currentSuspend.theoryExplored = theoryExplored.map(item => ({
          moduleId: item.moduleId,
          badgeId: item.badgeId
        }));
        serialized = JSON.stringify(currentSuspend);
      }

      if (serialized.length <= 4096) {
        const setOk = this.setValue('cmi.suspend_data', serialized);
        const commitOk = this.commit();
        return setOk && commitOk;
      }
      return false;
    }

    return true;
  }
}
