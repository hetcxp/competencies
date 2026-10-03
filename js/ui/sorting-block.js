/**
 * Sorting Block - Componente UI Clasificador Cuatridimensional A-B-C-D
 * Permite clasificar descriptores conductuales en la taxonomía graduada de Martha Alles:
 * - Nivel A: Alto / Estratégico (Alcance corporativo, diseño de directrices)
 * - Nivel B: Bueno / Táctico (Gestión de área, optimización y facilitación)
 * - Nivel C: Mínimo Aceptable / Operativo (Cumplimiento de procedimientos estándar)
 * - Nivel D: Insatisfecho / Inicial (Conducta reactiva o por debajo del estándar)
 *
 * Soporte Dual de Interacción:
 * - Drag & Drop nativo HTML5 (táctil y cursor)
 * - Selección por Click / Tap y Teclado accesible
 * - Micro-feedback ante confusiones clásicas (e.g., adjetivos cosméticos vs. alcance real)
 *
 * Layer: UI (DOM Controller)
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const DEFAULT_SLOTS = Object.freeze([
  { id: 'slot-a', level: 'A', title: 'Nivel A - Estratégico / Alto', badgeClass: 'rise-level-badge--a' },
  { id: 'slot-b', level: 'B', title: 'Nivel B - Táctico / Bueno', badgeClass: 'rise-level-badge--b' },
  { id: 'slot-c', level: 'C', title: 'Nivel C - Operativo / Aceptable', badgeClass: 'rise-level-badge--c' },
  { id: 'slot-d', level: 'D', title: 'Nivel D - Inicial / Insatisfecho', badgeClass: 'rise-level-badge--d' }
]);

export const DEFAULT_SLOTS_EN = Object.freeze([
  { id: 'slot-a', level: 'A', title: 'Level A - Strategic / High', badgeClass: 'rise-level-badge--a' },
  { id: 'slot-b', level: 'B', title: 'Level B - Tactical / Good', badgeClass: 'rise-level-badge--b' },
  { id: 'slot-c', level: 'C', title: 'Level C - Operational / Acceptable', badgeClass: 'rise-level-badge--c' },
  { id: 'slot-d', level: 'D', title: 'Level D - Initial / Unsatisfactory', badgeClass: 'rise-level-badge--d' }
]);

export class SortingBlock {
  constructor(options = {}) {
    this.store = options.store || null;
    this.lang = options.lang === 'en' ? 'en' : 'es';
    this.container = null;
    this.items = [];
    this.slots = [];
    this.onComplete = null;

    // Estado reactivo interno
    this.placements = new Map(); // itemId -> slotId
    this.selectedItemId = null;   // itemId actualmente en foco/selección
    this.attempts = 0;
    this.allCorrect = false;

    this.rootEl = null;
    this.poolEl = null;
    this.slotEls = new Map();
    this.feedbackEl = null;
  }

  /**
   * Actualiza el idioma activo del clasificador
   * @param {'es'|'en'} lang
   */
  setLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'es';
  }

  /**
   * Renderiza el bloque interactivo de ordenamiento
   * @param {HTMLElement|string} container - Elemento o selector CSS
   * @param {Array<Object>} items - Descriptores conductuales a clasificar
   * @param {Array<Object>} [slots] - Cuadrantes de destino (A-B-C-D)
   * @param {Function} [onComplete] - Callback al validar con 100% de aciertos
   * @returns {HTMLElement|null}
   */
  render(container, items, slots = null, onComplete = null) {
    if (typeof document === 'undefined') {
      return null;
    }

    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this.container) {
      throw new Error('SortingBlock: Target container element is required');
    }

    const defaultSlots = this.lang === 'en' ? DEFAULT_SLOTS_EN : DEFAULT_SLOTS;
    const resolvedSlots = Array.isArray(slots) && slots.length > 0 ? slots : defaultSlots;

    // Invariante de arquitectura: clonado defensivo (cero mutación de datos maestros)
    this.items = Array.isArray(items) ? JSON.parse(JSON.stringify(items)) : [];
    this.slots = JSON.parse(JSON.stringify(resolvedSlots));
    this.onComplete = typeof onComplete === 'function' ? onComplete : null;
    this.placements.clear();
    this.selectedItemId = null;
    this.attempts = 0;
    this.allCorrect = false;

    const isEn = this.lang === 'en';
    const leadTitle = isEn
      ? 'Graduated Behavioral Classifier (Levels A-B-C-D)'
      : 'Clasificador Conductual Graduado (Niveles A-B-C-D)';
    const leadDesc = isEn
      ? 'Drag each descriptor or click to select it, then click the corresponding quadrant according to the complexity and methodological scope of Martha Alles.'
      : 'Arrastra cada descriptor o haz clic para seleccionarlo y luego haz clic en el cuadrante correspondiente según la complejidad y alcance metodológico Alles.';
    const poolAria = isEn
      ? 'Pending descriptors bank. Press Enter or Space to return the selected descriptor here.'
      : 'Banco de descriptores pendientes. Presiona Enter o Espacio para devolver aquí el descriptor seleccionado.';
    const poolTitle = isEn ? 'Descriptors to Classify' : 'Descriptores por Clasificar';
    const regionAria = isEn ? 'Classification quadrants' : 'Cuadrantes de clasificación';
    const validateBtnText = isEn ? 'Check Classification' : 'Comprobar Clasificación';
    const resetBtnText = isEn ? 'Reset' : 'Reiniciar';

    const block = document.createElement('section');
    block.className = 'rise-block-sorting';

    block.innerHTML = `
      <div class="rise-sorting-lead">
        <h3>${escapeHtml(leadTitle)}</h3>
        <p class="rise-feedback-desc">${escapeHtml(leadDesc)}</p>
      </div>

      <div class="rise-sorting-items-pool" id="sorting-pool" aria-label="${escapeHtml(poolAria)}" tabindex="0" role="button">
        <span class="rise-pool-title">${escapeHtml(poolTitle)}</span>
        <div class="rise-pool-target" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
      </div>

      <div class="rise-slot-grid" role="region" aria-label="${escapeHtml(regionAria)}">
        ${this.slots.map(slot => {
          const slotAria = isEn
            ? `Quadrant Level ${escapeHtml(slot.level)}: ${escapeHtml(slot.title)}. Press Enter or Space to assign the selected descriptor here.`
            : `Cuadrante Nivel ${escapeHtml(slot.level)}: ${escapeHtml(slot.title)}. Presiona Enter o Espacio para asignar aquí el descriptor seleccionado.`;
          return `
            <div class="rise-slot-card" data-slot-id="${escapeHtml(slot.id)}" data-level="${escapeHtml(slot.level)}" tabindex="0" role="button" aria-label="${escapeHtml(slotAria)}">
              <div class="rise-slot-header">
                <span class="rise-level-badge ${slot.badgeClass || ''}">${escapeHtml(slot.level)}</span>
                <strong style="font-size: 0.88rem; color: var(--slate-800);">${escapeHtml(slot.title)}</strong>
              </div>
              <div class="rise-slot-target" data-slot-id="${escapeHtml(slot.id)}" aria-dropeffect="move"></div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="rise-sorting-controls" style="display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
        <button type="button" class="rise-btn rise-btn-primary" id="btn-validate-sorting">
          ${escapeHtml(validateBtnText)}
        </button>
        <button type="button" class="rise-btn rise-btn-secondary" id="btn-reset-sorting">
          ${escapeHtml(resetBtnText)}
        </button>
      </div>

      <div class="rise-sorting-feedback" aria-live="polite" style="margin-top: 1.5rem;"></div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(block);
    this.rootEl = block;

    this.poolEl = block.querySelector('.rise-pool-target');
    this.feedbackEl = block.querySelector('.rise-sorting-feedback');

    this.slotEls.clear();
    block.querySelectorAll('.rise-slot-card').forEach(slotCard => {
      const slotId = slotCard.getAttribute('data-slot-id');
      const targetArea = slotCard.querySelector('.rise-slot-target');
      this.slotEls.set(slotId, { card: slotCard, target: targetArea });
    });

    this._renderItemsInPool();
    this._bindInteractions();

    return block;
  }

  /**
   * Renderiza los items dentro del pool inicial
   */
  _renderItemsInPool() {
    if (!this.poolEl) return;
    this.poolEl.innerHTML = '';

    this.items.forEach(item => {
      const pill = this._createItemPill(item);
      this.poolEl.appendChild(pill);
    });
  }

  /**
   * Crea el elemento DOM para un descriptor conductual
   * @param {Object} item 
   * @returns {HTMLElement}
   */
  _createItemPill(item) {
    const pill = document.createElement('div');
    pill.className = 'rise-item-pill';
    pill.id = `item-pill-${item.id}`;
    pill.setAttribute('data-item-id', item.id);
    pill.setAttribute('draggable', 'true');
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('role', 'button');
    pill.setAttribute('aria-grabbed', 'false');
    pill.setAttribute('aria-pressed', 'false');
    pill.textContent = item.text;

    return pill;
  }

  /**
   * Vincula interacciones de Drag & Drop y Click/Keyboard
   */
  _bindInteractions() {
    if (!this.rootEl) return;

    // 1. Drag & Drop events en elementos
    this.rootEl.addEventListener('dragstart', (e) => {
      if (this.allCorrect) return;
      const pill = e.target.closest('.rise-item-pill');
      if (pill) {
        const itemId = pill.getAttribute('data-item-id');
        e.dataTransfer.setData('text/plain', itemId);
        e.dataTransfer.effectAllowed = 'move';
        pill.classList.add('is-dragging');
        pill.setAttribute('aria-grabbed', 'true');
      }
    });

    this.rootEl.addEventListener('dragend', (e) => {
      const pill = e.target.closest('.rise-item-pill');
      if (pill) {
        pill.classList.remove('is-dragging');
        pill.setAttribute('aria-grabbed', 'false');
      }
      this.rootEl.querySelectorAll('.rise-slot-card').forEach(c => c.classList.remove('is-drag-over'));
    });

    // 2. Drag & Drop drop zones (Slots y Pool)
    const registerDropZone = (element, onDropHandler) => {
      element.addEventListener('dragover', (e) => {
        if (this.allCorrect) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const card = element.closest('.rise-slot-card');
        if (card) card.classList.add('is-drag-over');
      });

      element.addEventListener('dragleave', () => {
        const card = element.closest('.rise-slot-card');
        if (card) card.classList.remove('is-drag-over');
      });

      element.addEventListener('drop', (e) => {
        if (this.allCorrect) return;
        e.preventDefault();
        const card = element.closest('.rise-slot-card');
        if (card) card.classList.remove('is-drag-over');

        const itemId = e.dataTransfer.getData('text/plain');
        if (itemId) {
          onDropHandler(itemId);
        }
      });
    };

    // Slots drop zones
    this.slotEls.forEach(({ card, target }, slotId) => {
      registerDropZone(card, (itemId) => this.placeItem(itemId, slotId));
    });

    // Pool drop zone (devolver al pool)
    const poolContainer = this.rootEl.querySelector('.rise-sorting-items-pool');
    if (poolContainer) {
      registerDropZone(poolContainer, (itemId) => this.placeItem(itemId, null));
    }

    // 3. Click / Tap & Keyboard interactions
    const handleInteraction = (target) => {
      if (this.allCorrect || !target) return;

      const pill = target.closest('.rise-item-pill');
      const slotCard = target.closest('.rise-slot-card');
      const pool = target.closest('.rise-sorting-items-pool');

      if (pill) {
        const itemId = pill.getAttribute('data-item-id');
        this._handleItemClick(itemId, pill);
        return;
      }

      if (slotCard && this.selectedItemId) {
        const slotId = slotCard.getAttribute('data-slot-id');
        this.placeItem(this.selectedItemId, slotId);
        this._clearItemSelection();
        return;
      }

      if (pool && this.selectedItemId) {
        this.placeItem(this.selectedItemId, null);
        this._clearItemSelection();
      }
    };

    this.rootEl.addEventListener('click', (e) => {
      handleInteraction(e.target);
    });

    this.rootEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target && (target.matches('.rise-item-pill, .rise-slot-card, .rise-sorting-items-pool') ||
            target.closest('.rise-item-pill, .rise-slot-card, .rise-sorting-items-pool'))) {
          e.preventDefault();
          handleInteraction(target);
        }
      }
    });

    // 4. Botones de acción
    const btnValidate = this.rootEl.querySelector('#btn-validate-sorting');
    if (btnValidate) {
      btnValidate.addEventListener('click', () => this.validate());
    }

    const btnReset = this.rootEl.querySelector('#btn-reset-sorting');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.reset());
    }
  }

  /**
   * Maneja el clic en un descriptor
   * @param {string} itemId 
   * @param {HTMLElement} pillEl 
   */
  _handleItemClick(itemId, pillEl) {
    if (this.selectedItemId === itemId) {
      this._clearItemSelection();
      return;
    }

    this._clearItemSelection();
    this.selectedItemId = itemId;
    pillEl.classList.add('is-selected');
    pillEl.setAttribute('aria-pressed', 'true');
    pillEl.style.outline = '2px solid var(--mint-primary)';
  }

  /**
   * Limpia la selección activa de items
   */
  _clearItemSelection() {
    this.selectedItemId = null;
    if (this.rootEl) {
      this.rootEl.querySelectorAll('.rise-item-pill').forEach(p => {
        p.classList.remove('is-selected');
        p.setAttribute('aria-pressed', 'false');
        p.style.outline = '';
      });
    }
  }

  /**
   * Asigna un descriptor a un cuadrante específico o al pool
   * @param {string} itemId 
   * @param {string|null} slotId 
   */
  placeItem(itemId, slotId = null) {
    if (!this.rootEl) return;
    const pill = this.rootEl.querySelector(`[data-item-id="${itemId}"]`);
    if (!pill) return;

    // Limpia feedback previo al interactuar
    pill.classList.remove('is-correct', 'is-incorrect');

    if (slotId && this.slotEls.has(slotId)) {
      const { target } = this.slotEls.get(slotId);
      target.appendChild(pill);
      this.placements.set(itemId, slotId);
    } else {
      if (this.poolEl) {
        this.poolEl.appendChild(pill);
      }
      this.placements.delete(itemId);
    }
  }

  /**
   * Valida la clasificación completa de los descriptores y genera micro-feedback
   * @returns {Object} Resultado de la validación
   */
  validate() {
    this.attempts += 1;
    const unplacedCount = this.items.length - this.placements.size;

    if (unplacedCount > 0) {
      this._renderFeedbackCard({
        isSuccess: false,
        title: 'Clasificación Incompleta',
        message: `Aún restan ${unplacedCount} descriptores por ubicar en los cuadrantes A, B, C o D.`,
        confusions: []
      });
      return { allCorrect: false, incomplete: true, attempts: this.attempts };
    }

    const confusions = [];
    let correctCount = 0;

    this.items.forEach(item => {
      const placedSlotId = this.placements.get(item.id);
      const placedSlot = this.slots.find(s => s.id === placedSlotId);
      const placedLevel = placedSlot ? placedSlot.level : '';
      const targetLevel = item.targetLevel || (this.slots.find(s => s.id === item.targetSlot)?.level) || '';

      const isMatch = placedLevel === targetLevel || placedSlotId === item.targetSlot;
      const pill = this.rootEl ? this.rootEl.querySelector(`[data-item-id="${item.id}"]`) : null;

      if (isMatch) {
        correctCount += 1;
        if (pill) {
          pill.classList.remove('is-incorrect');
          pill.classList.add('is-correct');
        }
      } else {
        if (pill) {
          pill.classList.remove('is-correct');
          pill.classList.add('is-incorrect');
        }

        // Detección de micro-feedback específico
        const specificFeedback = (item.confusions && item.confusions[placedLevel])
          || this._generateTaxonomyConfusionFeedback(targetLevel, placedLevel, item.text);

        confusions.push({
          itemId: item.id,
          itemText: item.text,
          targetLevel,
          placedLevel,
          message: specificFeedback
        });
      }
    });

    const isAllCorrect = correctCount === this.items.length;
    this.allCorrect = isAllCorrect;

    const isEn = this.lang === 'en';

    if (isAllCorrect) {
      this._renderFeedbackCard({
        isSuccess: true,
        title: isEn ? 'Exact Taxonomic Classification!' : '¡Clasificación Taxonómica Exacta!',
        message: isEn
          ? 'You have accurately graduated all four levels of behavioral complexity according to Martha Alles\' criteria.'
          : 'Has graduado con precisión los cuatro niveles de complejidad conductual respetando los criterios de Martha Alles.',
        confusions: []
      });

      // Congela controles interactivos
      const btnValidate = this.rootEl ? this.rootEl.querySelector('#btn-validate-sorting') : null;
      if (btnValidate) btnValidate.setAttribute('disabled', 'true');

      if (this.onComplete) {
        this.onComplete({
          allCorrect: true,
          attempts: this.attempts,
          placements: Object.fromEntries(this.placements)
        });
      }
    } else {
      this._renderFeedbackCard({
        isSuccess: false,
        title: isEn
          ? `${correctCount} of ${this.items.length} Correct Descriptors`
          : `${correctCount} de ${this.items.length} Descriptores Correctos`,
        message: isEn
          ? 'There are confusions regarding complexity scope. Review the analytical micro-feedback and relocate the descriptors highlighted in red:'
          : 'Existen confusiones en el alcance de complejidad. Revisa los micro-feedbacks analíticos y reubica los descriptores destacados en rojo:',
        confusions
      });
    }

    return {
      allCorrect: isAllCorrect,
      correctCount,
      total: this.items.length,
      attempts: this.attempts,
      confusions
    };
  }

  /**
   * Genera micro-feedback metodológico basado en la taxonomía de Martha Alles
   */
  _generateTaxonomyConfusionFeedback(targetLevel, placedLevel, itemText) {
    const isEn = this.lang === 'en';
    if (targetLevel === 'A' && placedLevel === 'B') {
      return isEn
        ? 'Confusion B for A: The descriptor designs the strategic guideline and comprehensive corporate vision; it is not limited to tactical execution within a department.'
        : 'Confusión B por A: El descriptor diseña la directriz estratégica y visión corporativa integral, no se limita a la ejecución táctica de un departamento.';
    }
    if (targetLevel === 'B' && placedLevel === 'A') {
      return isEn
        ? 'Confusion A for B: It contains positive adjectives, but its sphere of action is tactical within the area, without systemic scope across executive leadership.'
        : 'Confusión A por B: Contiene adjetivos positivos pero su radio de acción es táctico en el área, sin alcance sistémico en la dirección general.';
    }
    if (targetLevel === 'B' && placedLevel === 'C') {
      return isEn
        ? 'Confusion C for B: Provides facilitation and continuous improvement that exceeds the baseline operational minimum (Level C).'
        : 'Confusión C por B: Aporta facilitación y mejora continua que excede el mero estándar operativo mínimo (Nivel C).';
    }
    if (targetLevel === 'C' && placedLevel === 'B') {
      return isEn
        ? 'Confusion B for C: Describes diligent performance of assigned duties (expected minimum baseline), not an overarching tactical initiative.'
        : 'Confusión B por C: Describe la realización diligente de las funciones asignadas (piso mínimo esperado), no una iniciativa táctica superadora.';
    }
    if (targetLevel === 'D') {
      return isEn
        ? 'Level D: Corresponds to initial, passive, or reactive behaviors that do not reach the expected job standard.'
        : 'Nivel D: Corresponde a conductas iniciales, pasivas o reactivas que no alcanzan el estándar esperado del puesto.';
    }
    return isEn
      ? `Placed in Level ${placedLevel}, but behavioral evidence corresponds to Level ${targetLevel}.`
      : `Se clasificó en Nivel ${placedLevel}, pero las evidencias conductuales corresponden al Nivel ${targetLevel}.`;
  }

  /**
   * Despliega la tarjeta de feedback y micro-explicaciones analíticas
   */
  _renderFeedbackCard({ isSuccess, title, message, confusions }) {
    if (!this.feedbackEl) return;

    const isEn = this.lang === 'en';
    const cardClass = isSuccess ? 'rise-feedback-card--success' : 'rise-feedback-card--failure';
    const icon = isSuccess ? '✓' : '⚠';

    let confusionsListHtml = '';
    if (confusions.length > 0) {
      confusionsListHtml = `
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
          ${confusions.map(c => `
            <div style="background: #FFFFFF; border-left: 3px solid var(--alert-red); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.88rem;">
              <strong>${escapeHtml(c.itemText)}</strong><br>
              <span style="color: var(--alert-red-dark); font-weight: 700;">${isEn ? `Placed in Level ${escapeHtml(c.placedLevel)} (Expected: ${escapeHtml(c.targetLevel)}):` : `Ubicado en Nivel ${escapeHtml(c.placedLevel)} (Esperado: ${escapeHtml(c.targetLevel)}):`}</span>
              <p style="margin: 0.35rem 0 0 0; color: var(--slate-700);">${escapeHtml(c.message)}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    this.feedbackEl.innerHTML = `
      <div class="rise-feedback-card ${cardClass}">
        <div class="rise-feedback-header">
          <span class="rise-feedback-icon" aria-hidden="true">${icon}</span>
          <h4 class="rise-feedback-title">${escapeHtml(title)}</h4>
        </div>
        <div class="rise-feedback-desc">${escapeHtml(message)}</div>
        ${confusionsListHtml}
      </div>
    `;
  }

  /**
   * Reinicia la clasificación completa al pool inicial
   */
  reset() {
    this.placements.clear();
    this.selectedItemId = null;
    this.allCorrect = false;

    if (this.rootEl) {
      this.items.forEach(item => {
        this.placeItem(item.id, null);
      });
      if (this.feedbackEl) {
        this.feedbackEl.innerHTML = '';
      }
      const btnValidate = this.rootEl.querySelector('#btn-validate-sorting');
      if (btnValidate) btnValidate.removeAttribute('disabled');
    }
  }

  /**
   * Retorna snapshot de las asignaciones actuales
   * @returns {Object}
   */
  getPlacements() {
    return Object.fromEntries(this.placements);
  }
}
