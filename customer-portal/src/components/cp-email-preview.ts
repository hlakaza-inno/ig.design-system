import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LoadPhase, PortalData } from '../lib/types.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import logoUrl from '../assets/ig-logo.png';
import { STATUS, formatDate } from '../lib/rules.js';
import './cp-loading.js';
import './cp-state-screen.js';

/**
 * Step 1 — example email showing how the customer reaches the portal.
 * Props:  phase 'loading' | 'error' | 'ready', data (the valid-link payload)
 * Events: open-portal (CTA clicked), retry (from the error screen)
 */
@customElement('cp-email-preview')
export class CpEmailPreview extends LitElement {
  @property() phase: LoadPhase = 'loading';
  @property({ attribute: false }) data: PortalData | null = null;

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
      .band { background: var(--ig-color-neutral-0); border-bottom: 3px solid var(--ig-color-primary-500); padding: var(--ig-space-4) var(--ig-space-6); }
      .logo { height: 32px; width: auto; display: block; }
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

  private _open(e: Event): void {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('open-portal', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="wrap">
        <p class="caption-top body-md">${icon('mail', 16)}Step 1 of 2 · Example email your customer receives</p>
        ${this._email()}
      </div>`;
  }

  private _email() {
    const d = this.data;
    if (this.phase === 'loading') return html`<cp-loading layout="email"></cp-loading>`;
    if (this.phase === 'error' || !d) return html`<div class="card"><cp-state-screen variant="error"></cp-state-screen></div>`;
    const { customer, request, link } = d;
    const outstanding = d.documents.filter((x) => x.status !== STATUS.APPROVED);
    return html`
        <article class="email" aria-label="Example email">
          <dl class="meta body-md">
            <div><dt>From</dt><dd>no-reply@ig-transfers.example</dd></div>
            <div><dt>To</dt><dd>${customer.email}</dd></div>
            <div><dt>Subject</dt><dd class="subject">Action needed: documents for your ${request.process} request</dd></div>
          </dl>
          <div class="band"><img class="logo" src=${logoUrl} width="125" height="32" alt="Innovation Group" /></div>
          <div class="body body-lg">
            <p>Dear ${customer.name.split(' ')[0]},</p>
            <p>To keep your <strong>${request.process}</strong> request moving (reference <strong>${request.reference}</strong>), we still need these documents from you:</p>
            <ul>${outstanding.map((d) => html`<li>${d.name}</li>`)}</ul>
            <p>You can upload them securely using the button below. You don’t need to log in.</p>
            <a class="btn btn-primary cta" href="#/portal" @click=${this._open}>Upload my documents</a>
            <p class="notice body-md">${icon('clock', 16)}<span>This link is just for you and expires on <strong>${formatDate(link.expiresAt)}</strong>. Please don’t forward this email.</span></p>
            <div>
              <p class="token-label caption">Your secure link (for reference)</p>
              <div class="token" aria-label="Signed link preview">${link.signedUrl}</div>
            </div>
          </div>
        </article>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cp-email-preview': CpEmailPreview;
  }
}
