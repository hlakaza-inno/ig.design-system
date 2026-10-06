import { LitElement, html, css } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { sharedStyles } from '../styles/shared.js';
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
  };

  static styles = [
    sharedStyles,
    css`
      :host { display: block; min-height: 100vh; background: var(--ig-color-neutral-50); }
      .demo {
        background: var(--ig-color-primary-900);
        color: var(--ig-color-neutral-100);
        padding: var(--ig-space-2) var(--ig-space-4);
        display: flex; flex-wrap: wrap; align-items: center; gap: var(--ig-space-2) var(--ig-space-3);
      }
      .demo .tag { color: var(--ig-color-accent-500); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
      .demo label { display: inline-flex; align-items: center; gap: var(--ig-space-2); }
      .demo select, .demo button {
        min-height: 36px; padding: 0 var(--ig-space-3);
        border-radius: var(--ig-radius-md); border: 1px solid var(--ig-color-primary-300);
        background: var(--ig-color-primary-700); color: #fff; font: inherit; cursor: pointer;
      }
      .demo select:focus-visible, .demo button:focus-visible { outline: 2px solid var(--ig-color-accent-500); outline-offset: 2px; }
      .demo .spacer { flex: 1; }
    `,
  ];

  constructor() {
    super();
    this._view = readView();
    this._scenario = readScenario();
    this._runId = 0;
    this._sync = () => {
      this._view = readView();
      this._scenario = readScenario();
    };
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._sync);
    window.addEventListener('popstate', this._sync);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._sync);
    window.removeEventListener('popstate', this._sync);
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
      <div class="demo body-md" role="region" aria-label="Demo controls">
        <span class="tag caption">Demo controls</span>
        <label>Link scenario
          <select @change=${this._setScenario}>
            ${SCENARIOS.map((s) => html`<option value=${s} ?selected=${s === this._scenario}>${SCENARIO_LABEL[s]}</option>`)}
          </select>
        </label>
        <button @click=${() => this._go(inPortal ? 'email' : 'portal')}>${inPortal ? '← Back to email' : 'Skip to portal →'}</button>
        <span class="spacer"></span>
        ${inPortal ? html`<button @click=${this._approveAll} title="Stands in for the agent review (out of scope)">Approve all documents</button>` : ''}
        <button @click=${this._reset}>Reset demo</button>
      </div>
      ${inPortal
        ? keyed(this._runId, html`<cp-portal .scenario=${this._scenario}></cp-portal>`)
        : html`<cp-email-preview @open-portal=${() => this._go('portal')}></cp-email-preview>`}`;
  }
}
customElements.define('cp-shell', CpShell);
