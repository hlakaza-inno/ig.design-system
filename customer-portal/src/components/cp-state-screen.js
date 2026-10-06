import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { customer, support } from '../data/mock.js';

const COPY = {
  expired: {
    icon: 'clock',
    tone: 'warning',
    title: 'This link has expired',
    body: 'For your security, upload links only work for a limited time. We can email you a new one — it will go to the address we have on file.',
  },
  tampered: {
    icon: 'ban',
    tone: 'error',
    title: 'This link isn’t valid',
    body: 'We couldn’t check this link. Please use the link exactly as it appears in your email — don’t change or shorten it.',
  },
  complete: {
    icon: 'check-circle',
    tone: 'success',
    title: 'All documents approved',
    body: 'Thank you, Thandi. We’ve received and approved everything we asked for. You don’t need to do anything else.',
  },
};

/**
 * Full-card terminal states.
 * Props:  variant 'expired' | 'tampered' | 'complete'
 * Events: request-new-link (expired only)
 */
export class CpStateScreen extends LitElement {
  static properties = {
    variant: { type: String },
    _sending: { state: true },
    _sent: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      :host { display: block; }
      .state {
        text-align: center;
        padding: var(--ig-space-10) var(--ig-space-6);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ig-space-3);
      }
      .badge-icon {
        width: 64px;
        height: 64px;
        border-radius: var(--ig-radius-full);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--ig-space-2);
      }
      .tone-warning { background: var(--ig-color-warning-50); color: var(--ig-color-warning-700); }
      .tone-error { background: var(--ig-color-error-50); color: var(--ig-color-error-700); }
      .tone-success { background: var(--ig-color-success-50); color: var(--ig-color-success-700); }
      h2 { font-family: var(--ig-font-family-display); font-size: var(--ig-text-2xl); line-height: var(--ig-leading-2xl); font-weight: 600; }
      .lead { max-width: 440px; color: var(--ig-color-neutral-600); }
      .alert { text-align: left; max-width: 440px; width: 100%; }
      .support { margin-top: var(--ig-space-2); display: flex; flex-direction: column; gap: var(--ig-space-2); align-items: center; }
      .support a { color: var(--ig-color-primary-500); font-weight: 500; text-decoration: underline; display: inline-flex; align-items: center; gap: var(--ig-space-2); min-height: 44px; }
      .btn[disabled] { opacity: .7; }
    `,
  ];

  constructor() {
    super();
    this.variant = 'expired';
    this._sending = false;
    this._sent = false;
  }

  async _requestLink() {
    this._sending = true;
    // Mocked: pretend the API call takes a moment, then confirm.
    await new Promise((r) => setTimeout(r, 900));
    this._sending = false;
    this._sent = true;
    this.dispatchEvent(new CustomEvent('request-new-link', { bubbles: true, composed: true }));
  }

  _action() {
    if (this.variant === 'expired') {
      return this._sent
        ? html`<div class="alert alert-success" role="status">
            ${icon('check-circle', 20)}
            <div>We’ve emailed a new link to <strong>${customer.maskedEmail}</strong>. It can take a few minutes to arrive — check your spam folder too.</div>
          </div>`
        : html`<button class="btn btn-primary" ?disabled=${this._sending} @click=${this._requestLink}>
            ${icon('mail', 18)}${this._sending ? 'Sending…' : 'Email me a new link'}
          </button>`;
    }
    if (this.variant === 'tampered') {
      return html`<div class="support body-md">
        <span class="muted">Still stuck? Our support team can help.</span>
        <a href="mailto:${support.email}">${icon('mail', 18)}${support.email}</a>
        <a href="tel:${support.phone.replace(/\s/g, '')}">${icon('phone', 18)}${support.phone}</a>
      </div>`;
    }
    return '';
  }

  render() {
    const c = COPY[this.variant] ?? COPY.tampered;
    return html`
      <section class="state" aria-labelledby="title">
        <div class="badge-icon tone-${c.tone}">${icon(c.icon, 32)}</div>
        <h2 id="title">${c.title}</h2>
        <p class="lead body-lg">${c.body}</p>
        ${this._action()}
      </section>`;
  }
}
customElements.define('cp-state-screen', CpStateScreen);
