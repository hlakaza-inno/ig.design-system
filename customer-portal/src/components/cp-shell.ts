import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { LoadPhase, PortalResponse, Scenario } from '../lib/types.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { SCENARIOS, fetchPortal } from '../lib/api.js';
import './cp-email-preview.js';
import './cp-portal.js';

const SCENARIO_LABEL: Record<Scenario, string> = { valid: 'Valid link', expired: 'Expired token', tampered: 'Invalid / tampered' };

const readScenario = (): Scenario => {
  const s = new URLSearchParams(location.search).get('scenario');
  return SCENARIOS.find((x) => x === s) ?? 'valid';
};
const readView = (): 'email' | 'portal' => (location.hash.startsWith('#/portal') ? 'portal' : 'email');

/**
 * App shell / router. Hash routes: `#/` (email) and `#/portal`.
 * Demo scenario via `?scenario=valid|expired|tampered`.
 * Owns loading: the email example always loads a valid link; the portal loads
 * with the chosen scenario, as the real link click would.
 */
@customElement('cp-shell')
export class CpShell extends LitElement {
  @state() private _view: 'email' | 'portal' = readView();
  @state() private _scenario: Scenario = readScenario();
  @state() private _phase: LoadPhase = 'loading';
  @state() private _response: PortalResponse | null = null;
  private _abort?: AbortController;
  @state() private _panelOpen = false;

  private readonly _sync = (): void => {
    const view = readView();
    const scenario = readScenario();
    if (view === this._view && scenario === this._scenario) return;
    this._view = view;
    this._scenario = scenario;
    void this._load();
  };

  private readonly _onDocClick = (e: MouseEvent): void => {
    const demo = this.renderRoot.querySelector('.demo');
    if (this._panelOpen && demo && !e.composedPath().includes(demo)) this._panelOpen = false;
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

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('hashchange', this._sync);
    window.addEventListener('popstate', this._sync);
    document.addEventListener('click', this._onDocClick);
    void this._load();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._sync);
    window.removeEventListener('popstate', this._sync);
    document.removeEventListener('click', this._onDocClick);
    this._abort?.abort();
  }

  /** Fetch from the mocked API; a newer request cancels the one in flight. */
  private async _load(fail = false): Promise<void> {
    this._abort?.abort();
    const ctrl = new AbortController();
    this._abort = ctrl;
    this._phase = 'loading';
    this._response = null;
    try {
      const scenario = this._view === 'portal' ? this._scenario : 'valid';
      this._response = await fetchPortal({ scenario, fail, signal: ctrl.signal });
      this._phase = 'ready';
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      this._phase = 'error';
    }
  }

  private _go(view: 'email' | 'portal'): void {
    location.hash = view === 'portal' ? '#/portal' : '#/';
  }

  private _setScenario(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as Scenario;
    const url = new URL(location.href);
    if (value === 'valid') url.searchParams.delete('scenario');
    else url.searchParams.set('scenario', value);
    history.replaceState(null, '', url);
    this._scenario = value;
    void this._load();
  }

  private _reset(): void {
    void this._load(); // fresh mock data; the portal resets its working copy
  }

  private _approveAll(): void {
    this.renderRoot.querySelector('cp-portal')?.approveAll();
  }

  render() {
    const inPortal = this._view === 'portal';
    return html`
      <div class="demo body-md" @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && (this._panelOpen = false)}>
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
              <button class="btn btn-secondary" @click=${() => void this._load(true)}>Simulate load error</button>
            </div>`
          : ''}
        <button class="cog" aria-label="Demo settings" aria-expanded=${this._panelOpen} aria-controls="demo-panel"
          @click=${() => (this._panelOpen = !this._panelOpen)}>${icon('settings', 22)}</button>
      </div>
      ${inPortal
        ? html`<cp-portal .phase=${this._phase} .response=${this._response}
            @retry=${() => void this._load()}></cp-portal>`
        : html`<cp-email-preview .phase=${this._phase}
            .data=${this._response?.status === 'valid' ? this._response.data : null}
            @open-portal=${() => this._go('portal')}
            @retry=${() => void this._load()}></cp-email-preview>`}`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cp-shell': CpShell;
  }
}
