/**
 * Theory Drawer - Componente UI Off-Canvas Accesible (Espinas Teóricas On-Demand)
 * Despliega fundamentos teóricos profundos (McClelland, Spencer & Spencer, Jaques, Schmidt)
 * sin interrumpir la Ruta Crítica de Acción ni penalizar/aprobar el curso.
 *
 * Accesibilidad:
 * - Soporte tecla Escape para cerrar
 * - Restauración y gestión de foco accesible
 * - Atributos ARIA (role="dialog", aria-modal="true", aria-hidden, aria-labelledby)
 * - Registro transparente del badge de especialista opcional en CourseStore
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

export class TheoryDrawer {
  /**
   * @param {Object} [options]
   * @param {Object} [options.store] - Instancia de CourseStore para registrar insignias
   * @param {HTMLElement|string} [options.container] - Contenedor raíz donde montar el drawer
   * @param {HTMLElement} [options.drawerElement] - Elemento drawer pre-existente
   * @param {HTMLElement} [options.overlayElement] - Overlay pre-existente
   * @param {Function} [options.onOpen] - Callback al abrir
   * @param {Function} [options.onClose] - Callback al cerrar
   */
  constructor({
    store = null,
    container = null,
    drawerElement = null,
    overlayElement = null,
    onOpen = null,
    onClose = null,
    lang = 'es'
  } = {}) {
    this.store = store;
    this.lang = lang === 'en' ? 'en' : 'es';
    this.container = typeof container === 'string' && typeof document !== 'undefined'
      ? document.querySelector(container)
      : (container || (typeof document !== 'undefined' ? document.body : null));

    this.drawerEl = drawerElement;
    this.overlayEl = overlayElement;
    this.onOpen = typeof onOpen === 'function' ? onOpen : null;
    this.onClose = typeof onClose === 'function' ? onClose : null;

    this.activeContentId = null;
    this.activeData = null;
    this.previousActiveElement = null;
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._globalListenersAttached = false;
    this._domListenersAttached = false;

    if (typeof document !== 'undefined') {
      this._ensureElements();
      this._bindGlobalEvents();
    }
  }

  /**
   * Manejador de clic sobre el overlay para cerrar el drawer
   * @private
   */
  _handleOverlayClick() {
    this.close();
  }

  /**
   * Manejador de clic sobre el botón cerrar
   * @private
   */
  _handleCloseClick() {
    this.close();
  }

  /**
   * Actualiza el idioma activo del drawer y sus etiquetas fijas
   * @param {'es'|'en'} lang
   */
  setLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'es';
    if (this.drawerEl) {
      const closeBtn = this.drawerEl.querySelector('.rise-drawer-close');
      if (closeBtn) {
        closeBtn.setAttribute('aria-label', this.lang === 'en' ? 'Close theory panel' : 'Cerrar panel teórico');
      }
      const taglineEl = this.drawerEl.querySelector('#rise-drawer-tagline-id');
      if (taglineEl && (!this.activeData || !this.activeData.tagline)) {
        taglineEl.textContent = this.lang === 'en' ? 'Optional Theory Spine' : 'Espina Teórica Opcional';
      }
      const titleEl = this.drawerEl.querySelector('#rise-drawer-title-id');
      if (titleEl && (!this.activeData || !this.activeData.title)) {
        titleEl.textContent = this.lang === 'en' ? 'Methodological Foundation' : 'Fundamento Metodológico';
      }
    }
  }

  /**
   * Asegura la existencia de los elementos DOM requeridos
   */
  _ensureElements() {
    if (!this.overlayEl) {
      let overlay = document.querySelector('.rise-drawer-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'rise-drawer-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        if (this.container) this.container.appendChild(overlay);
      }
      this.overlayEl = overlay;
    }

    if (!this.drawerEl) {
      let drawer = document.querySelector('.rise-drawer-theory');
      if (!drawer) {
        drawer = document.createElement('aside');
        drawer.className = 'rise-drawer-theory';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-modal', 'true');
        drawer.setAttribute('aria-hidden', 'true');
        drawer.setAttribute('aria-labelledby', 'rise-drawer-title-id');

        const isEn = this.lang === 'en';
        const taglineText = isEn ? 'Optional Theory Spine' : 'Espina Teórica Opcional';
        const titleText = isEn ? 'Methodological Foundation' : 'Fundamento Metodológico';
        const closeAria = isEn ? 'Close theory panel' : 'Cerrar panel teórico';

        drawer.innerHTML = `
          <header class="rise-drawer-header">
            <div>
              <span class="rise-drawer-tagline" id="rise-drawer-tagline-id">${escapeHtml(taglineText)}</span>
              <h3 class="rise-drawer-title" id="rise-drawer-title-id">${escapeHtml(titleText)}</h3>
            </div>
            <button type="button" class="rise-drawer-close" aria-label="${escapeHtml(closeAria)}">
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div class="rise-drawer-body" id="rise-drawer-body-id">
            <div class="rise-drawer-content-serif"></div>
            <div class="rise-drawer-meta-card"></div>
          </div>
        `;
        if (this.container) this.container.appendChild(drawer);
      }
      this.drawerEl = drawer;
    }

    // Vincula eventos de cierre propios del DOM de manera idempotente
    if (!this._domListenersAttached) {
      if (this.overlayEl) {
        if (this.overlayEl._theoryDrawerHandler) {
          this.overlayEl.removeEventListener('click', this.overlayEl._theoryDrawerHandler);
        }
        this.overlayEl._theoryDrawerHandler = this._handleOverlayClick;
        this.overlayEl.addEventListener('click', this._handleOverlayClick);
      }

      const closeBtn = this.drawerEl ? this.drawerEl.querySelector('.rise-drawer-close') : null;
      if (closeBtn) {
        if (closeBtn._theoryDrawerHandler) {
          closeBtn.removeEventListener('click', closeBtn._theoryDrawerHandler);
        }
        closeBtn._theoryDrawerHandler = this._handleCloseClick;
        closeBtn.addEventListener('click', this._handleCloseClick);
      }
      this._domListenersAttached = true;
    }
  }

  /**
   * Vincula el listener global de teclado (Escape) de forma idempotente
   */
  _bindGlobalEvents() {
    if (!this._globalListenersAttached && typeof document !== 'undefined') {
      document.addEventListener('keydown', this._handleKeyDown);
      this._globalListenersAttached = true;
    }
  }

  /**
   * Desvincula el listener global de teclado
   */
  _unbindGlobalEvents() {
    if (this._globalListenersAttached && typeof document !== 'undefined') {
      document.removeEventListener('keydown', this._handleKeyDown);
      this._globalListenersAttached = false;
    }
  }

  /**
   * Manejador de teclado para accesibilidad (tecla ESC y Focus Trap en Tab)
   * @param {KeyboardEvent} e 
   */
  _handleKeyDown(e) {
    if (!this.isOpen()) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'Tab' && this.drawerEl) {
      const focusables = Array.from(this.drawerEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(el => !el.hasAttribute('disabled'));

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !this.drawerEl.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !this.drawerEl.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  /**
   * Conmuta la interactividad del contenido subyacente para lectores de pantalla
   * @private
   * @param {boolean} isInert
   */
  _setUnderlyingInert(isInert) {
    if (typeof document === 'undefined') return;
    const targets = document.querySelectorAll('.rise-top-bar, .rise-body-layout');
    targets.forEach(el => {
      if (isInert) {
        el.setAttribute('aria-hidden', 'true');
        if ('inert' in el) el.inert = true;
      } else {
        el.removeAttribute('aria-hidden');
        if ('inert' in el) el.inert = false;
      }
    });
  }

  /**
   * Consulta si el drawer está actualmente visible
   * @returns {boolean}
   */
  isOpen() {
    if (!this.drawerEl) return false;
    return this.drawerEl.classList.contains('is-open');
  }

  /**
   * Carga el contenido teórico estructurado en el drawer
   * @param {Object} data 
   */
  setContent(data) {
    if (!this.drawerEl || !data) return;

    this.activeData = data;
    const taglineEl = this.drawerEl.querySelector('#rise-drawer-tagline-id');
    const titleEl = this.drawerEl.querySelector('#rise-drawer-title-id');
    const contentEl = this.drawerEl.querySelector('.rise-drawer-content-serif');
    const metaEl = this.drawerEl.querySelector('.rise-drawer-meta-card');

    if (taglineEl && data.tagline) {
      taglineEl.textContent = data.tagline;
    }
    if (titleEl && data.title) {
      titleEl.textContent = data.title;
    }
    if (contentEl && (data.content || data.html)) {
      contentEl.innerHTML = data.content || data.html;
    }
    if (metaEl) {
      if (data.citation || data.author || data.source) {
        const isEn = this.lang === 'en';
        const refHeader = isEn ? '🎓 Academic & Methodological Reference:' : '🎓 Referencia Académica & Metodológica:';
        metaEl.style.display = 'block';
        metaEl.innerHTML = `
          <strong>${refHeader}</strong>
          <div style="margin-top: 0.35rem;">
            ${data.author ? `<span style="font-weight: 700; color: var(--slate-900);">${escapeHtml(data.author)}</span>` : ''}
            ${data.year ? `<span style="color: var(--slate-500);"> (${escapeHtml(data.year)})</span>` : ''}
          </div>
          ${data.source ? `<div style="color: var(--slate-700); font-style: italic; margin-top: 0.2rem;">${escapeHtml(data.source)}</div>` : ''}
          ${data.citation ? `<p style="margin-top: 0.5rem; font-size: 0.84rem; color: var(--slate-600); border-top: 1px dashed var(--slate-200); padding-top: 0.45rem; line-height: 1.5;">${escapeHtml(data.citation)}</p>` : ''}
        `;
      } else {
        metaEl.style.display = 'none';
      }
    }
  }

  /**
   * Abre el panel off-canvas con el contenido solicitado
   * @param {string} [contentId] - ID del contenido o badge
   * @param {Object} [data] - DTO opcional del contenido teórico
   */
  open(contentId = null, data = null) {
    if (typeof document === 'undefined') return;
    this._ensureElements();
    this._bindGlobalEvents();

    this.activeContentId = contentId;
    if (data) {
      this.setContent(data);
    }

    if (document.activeElement && document.activeElement !== document.body) {
      this.previousActiveElement = document.activeElement;
    }

    if (this.overlayEl) {
      this.overlayEl.classList.add('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'false');
    }

    if (this.drawerEl) {
      this.drawerEl.classList.add('is-open');
      this.drawerEl.setAttribute('aria-hidden', 'false');

      // Aislar contenido de fondo mientras el modal está activo
      this._setUnderlyingInert(true);

      // Foco accesible al botón de cerrar
      const closeBtn = this.drawerEl.querySelector('.rise-drawer-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    }

    // Registro de badge opcional en CourseStore sin afectar aprobación
    if (this.store && typeof this.store.dispatchAction === 'function') {
      const badgeId = (data && data.badgeId) || contentId;
      const moduleId = (data && data.moduleId) || 'mod-theory';
      if (badgeId) {
        this.store.dispatchAction('VIEW_THEORY_DRAWER', {
          moduleId,
          badgeId
        });
      }
    }

    if (this.onOpen) {
      this.onOpen(contentId, data);
    }
  }

  /**
   * Cierra el panel off-canvas y devuelve el foco al elemento previo
   */
  close() {
    if (typeof document === 'undefined') return;

    if (this.overlayEl) {
      this.overlayEl.classList.remove('is-open');
      this.overlayEl.setAttribute('aria-hidden', 'true');
    }

    if (this.drawerEl) {
      this.drawerEl.classList.remove('is-open');
      this.drawerEl.setAttribute('aria-hidden', 'true');
    }

    // Restaurar interactividad del contenido de fondo
    this._setUnderlyingInert(false);

    // Restauración de foco accesible
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }

    if (this.onClose) {
      this.onClose();
    }
  }

  /**
   * Alterna la visibilidad del drawer
   * @param {string} [contentId]
   * @param {Object} [data]
   */
  toggle(contentId = null, data = null) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(contentId, data);
    }
  }

  /**
   * Desconecta listeners globales y locales al destruir el componente
   */
  destroy() {
    this._unbindGlobalEvents();
    if (this.overlayEl && this._handleOverlayClick) {
      this.overlayEl.removeEventListener('click', this._handleOverlayClick);
      if (this.overlayEl._theoryDrawerHandler === this._handleOverlayClick) {
        delete this.overlayEl._theoryDrawerHandler;
      }
    }
    const closeBtn = this.drawerEl ? this.drawerEl.querySelector('.rise-drawer-close') : null;
    if (closeBtn && this._handleCloseClick) {
      closeBtn.removeEventListener('click', this._handleCloseClick);
      if (closeBtn._theoryDrawerHandler === this._handleCloseClick) {
        delete closeBtn._theoryDrawerHandler;
      }
    }
    this._domListenersAttached = false;
  }
}
