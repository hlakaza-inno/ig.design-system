import { LitElement, html, css } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { SCENARIOS } from '../data/mock.js';
import './cp-email-preview.js';
import './cp-portal.js';

const SCENARIO_LABEL = { valid: 'Valid link', expired: 'Expired token', tampered: 'Invalid / tampered' };

const readScenario = () => {
  const s = new URLSearchParams(location.search).get('scenario');
  return SCENARIOS.includes(s) ? s : 'valid';
};
const readView = () => (location.hash.startsWith('#/portal') ? 'portal' : 'email');

/**
 * App shell / router. Hash routes: `#/` (email) and `#/portal`.
 * Demo scenario via `?scenario=valid|expired|tampered`.
 */
export class CpShell extends LitElement {
  static properties = {
    _view: { state: true },
    _scenario: { state: true },
    _runId: { state: true },
    _panelOpen: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      :host { display: block; min-height: 100vh; background: var(--ig-color-neutral-50); }
      .demo { position: fixed; right: var(--ig-space-4); bottom: var(--ig-space-4); z-index: 10; display: flex; flex-direction: column; align-items: flex-end; gap: var(--ig-space-2); }
      .cog {
        width: 44px; height: 44px; display: grid; place-items: center; padding: 0;
        border-radius: var(--ig-radius-full); border: 0; cursor: pointer;
        background: var(--ig-color-primary-500); color: #fff; box-shadow: var(--ig-shadow-md);
        opacity: .55; transition: opacity var(--ig-duration-normal) var(--ig-easing-default);
      }
      .cog:hover, .cog:focus-visible, .cog[aria-expanded='true'] { opacity: 1; }
      .cog:focus-visible { outline: 2px solid var(--ig-color-primary-500); outline-offset: 2px; }
      .panel {
        width: min(280px, calc(100vw - 32px)); padding: var(--ig-space-4);
        display: flex; flex-direction: column; gap: var(--ig-space-3);
        background: var(--ig-color-neutral-0); border: 1px solid var(--ig-color-neutral-200);
        border-radius: var(--ig-radius-lg); box-shadow: var(--ig-shadow-xl);
      }
      .panel h2 { font-size: var(--ig-text-sm); font-weight: 600; }
      .panel label { display: flex; flex-direction: column; gap: var(--ig-space-1); color: var(--ig-color-neutral-600); }
      .panel select {
        min-height: 44px; padding: 0 var(--ig-space-3); font: inherit; color: var(--ig-color-neutral-900);
        border: 1px solid var(--ig-color-neutral-300); border-radius: var(--ig-radius-md); background: #fff;
      }
      .panel select:focus-visible { outline: 2px solid var(--ig-color-primary-500); outline-offset: 2px; }
    `,
  ];

  constructor() {
    super();
    this._view = readView();
    this._scenario = readScenario();
    this._runId = 0;
    this._panelOpen = false;
    this._onDocClick = (e) => {
      if (this._panelOpen && !e.composedPath().includes(this.renderRoot.querySelector('.demo'))) this._panelOpen = false;
    };
    this._sync = () => {
      this._view = readView();
      this._scenario = readScenario();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._sync);
    window.addEventListener('popstate', this._sync);
    document.addEventListener('click', this._onDocClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._sync);
    window.removeEventListener('popstate', this._sync);
    document.removeEventListener('click', this._onDocClick);
  }

  _go(view) {
    location.hash = view === 'portal' ? '#/portal' : '#/';
  }

  _setScenario(e) {
    const url = new URL(location.href);
    if (e.target.value === 'valid') url.searchParams.delete('scenario');
    else url.searchParams.set('scenario', e.target.value);
    history.replaceState(null, '', url);
    this._scenario = e.target.value;
  }

  _reset() {
    this._runId += 1; // remount portal with fresh mock data
  }

  _approveAll() {
    this.renderRoot.querySelector('cp-portal')?.approveAll();
  }

  render() {
    const inPortal = this._view === 'portal';
    return html`
      <div class="demo body-md" @keydown=${(e) => e.key === 'Escape' && (this._panelOpen = false)}>
        ${this._panelOpen
          ? html`<div class="panel" id="demo-panel" role="group" aria-labelledby="demo-title">
              <h2 id="demo-title">Demo settings</h2>
              <label>Link scenario
                <select @change=${this._setScenario}>
                  ${SCENARIOS.map((s) => html`<option value=${s} ?selected=${s === this._scenario}>${SCENARIO_LABEL[s]}</option>`)}
                </select>
              </label>
              <button class="btn btn-secondary" @click=${() => this._go(inPortal ? 'email' : 'portal')}>${inPortal ? '← Back to email' : 'Skip to portal →'}</button>
              ${inPortal ? html`<button class="btn btn-secondary" @click=${this._approveAll}>Approve all documents</button>` : ''}
              <button class="btn btn-secondary" @click=${this._reset}>Reset demo</button>
            </div>`
          : ''}
        <button class="cog" aria-label="Demo settings" aria-expanded=${this._panelOpen} aria-controls="demo-panel"
          @click=${() => (this._panelOpen = !this._panelOpen)}>${icon('settings', 22)}</button>
      </div>
      ${inPortal
        ? keyed(this._runId, html`<cp-portal .scenario=${this._scenario}></cp-portal>`)
        : html`<cp-email-preview @open-portal=${() => this._go('portal')}></cp-email-preview>`}`;
  }
}
customElements.define('cp-shell', CpShell);
