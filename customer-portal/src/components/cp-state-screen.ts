import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.js';
import { icon, type IconName } from '../lib/icons.js';
import { requestNewLink } from '../lib/api.js';
import type { SupportContact } from '../lib/types.js';

type Tone = 'warning' | 'error' | 'success';
type Variant = 'expired' | 'tampered' | 'complete' | 'error';
const COPY: Record<Variant, { icon: IconName; tone: Tone; title: string; body: string }> = {
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
    body: 'We’ve received and approved everything we asked for. You don’t need to do anything else.',
  },
  error: {
    icon: 'alert-circle',
    tone: 'error',
    title: 'We couldn’t load your documents',
    body: 'Something went wrong on our side. Check your connection and try again.',
  },
};

/**
 * Full-card terminal states.
 * Props:  variant 'expired' | 'tampered' | 'complete' | 'error'
 *         maskedEmail   shown after a new link is requested (expired)
 *         support       contact details (tampered)
 *         customerName  personalises the complete message
 * Events: request-new-link (expired), retry (error)
 */
@customElement('cp-state-screen')
export class CpStateScreen extends LitElement {
  @property() variant: Variant = 'expired';
  @property() maskedEmail = '';
  @property({ attribute: false }) support: SupportContact | null = null;
  @property() customerName = '';
  @state() private _sending = false;
  @state() private _sent = false;

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

  private async _requestLink(): Promise<void> {
    this._sending = true;
    await requestNewLink();
    this._sending = false;
    this._sent = true;
    this.dispatchEvent(new CustomEvent('request-new-link', { bubbles: true, composed: true }));
  }

  private _action() {
    if (this.variant === 'expired') {
      return this._sent
        ? html`<div class="alert alert-success" role="status">
            ${icon('check-circle', 20)}
            <div>We’ve emailed a new link to <strong>${this.maskedEmail}</strong>. It can take a few minutes to arrive — check your spam folder too.</div>
          </div>`
        : html`<button class="btn btn-primary" ?disabled=${this._sending} @click=${this._requestLink}>
            ${icon('mail', 18)}${this._sending ? 'Sending…' : 'Email me a new link'}
          </button>`;
    }
    if (this.variant === 'tampered' && this.support) {
      const { email, phone } = this.support;
      return html`<div class="support body-md">
        <span class="muted">Still stuck? Our support team can help.</span>
        <a href="mailto:${email}">${icon('mail', 18)}${email}</a>
        <a href="tel:${phone.replace(/\s/g, '')}">${icon('phone', 18)}${phone}</a>
      </div>`;
    }
    if (this.variant === 'error') {
      return html`<button class="btn btn-primary"
        @click=${() => this.dispatchEvent(new CustomEvent('retry', { bubbles: true, composed: true }))}>Try again</button>`;
    }
    return '';
  }

  render() {
    const c = COPY[this.variant] ?? COPY.tampered;
    const first = this.customerName.split(' ')[0];
    const body = this.variant === 'complete' && first ? `Thank you, ${first}. ${c.body}` : c.body;
    return html`
      <section class="state" aria-labelledby="title">
        <div class="badge-icon tone-${c.tone}">${icon(c.icon, 32)}</div>
        <h2 id="title">${c.title}</h2>
        <p class="lead body-lg">${body}</p>
        ${this._action()}
      </section>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cp-state-screen': CpStateScreen;
  }
}
