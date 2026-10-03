/**
 * Challenge Engine - Servicio de Evaluación Pedagógica Challenge-First
 * Aplica el patrón Action Mapping / Fallo Productivo (Kathy Moore):
 * 1. Presenta crisis situacional antes de exponer la teoría formal.
 * 2. Evalúa elecciones: si falla, expone consecuencias organizacionales reales.
 * 3. Si acierta, desbloquea la Píldora Just-in-Time (JIT) y notifica al Store.
 *
 * Layer: SERVICE (Zero UI / Zero DOM dependencies)
 */

export class ChallengeEngine {
  /**
   * @param {Object} [options]
   * @param {Object} [options.store] - Instancia de CourseStore para persistencia reactiva
   */
  constructor(options = {}) {
    this.store = options.store || null;
    this.attempts = new Map(); // challengeId -> number
    this.history = new Map();  // challengeId -> Array<choiceId>
    this.status = new Map();   // challengeId -> 'pending' | 'resolved'
  }

  /**
   * Obtiene el número acumulado de intentos para un reto
   * @param {string} challengeId
   * @returns {number}
   */
  getAttempts(challengeId) {
    return this.attempts.get(challengeId) || 0;
  }

  /**
   * Consulta el historial de opciones seleccionadas
   * @param {string} challengeId
   * @returns {string[]}
   */
  getHistory(challengeId) {
    return [...(this.history.get(challengeId) || [])];
  }

  /**
   * Determina si el reto ya fue superado
   * @param {string} challengeId
   * @returns {boolean}
   */
  isResolved(challengeId) {
    return this.status.get(challengeId) === 'resolved';
  }

  /**
   * Evalúa la elección del usuario contra los criterios pedagógicos del reto
   * @param {Object} challenge - DTO del reto pedagógico
   * @param {string} choiceId - Identificador de la opción elegida
   * @returns {Object} Resultado estructurado de la evaluación
   */
  evaluate(challenge, choiceId) {
    if (!challenge || typeof challenge !== 'object') {
      throw new Error('Challenge data object is required');
    }
    if (!Array.isArray(challenge.choices) || challenge.choices.length === 0) {
      throw new Error('Challenge must contain a non-empty choices array');
    }

    const challengeId = challenge.id || 'anonymous-challenge';
    const choice = challenge.choices.find(c => c.id === choiceId);

    if (!choice) {
      throw new Error(`Choice with id "${choiceId}" was not found in challenge "${challengeId}"`);
    }

    // Actualiza métricas de intentos e historial
    const currentAttempts = (this.attempts.get(challengeId) || 0) + 1;
    this.attempts.set(challengeId, currentAttempts);

    const hist = this.history.get(challengeId) || [];
    hist.push(choiceId);
    this.history.set(challengeId, hist);

    const isCorrect = Boolean(choice.isCorrect);
    if (isCorrect) {
      this.status.set(challengeId, 'resolved');
    }

    // Consecuencia organizacional ante fallo productivo
    const consequence = choice.consequence || choice.consequenceText || null;
    const feedback = choice.feedback || (isCorrect
      ? '¡Decisión acertada! Has aplicado el principio metodológico correcto.'
      : 'Decisión subóptima. Observa las consecuencias en la organización.');

    // Píldora Just-in-Time (desbloqueada únicamente al resolver con éxito)
    const jitPill = isCorrect
      ? (challenge.jitPill || challenge.jit || null)
      : null;

    // Sincronización transparente con CourseStore si está inyectado
    if (this.store && typeof this.store.dispatchAction === 'function') {
      const moduleId = challenge.moduleId || challengeId;
      this.store.dispatchAction('RECORD_CHALLENGE_ATTEMPT', {
        moduleId,
        choiceId,
        passed: isCorrect,
        feedback: consequence || feedback
      });
    }

    return {
      challengeId,
      choiceId,
      isCorrect,
      consequence,
      feedback,
      jitPill,
      attempts: currentAttempts,
      resolved: isCorrect,
      selectedChoice: { ...choice }
    };
  }

  /**
   * Resetea el estado y métricas de un reto específico
   * @param {string} challengeId
   */
  reset(challengeId) {
    this.attempts.delete(challengeId);
    this.history.delete(challengeId);
    this.status.delete(challengeId);
  }
}
