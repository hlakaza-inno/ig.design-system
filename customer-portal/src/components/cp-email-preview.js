import { LitElement, html, css } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { STATUS, formatDate } from '../lib/rules.js';
import { SIGNED_LINK, createDocs, createLinkExpiry, customer } from '../data/mock.js';

/**
 * Step 1 — example email showing how the customer reaches the portal.
 * Events: open-portal (CTA clicked)
 */
export class CpEmailPreview extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host { display: block; }
      .wrap { max-width: 680px; margin: 0 auto; padding: var(--ig-space-4); }
      .caption-top { margin-bottom: var(--ig-space-3); color: var(--ig-color-neutral-600); display: flex; align-items: center; gap: var(--ig-space-2); }
      .email { background: var(--ig-color-neutral-0); border: 1px solid var(--ig-color-neutral-200); border-radius: var(--ig-radius-lg); box-shadow: var(--ig-shadow-sm); overflow: hidden; }
      dl.meta { margin: 0; background: var(--ig-color-neutral-100); padding: var(--ig-space-4); color: var(--ig-color-neutral-600); display: grid; gap: var(--ig-space-1); }
      dl.meta div { display: flex; gap: var(--ig-space-2); }
      dl.meta dt { color: var(--ig-color-neutral-900); font-weight: 600; flex: none; min-width: 64px; }
      dl.meta dd { margin: 0; overflow-wrap: anywhere; }
      dl.meta .subject { color: var(--ig-color-neutral-900); font-weight: 600; }
      .band { background: var(--ig-color-primary-500); color: #fff; padding: var(--ig-space-4) var(--ig-space-6); display: flex; align-items: center; gap: var(--ig-space-3); }
      .logo { width: 36px; height: 36px; border-radius: var(--ig-radius-md); background: var(--ig-color-accent-500); color: var(--ig-color-primary-500); display: grid; place-items: center; font-family: var(--ig-font-family-display); font-weight: 700; }
      .body { padding: var(--ig-space-6); display: flex; flex-direction: column; gap: var(--ig-space-4); color: var(--ig-color-neutral-800); }
      ul { margin: 0; padding-left: var(--ig-space-5); display: grid; gap: var(--ig-space-1); }
      .cta { align-self: flex-start; }
      @media (max-width: 480px) { .cta { align-self: stretch; } .body { padding: var(--ig-space-4); } .band { padding: var(--ig-space-3) var(--ig-space-4); } }
      .notice { display: flex; gap: var(--ig-space-2); color: var(--ig-color-neutral-600); }
      .notice svg { flex: none; margin-top: 2px; }
      .token-label { color: var(--ig-color-neutral-600); margin-bottom: var(--ig-space-1); }
      .token {
        font-family: var(--ig-font-family-mono);
        font-size: var(--ig-text-xs);
        line-height: var(--ig-leading-sm);
        background: var(--ig-color-neutral-100);
        border: 1px solid var(--ig-color-neutral-200);
        border-radius: var(--ig-radius-md);
        padding: var(--ig-space-3);
        color: var(--ig-color-neutral-600);
        overflow-wrap: anywhere;
        user-select: all;
      }
    `,
  ];

  constructor() {
    super();
    this._outstanding = createDocs().filter((d) => d.status !== STATUS.APPROVED);
    this._expiry = createLinkExpiry();
  }

  _open(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('open-portal', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="wrap">
        <p class="caption-top body-md">${icon('mail', 16)}Step 1 of 2 · Example email your customer receives</p>
        <article class="email" aria-label="Example email">
          <dl class="meta body-md">
            <div><dt>From</dt><dd>no-reply@ig-transfers.example</dd></div>
            <div><dt>To</dt><dd>${customer.email}</dd></div>
            <div><dt>Subject</dt><dd class="subject">Action needed: documents for your ${customer.process} request</dd></div>
          </dl>
          <div class="band"><div class="logo" aria-hidden="true">IG</div><span class="heading-sm">Innovation Group</span></div>
          <div class="body body-lg">
            <p>Dear ${customer.name.split(' ')[0]},</p>
            <p>To keep your <strong>${customer.process}</strong> request moving (reference <strong>${customer.reference}</strong>), we still need these documents from you:</p>
            <ul>${this._outstanding.map((d) => html`<li>${d.name}</li>`)}</ul>
            <p>You can upload them securely using the button below. You don’t need to log in.</p>
            <a class="btn btn-primary cta" href="#/portal" @click=${this._open}>Upload my documents</a>
            <p class="notice body-md">${icon('clock', 16)}<span>This link is just for you and expires on <strong>${formatDate(this._expiry)}</strong>. Please don’t forward this email.</span></p>
            <div>
              <p class="token-label caption">Your secure link (for reference)</p>
              <div class="token" aria-label="Signed link preview">${SIGNED_LINK}</div>
            </div>
          </div>
        </article>
      </div>`;
  }
}
customElements.define('cp-email-preview', CpEmailPreview);
