import { LitElement, html, css, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { STATUS, allApproved, formatDate, validateFiles } from '../lib/rules.js';
import { createDocs, createLinkExpiry, customer } from '../data/mock.js';
import './cp-doc-card.js';
import './cp-progress-bar.js';
import './cp-state-screen.js';
import './cp-preview-modal.js';

const UPLOAD_MS = 900;

/** Most urgent first: rejected → requested → submitted (awaiting review) → approved. */
const PRIORITY = [STATUS.REJECTED, STATUS.REQUESTED, STATUS.SUBMITTED, STATUS.APPROVED];
const byPriority = (docs) =>
  [...docs].sort((a, b) => PRIORITY.indexOf(a.status) - PRIORITY.indexOf(b.status)); // stable sort

/**
 * Step 2 — Customer Portal.
 * Props: scenario 'valid' | 'expired' | 'tampered'
 * State: documents, per-document errors and in-flight uploads live here (no globals).
 * Public: approveAll() — demo helper that stands in for the (out-of-scope) agent review.
 */
export class CpPortal extends LitElement {
  static properties = {
    scenario: { type: String },
    _docs: { state: true },
    _errors: { state: true },
    _uploads: { state: true }, // { [id]: { progress, name } }
    _previewId: { state: true },
    _announce: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      :host { display: block; min-height: 100%; }
      header.brand {
        background: var(--ig-color-neutral-0);
        border-bottom: 1px solid var(--ig-color-neutral-200);
      }
      .brand-inner {
        max-width: 640px;
        margin: 0 auto;
        padding: var(--ig-space-3) var(--ig-space-4);
        display: flex;
        align-items: center;
        gap: var(--ig-space-3);
      }
      .logo {
        width: 40px; height: 40px; flex: none;
        border-radius: var(--ig-radius-lg);
        background: var(--ig-color-primary-500);
        color: var(--ig-color-accent-500);
        font-family: var(--ig-font-family-display);
        font-weight: 700; font-size: var(--ig-text-lg);
        display: grid; place-items: center;
      }
      .brand-title { font-weight: 600; color: var(--ig-color-primary-500); }
      .secure { margin-left: auto; display: inline-flex; align-items: center; gap: var(--ig-space-1); color: var(--ig-color-neutral-600); }

      main { max-width: 640px; margin: 0 auto; padding: var(--ig-space-4) var(--ig-space-4) var(--ig-space-16); display: flex; flex-direction: column; gap: var(--ig-space-4); }
      @media (min-width: 640px) { main { padding-top: var(--ig-space-6); } }

      h1 { font-family: var(--ig-font-family-display); font-size: var(--ig-text-2xl); line-height: var(--ig-leading-2xl); font-weight: 600; }
      .intro p { margin-top: var(--ig-space-1); color: var(--ig-color-neutral-600); }

      dl.ref {
        margin: 0;
        padding: var(--ig-space-4);
        background: var(--ig-color-primary-50);
        border-radius: var(--ig-radius-lg);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--ig-space-3) var(--ig-space-4);
      }
      dl.ref dt { color: var(--ig-color-neutral-600); }
      dl.ref dd { margin: 0; font-weight: 600; color: var(--ig-color-primary-700); }

      .progress-wrap { padding: 0 var(--ig-space-1); }
      .docs { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--ig-space-3); }
      .state-card { padding: 0; }
      footer.help { text-align: center; color: var(--ig-color-neutral-500); }
    `,
  ];

  constructor() {
    super();
    this.scenario = 'valid';
    this._docs = createDocs();
    this._errors = {};
    this._uploads = {};
    this._previewId = null;
    this._announce = '';
    this._expiry = createLinkExpiry();
    this._timers = new Map();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._timers.forEach((t) => clearInterval(t));
    this._timers.clear();
    this._docs.forEach((d) => d.blobUrl && URL.revokeObjectURL(d.blobUrl));
  }

  /** Demo helper standing in for the agent review screen. */
  approveAll() {
    this._previewId = null;
    this._docs = this._docs.map((d) => ({ ...d, status: STATUS.APPROVED, rejectionReason: null }));
  }

  get _linkValid() {
    return this.scenario === 'valid';
  }

  _patchDoc(id, patch) {
    this._docs = this._docs.map((d) => (d.id === id ? { ...d, ...patch } : d));
  }

  _setError(id, message) {
    this._errors = { ...this._errors, [id]: message };
  }

  _onFilesSelected({ detail: { id, files } }) {
    const doc = this._docs.find((d) => d.id === id);
    // Business rules: link must be valid, doc not locked, one upload at a time per document.
    if (!this._linkValid || doc.status === STATUS.APPROVED || this._uploads[id]) return;

    const error = validateFiles(files);
    this._setError(id, error);
    if (error) return;
    this._startUpload(doc, files[0]);
  }

  _startUpload(doc, file) {
    const { id } = doc;
    this._uploads = { ...this._uploads, [id]: { progress: 0, name: file.name } };
    const step = 100 / (UPLOAD_MS / 90);
    const timer = setInterval(() => {
      const progress = Math.min(100, this._uploads[id].progress + step);
      this._uploads = { ...this._uploads, [id]: { ...this._uploads[id], progress } };
      if (progress >= 100) {
        clearInterval(timer);
        this._timers.delete(id);
        this._finishUpload(id, file);
      }
    }, 90);
    this._timers.set(id, timer);
  }

  _finishUpload(id, file) {
    const prev = this._docs.find((d) => d.id === id);
    if (prev.blobUrl) URL.revokeObjectURL(prev.blobUrl); // single file per document type
    this._patchDoc(id, {
      status: STATUS.SUBMITTED,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      blobUrl: URL.createObjectURL(file),
      submissions: prev.submissions + 1,
      rejectionReason: null,
    });
    const { [id]: _done, ...rest } = this._uploads;
    this._uploads = rest;
    this._announce = `${file.name} uploaded for ${prev.name}.`;
  }

  _onView({ detail: { id } }) {
    if (this._linkValid && !allApproved(this._docs)) this._previewId = id;
  }

  _onDownload({ detail: { id } }) {
    const d = this._docs.find((x) => x.id === id);
    if (!this._linkValid || !d?.fileName || allApproved(this._docs)) return;
    // Mocked backend: real session uploads download as-is; seeded files get a stand-in text file.
    const url = d.blobUrl ?? URL.createObjectURL(new Blob([`Prototype stand-in for ${d.fileName}\n`], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: d.fileName });
    a.click();
    if (!d.blobUrl) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  _brand() {
    return html`
      <header class="brand">
        <div class="brand-inner">
          <div class="logo" aria-hidden="true">IG</div>
          <div>
            <div class="brand-title body-lg">Document Upload</div>
            <div class="caption muted">Secure customer portal</div>
          </div>
          <span class="secure caption">${icon('lock', 14)}Secure link</span>
        </div>
      </header>`;
  }

  _active() {
    const total = this._docs.length;
    const approved = this._docs.filter((d) => d.status === STATUS.APPROVED).length;
    const rejected = this._docs.filter((d) => d.status === STATUS.REJECTED).length;
    return html`
      <div class="intro">
        <h1>Upload your documents</h1>
        <p class="body-lg">Hi ${customer.name.split(' ')[0]}, we need a few documents to continue your request.</p>
      </div>

      <dl class="ref body-md" aria-label="Request details">
        <div><dt>Request</dt><dd>${customer.process}</dd></div>
        <div><dt>Reference</dt><dd>${customer.reference}</dd></div>
        <div><dt>Customer</dt><dd>${customer.name}</dd></div>
        <div><dt>Link expires</dt><dd>${formatDate(this._expiry)}</dd></div>
      </dl>

      ${rejected
        ? html`<div class="alert alert-error" role="alert">
            ${icon('alert-circle', 20)}
            <div><strong>${rejected === 1 ? '1 document needs' : `${rejected} documents need`} your attention.</strong>
              Check the reason below and upload a new file.</div>
          </div>`
        : nothing}

      <div class="progress-wrap">
        <cp-progress-bar .value=${approved} .max=${total}
          label="${approved} of ${total} documents approved"></cp-progress-bar>
      </div>

      <ul class="docs" aria-label="Documents to upload">
        ${repeat(byPriority(this._docs), (d) => d.id, (d) => html`
          <li>
            <cp-doc-card .doc=${d}
              .error=${this._errors[d.id] ?? null}
              .uploadProgress=${this._uploads[d.id]?.progress ?? null}
              .uploadingName=${this._uploads[d.id]?.name ?? ''}
              @files-selected=${this._onFilesSelected}
              @view-file=${this._onView}
              @download-file=${this._onDownload}></cp-doc-card>
          </li>`)}
      </ul>

      <footer class="help body-md">Accepted: PDF, JPG or PNG, up to 5 MB each. One file per document.</footer>`;
  }

  render() {
    let body;
    if (this.scenario === 'expired') body = html`<div class="card state-card"><cp-state-screen variant="expired"></cp-state-screen></div>`;
    else if (this.scenario === 'tampered') body = html`<div class="card state-card"><cp-state-screen variant="tampered"></cp-state-screen></div>`;
    else if (allApproved(this._docs)) body = html`<div class="card state-card"><cp-state-screen variant="complete"></cp-state-screen></div>`;
    else body = this._active();

    const previewDoc = this._docs.find((d) => d.id === this._previewId) ?? null;
    return html`
      ${this._brand()}
      <main>${body}</main>
      <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      <cp-preview-modal .open=${!!previewDoc && this._linkValid} .doc=${previewDoc}
        @close-preview=${() => (this._previewId = null)}
        @download-file=${this._onDownload}></cp-preview-modal>`;
  }
}
customElements.define('cp-portal', CpPortal);
