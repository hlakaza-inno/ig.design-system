import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared.js';

/** Accessible progress indicator. Used for "X of Y approved" and per-file uploads. */
export class CpProgressBar extends LitElement {
  static properties = {
    value: { type: Number },
    max: { type: Number },
    label: { type: String },
    tone: { type: String }, // 'primary' (default) | 'success'
  };

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

  constructor() {
    super();
    this.value = 0;
    this.max = 100;
    this.label = '';
    this.tone = 'primary';
  }

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
customElements.define('cp-progress-bar', CpProgressBar);
