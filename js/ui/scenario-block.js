/**
 * Scenario Block - Componente UI para Retos Challenge-First
 * Renderiza escenarios de crisis, gestiona la selección de respuestas,
 * expone el fallo productivo con consecuencias organizacionales y
 * desbloquea la Píldora Just-in-Time (JIT) al resolver.
 *
 * Layer: UI (DOM Controller)
 */

import { ChallengeEngine } from '../services/challenge-engine.js';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class ScenarioBlock {
  /**
   * @param {Object} options
   * @param {HTMLElement|string} options.container - Contenedor DOM o selector CSS
   * @param {Object} options.challengeData - Datos pedagógicos del reto
   * @param {ChallengeEngine} [options.engine] - Instancia de ChallengeEngine
   * @param {Object} [options.store] - Instancia de CourseStore opcional
   * @param {Function} [options.onResolved] - Callback al superar el reto
   * @param {Function} [options.onAttempt] - Callback en cada intento
   */
  constructor({
    container,
    challengeData,
    engine = null,
    store = null,
    onResolved = null,
    onAttempt = null,
    lang = 'es'
  }) {
    this.container = typeof container === 'string' && typeof document !== 'undefined'
      ? document.querySelector(container)
      : container;
    this.data = challengeData;
    this.engine = engine || new ChallengeEngine({ store });
    this.store = store;
    this.onResolved = typeof onResolved === 'function' ? onResolved : null;
    this.onAttempt = typeof onAttempt === 'function' ? onAttempt : null;
    this.lang = lang === 'en' ? 'en' : 'es';

    this.rootEl = null;
    this.choiceButtons = [];
    this.feedbackContainer = null;
    this.jitContainer = null;
    this.isResolved = false;
  }

  /**
   * Actualiza el idioma activo del bloque
   * @param {'es'|'en'} lang
   */
  setLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'es';
  }

  /**
   * Renderiza el bloque de escenario interactivo en el DOM
   * @returns {HTMLElement|null}
   */
  render() {
    if (typeof document === 'undefined') {
      return null;
    }
    if (!this.container) {
      throw new Error('ScenarioBlock: Target container element is required');
    }

    const {
      id = 'challenge-1',
      badge = 'Reto de Decisión Crítica',
      title = 'Situación de Crisis Operativa',
      context = '',
      question = '¿Qué acción correctiva decides aplicar?',
      choices = []
    } = this.data;

    const block = document.createElement('section');
    block.className = 'rise-block-scenario';
    block.id = `scenario-block-${id}`;
    block.setAttribute('data-challenge-id', id);

    const visualAssetHtml = this.data.visualAsset ? `
      <figure class="rise-figure" style="margin: 0.5rem 0 1.25rem;">
        <div class="rise-figure-media">
          <img src="${escapeHtml(this.data.visualAsset.src)}" alt="${escapeHtml(this.data.visualAsset.alt || title)}" class="rise-figure-img" loading="lazy">
        </div>
        ${this.data.visualAsset.caption ? `
          <figcaption class="rise-figure-caption">
            <span class="rise-figure-caption-icon">🔍</span> ${escapeHtml(this.data.visualAsset.caption)}
          </figcaption>
        ` : ''}
      </figure>
    ` : '';

    block.innerHTML = `
      <div class="rise-scenario-card">
        <header class="rise-scenario-header">
          <span class="rise-scenario-badge rise-scenario-badge--challenge">${escapeHtml(badge)}</span>
          <h3 class="rise-scenario-title">${escapeHtml(title)}</h3>
        </header>

        <div class="rise-scenario-context">
          ${visualAssetHtml}
          ${context}
        </div>

        <div class="rise-choices-title">${escapeHtml(question)}</div>

        <div class="rise-choices-list" role="radiogroup" aria-label="${escapeHtml(question)}">
          ${choices.map((choice, idx) => {
            const keyLabel = choice.key || String.fromCharCode(65 + idx);
            return `
              <button
                type="button"
                class="rise-choice-btn"
                data-choice-id="${escapeHtml(choice.id)}"
                role="radio"
                aria-checked="false"
              >
                <span class="rise-choice-key">${escapeHtml(keyLabel)}</span>
                <span class="rise-choice-text">${escapeHtml(choice.text)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <div class="rise-scenario-feedback-slot" aria-live="polite"></div>
        <div class="rise-scenario-jit-slot" aria-live="polite"></div>
      </div>
    `;

    this.container.innerHTML = '';
    this.container.appendChild(block);
    this.rootEl = block;

    this.choiceButtons = Array.from(block.querySelectorAll('.rise-choice-btn'));
    this.feedbackContainer = block.querySelector('.rise-scenario-feedback-slot');
    this.jitContainer = block.querySelector('.rise-scenario-jit-slot');

    // Rehidratación: si el reto ya fue aprobado previamente en el store, restaurar estado visual
    const moduleId = this.data.moduleId || this.data.id;
    const challengeState = this.store && typeof this.store.getState === 'function' && this.store.getState().challengesState
      ? this.store.getState().challengesState[moduleId]
      : null;

    if (challengeState && challengeState.passed) {
      this.isResolved = true;
      const correctChoice = this.data.choices.find(c => c.isCorrect);
      if (correctChoice) {
        const btn = this.choiceButtons.find(b => b.getAttribute('data-choice-id') === correctChoice.id);
        if (btn) {
          btn.classList.add('is-selected', 'is-correct');
          btn.setAttribute('aria-checked', 'true');
        }
      }
      this.choiceButtons.forEach(b => b.setAttribute('disabled', 'true'));
      const jit = this.data.jitPill || this.data.jit;
      if (jit) {
        this._renderJitPill(jit);
      }
    }

    this._bindEvents();
    return block;
  }

  /**
   * Conecta los event listeners en los botones de opciones
   */
  _bindEvents() {
    this.choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isResolved) return;
        const choiceId = btn.getAttribute('data-choice-id');
        this.selectChoice(choiceId);
      });
    });
  }

  /**
   * Procesa la selección del usuario y actualiza la UI
   * @param {string} choiceId 
   */
  selectChoice(choiceId) {
    if (this.isResolved) return;

    const evaluation = this.engine.evaluate(this.data, choiceId);

    // Actualiza estilos de selección y estados ARIA
    this.choiceButtons.forEach(btn => {
      const btnId = btn.getAttribute('data-choice-id');
      const isSelected = btnId === choiceId;
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      btn.classList.remove('is-selected', 'is-correct', 'is-incorrect');

      if (isSelected) {
        btn.classList.add('is-selected');
        if (evaluation.isCorrect) {
          btn.classList.add('is-correct');
        } else {
          btn.classList.add('is-incorrect');
        }
      }
    });

    // Renderiza la retroalimentación
    this._renderFeedback(evaluation);

    if (this.onAttempt) {
      this.onAttempt(evaluation);
    }

    if (evaluation.isCorrect) {
      this.isResolved = true;
      this._renderJitPill(evaluation.jitPill);
      this.choiceButtons.forEach(b => b.setAttribute('disabled', 'true'));

      if (this.onResolved) {
        this.onResolved(evaluation);
      }
    }
  }

  /**
   * Despliega la tarjeta de feedback y consecuencia organizacional
   * @param {Object} evaluation 
   */
  _renderFeedback(evaluation) {
    if (!this.feedbackContainer) return;

    const { isCorrect, consequence, feedback } = evaluation;
    const cardClass = isCorrect ? 'rise-feedback-card--success' : 'rise-feedback-card--failure';
    const icon = isCorrect ? '✓' : '⚠';
    const isEn = this.lang === 'en';
    const heading = isCorrect
      ? (isEn ? 'Accurate Diagnosis' : 'Diagnóstico Acertado')
      : (isEn ? 'Adverse Organizational Impact' : 'Impacto Organizacional Adverso');

    let consequenceHtml = '';
    if (consequence) {
      const consequenceLabel = isEn ? 'Operational Consequence:' : 'Consecuencia Operativa:';
      consequenceHtml = `
        <div class="rise-feedback-desc">
          <strong>${consequenceLabel}</strong> ${escapeHtml(consequence)}
        </div>
      `;
    }

    this.feedbackContainer.innerHTML = `
      <div class="rise-feedback-card ${cardClass}">
        <div class="rise-feedback-header">
          <span class="rise-feedback-icon" aria-hidden="true">${icon}</span>
          <h4 class="rise-feedback-title">${escapeHtml(heading)}</h4>
        </div>
        <div class="rise-feedback-desc">${escapeHtml(feedback)}</div>
        ${consequenceHtml}
      </div>
    `;
  }

  /**
   * Desbloquea y despliega la Píldora Just-in-Time (Kathy Moore)
   * @param {Object|null} jitPill 
   */
  _renderJitPill(jitPill) {
    if (!this.jitContainer || !jitPill) return;

    const isEn = this.lang === 'en';
    const defaultTitle = isEn
      ? 'Just-In-Time Methodological Pill (Alles)'
      : 'Píldora Metodológica Just-In-Time (Alles)';
    const title = jitPill.title || jitPill.header || defaultTitle;
    const body = jitPill.content || jitPill.body || '';

    let formulaHtml = '';
    if (jitPill.formula) {
      const formulaLabel = isEn ? 'Alles Syntactic Formula:' : 'Fórmula Sintáctica Alles:';
      formulaHtml = `
        <div class="rise-jit-formula-box">
          <span class="rise-jit-section-label">${formulaLabel}</span>
          <div class="rise-jit-formula-code"><code>${escapeHtml(jitPill.formula)}</code></div>
        </div>
      `;
    }

    let levelsHtml = '';
    const levelsList = jitPill.levels || jitPill.degrees || null;
    if (Array.isArray(levelsList) && levelsList.length > 0) {
      const defaultLevelWord = isEn ? 'Level' : 'Nivel';
      const items = levelsList.map(lvl => {
        const key = (lvl.level || lvl.grade || lvl.letter || 'A').toUpperCase();
        const badgeClass = `rise-level-badge--${key.toLowerCase()}`;
        return `
          <li class="rise-jit-level-item">
            <span class="rise-level-badge ${badgeClass}">${escapeHtml(lvl.badge || `${defaultLevelWord} ${key}`)}</span>
            <div class="rise-jit-level-body">
              <strong class="rise-jit-level-name">${escapeHtml(lvl.name || '')}</strong>
              <span class="rise-jit-level-desc">${escapeHtml(lvl.desc || lvl.description || '')}</span>
            </div>
          </li>
        `;
      }).join('');

      const defaultLevelsLabel = isEn
        ? 'BARS Graduation Matrix (Levels A-B-C-D):'
        : 'Matriz de Graduación BARS (Niveles A-B-C-D):';
      const label = jitPill.levelsLabel || defaultLevelsLabel;
      levelsHtml = `
        <div class="rise-jit-levels-box">
          <span class="rise-jit-section-label">${escapeHtml(label)}</span>
          <ul class="rise-jit-levels-list">
            ${items}
          </ul>
        </div>
      `;
    }

    let componentsHtml = '';
    if (!levelsHtml && Array.isArray(jitPill.components) && jitPill.components.length > 0) {
      const gradeWord = isEn ? 'Grade' : 'Grado';
      const exLabel = isEn ? 'Example:' : 'Ejemplo:';
      const contraLabel = isEn ? 'Counter-example:' : 'Contra-ejemplo:';
      const exAria = isEn ? 'Correct example' : 'Ejemplo correcto';
      const contraAria = isEn ? 'Incorrect counter-example' : 'Contra-ejemplo incorrecto';

      const items = jitPill.components.map(c => {
        const badge = c.badge || c.letter || c.num || '•';
        const isGrade = Boolean(c.isGrade || c.isLevel);
        const badgeMarkup = isGrade
          ? `<span class="rise-level-badge rise-level-badge--${String(badge).toLowerCase()}">${gradeWord} ${escapeHtml(String(badge))}</span>`
          : `<span class="rise-jit-badge">${escapeHtml(String(badge))}</span>`;

        let examplesMarkup = '';
        if (c.example || c.contraExample || c.counterExample) {
          const ex = c.example ? `
            <div class="rise-jit-example-row rise-jit-example-row--good">
              <span class="rise-jit-example-tag rise-jit-example-tag--good" aria-label="${exAria}">✓ ${exLabel}</span>
              <span class="rise-jit-example-text">${escapeHtml(c.example)}</span>
            </div>
          ` : '';
          const contra = (c.contraExample || c.counterExample) ? `
            <div class="rise-jit-example-row rise-jit-example-row--bad">
              <span class="rise-jit-example-tag rise-jit-example-tag--bad" aria-label="${contraAria}">✕ ${contraLabel}</span>
              <span class="rise-jit-example-text">${escapeHtml(c.contraExample || c.counterExample)}</span>
            </div>
          ` : '';
          examplesMarkup = `
            <div class="rise-jit-examples-grid">
              ${ex}
              ${contra}
            </div>
          `;
        }

        return `
          <li class="rise-jit-component-item">
            ${badgeMarkup}
            <div class="rise-jit-component-body">
              <div class="rise-jit-component-header">
                <strong class="rise-jit-component-name">${escapeHtml(c.name)}:</strong>
                <span class="rise-jit-component-desc">${escapeHtml(c.desc)}</span>
              </div>
              ${examplesMarkup}
            </div>
          </li>
        `;
      }).join('');

      const defaultCompLabel = isEn ? 'Required Components:' : 'Componentes Requeridos:';
      const label = jitPill.componentsLabel || defaultCompLabel;
      componentsHtml = `
        <div class="rise-jit-components-box">
          <span class="rise-jit-section-label">${escapeHtml(label)}</span>
          <ul class="rise-jit-components-list">
            ${items}
          </ul>
        </div>
      `;
    }

    let takeawaysHtml = '';
    if (Array.isArray(jitPill.takeaways) && jitPill.takeaways.length > 0) {
      const defaultTakeawaysLabel = isEn
        ? 'Key Rules / Golden Rules:'
        : 'Reglas Clave / Reglas de Oro:';
      const label = jitPill.takeawaysLabel || defaultTakeawaysLabel;
      const items = jitPill.takeaways.map(t => {
        const colonIdx = t.indexOf(':');
        const textMarkup = colonIdx !== -1
          ? `<strong class="rise-jit-takeaway-lead">${escapeHtml(t.slice(0, colonIdx + 1))}</strong> <span class="rise-jit-takeaway-desc">${escapeHtml(t.slice(colonIdx + 1).trim())}</span>`
          : `<span class="rise-jit-takeaway-desc">${escapeHtml(t)}</span>`;
        return `
          <li class="rise-jit-takeaway-item">
            <span class="rise-jit-takeaway-icon" aria-hidden="true">⚡</span>
            <div class="rise-jit-takeaway-content">${textMarkup}</div>
          </li>
        `;
      }).join('');

      takeawaysHtml = `
        <div class="rise-jit-takeaways-box" role="region" aria-label="${escapeHtml(label)}">
          <div class="rise-jit-takeaways-header">
            <span class="rise-jit-takeaways-badge" aria-hidden="true">★</span>
            <span class="rise-jit-takeaways-title">${escapeHtml(label)}</span>
          </div>
          <ul class="rise-jit-takeaways-list">
            ${items}
          </ul>
        </div>
      `;
    }

    this.jitContainer.innerHTML = `
      <div class="rise-jit-box">
        <div class="rise-jit-header">
          <span aria-hidden="true">💡</span>
          <span>${escapeHtml(title)}</span>
        </div>
        <div class="rise-jit-body">
          <div class="rise-jit-intro">${body}</div>
          ${formulaHtml}
          ${levelsHtml}
          ${componentsHtml}
          ${takeawaysHtml}
        </div>
      </div>
    `;
  }
}

/**
 * Función factory helper para inicializar y montar un ScenarioBlock
 * Exported Contract oficial según Plan Instruccional
 *
 * @param {HTMLElement|string} container 
 * @param {Object} challengeData 
 * @param {Function|Object} [onResolvedOrOptions]
 * @returns {ScenarioBlock}
 */
export function renderScenarioBlock(container, challengeData, onResolvedOrOptions) {
  let options = { container, challengeData };

  if (typeof onResolvedOrOptions === 'function') {
    options.onResolved = onResolvedOrOptions;
  } else if (onResolvedOrOptions && typeof onResolvedOrOptions === 'object') {
    options = { ...options, ...onResolvedOrOptions };
  }

  const block = new ScenarioBlock(options);
  block.render();
  return block;
}

export { ChallengeEngine };
