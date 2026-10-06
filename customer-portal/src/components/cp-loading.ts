import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.js';

/**
 * Skeleton loader shaped like the screen it stands in for.
 * Props: layout 'portal' | 'email'
 */
@customElement('cp-loading')
export class CpLoading extends LitElement {
  @property() layout: 'portal' | 'email' = 'portal';

  static styles = [
    sharedStyles,
    css`
      :host { display: block; }
      .wrap { display: flex; flex-direction: column; gap: var(--ig-space-4); }
      .bone {
        display: block;
        border-radius: var(--ig-radius-md);
        background: linear-gradient(90deg, var(--ig-color-neutral-200) 25%, var(--ig-color-neutral-100) 50%, var(--ig-color-neutral-200) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s linear infinite;
      }
      @keyframes shimmer { to { background-position: -200% 0; } }
      .h1 { height: 32px; width: min(320px, 70%); }
      .line { height: 16px; }
      .w-60 { width: 60%; } .w-40 { width: 40%; } .w-80 { width: 80%; }
      .strip { height: 76px; border-radius: var(--ig-radius-lg); }
      .bar { height: 8px; border-radius: var(--ig-radius-full); }
      .grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--ig-space-4); }
      @media (min-width: 960px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      .card { padding: var(--ig-space-4); display: flex; flex-direction: column; gap: var(--ig-space-3); min-height: 220px; }
      .row { display: flex; justify-content: space-between; align-items: center; gap: var(--ig-space-3); }
      .chip { height: 36px; width: 110px; border-radius: var(--ig-radius-full); flex: none; }
      .tile { height: 56px; width: 56px; border-radius: var(--ig-radius-lg); flex: none; }
      .actions { margin-top: auto; height: 44px; }
      .email { max-width: 680px; margin: 0 auto; }
      .email .card { min-height: 0; padding: var(--ig-space-6); gap: var(--ig-space-4); }
      .cta { height: 44px; width: 200px; }
    `,
  ];

  private _portal() {
    const card = () => html`
      <div class="card" aria-hidden="true">
        <div class="row">
          <div style="flex:1;display:flex;flex-direction:column;gap:8px">
            <span class="bone line w-60"></span><span class="bone line w-40"></span>
          </div>
          <span class="bone chip"></span>
        </div>
        <div class="row" style="justify-content:flex-start">
          <span class="bone tile"></span>
          <div style="flex:1;display:flex;flex-direction:column;gap:8px">
            <span class="bone line w-60"></span><span class="bone line w-40"></span>
          </div>
        </div>
        <span class="bone actions"></span>
      </div>`;
    return html`
      <div class="wrap" aria-hidden="true">
        <div style="display:flex;flex-direction:column;gap:8px"><span class="bone h1"></span><span class="bone line w-60"></span></div>
        <span class="bone strip"></span>
        <span class="bone bar"></span>
        <div class="grid">${card()}${card()}${card()}${card()}</div>
      </div>`;
  }

  private _email() {
    return html`
      <div class="email" aria-hidden="true">
        <div class="card" style="background:var(--ig-color-neutral-0)">
          <span class="bone line w-40"></span>
          <span class="bone line w-80"></span>
          <span class="bone line w-60"></span>
          <span class="bone line w-80"></span>
          <span class="bone cta"></span>
          <span class="bone line w-60"></span>
        </div>
      </div>`;
  }

  render() {
    return html`
      <div role="status" aria-live="polite" aria-busy="true">
        <span class="sr-only">Loading your documents…</span>
        ${this.layout === 'email' ? this._email() : this._portal()}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-loading': CpLoading;
  }
}
