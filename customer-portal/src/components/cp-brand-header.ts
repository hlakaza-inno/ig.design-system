import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import logoUrl from '../assets/ig-logo.png';

/** Portal brand header: logo + "Document Upload | Secure customer portal". */
@customElement('cp-brand-header')
export class CpBrandHeader extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host { display: block; background: var(--ig-color-neutral-0); border-bottom: 1px solid var(--ig-color-neutral-200); }
      /* Phones: pinned to the top so the brand and secure-link cue are always in view. */
      @media (max-width: 639px) { :host { position: sticky; top: 0; z-index: 5; } }
      .inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--ig-space-3) var(--ig-space-4);
        display: flex;
        align-items: center;
        gap: var(--ig-space-3);
      }
      @media (min-width: 640px) { .inner { padding-left: var(--ig-space-6); padding-right: var(--ig-space-6); } }
      @media (min-width: 1024px) { .inner { padding-left: var(--ig-space-8); padding-right: var(--ig-space-8); } }
      .logo { height: 32px; width: auto; flex: none; display: block; }
      .divider { width: 1px; align-self: stretch; background: var(--ig-color-neutral-200); flex: none; }
      .title { font-weight: 600; color: var(--ig-color-primary-500); }
      .secure { margin-left: auto; display: inline-flex; align-items: center; gap: var(--ig-space-1); color: var(--ig-color-neutral-600); }
      @media (max-width: 479px) { .secure span { display: none; } }
    `,
  ];

  render() {
    return html`
      <header class="inner">
        <img class="logo" src=${logoUrl} width="125" height="32" alt="Innovation Group" />
        <span class="divider" aria-hidden="true"></span>
        <div>
          <div class="title body-lg">Document Upload</div>
          <div class="caption muted">Secure customer portal</div>
        </div>
        <span class="secure caption">${icon('lock', 14)}<span>Secure link</span></span>
      </header>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cp-brand-header': CpBrandHeader;
  }
}
