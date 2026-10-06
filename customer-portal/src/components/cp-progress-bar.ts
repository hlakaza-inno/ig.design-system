import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.js';

/** Accessible progress indicator. Used for "X of Y approved" and per-file uploads. */
@customElement('cp-progress-bar')
export class CpProgressBar extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property() label = '';
  /** 'primary' (default) | 'success' */
  @property() tone: 'primary' | 'success' = 'primary';

  static styles = [
    sharedStyles,
    css`
      :host { display: block; }
      .track {
        height: 8px;
        border-radius: var(--ig-radius-full);
        background: var(--ig-color-neutral-200);
        overflow: hidden;
      }
      .fill {
        height: 100%;
        border-radius: var(--ig-radius-full);
        background: var(--ig-color-primary-500);
        transition: width var(--ig-duration-slow) var(--ig-easing-default);
      }
      .tone-success .fill { background: var(--ig-color-success-500); }
      .label { margin-top: var(--ig-space-1); color: var(--ig-color-neutral-600); }
    `,
  ];

  render() {
    const pct = this.max > 0 ? Math.min(100, Math.max(0, (this.value / this.max) * 100)) : 0;
    return html`
      <div
        class="track tone-${this.tone}"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.value}
        aria-valuetext=${this.label}
        aria-label=${this.label || 'Progress'}
      >
        <div class="fill" style="width:${pct}%"></div>
      </div>
      ${this.label ? html`<p class="label body-md">${this.label}</p>` : ''}
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cp-progress-bar': CpProgressBar;
  }
}
