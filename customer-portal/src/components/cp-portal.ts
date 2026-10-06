import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { DocumentItem, DocIdDetail, FilesSelectedDetail, LoadPhase, PortalData, PortalResponse } from '../lib/types.js';
import { repeat } from 'lit/directives/repeat.js';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { STATUS, allApproved, formatDate, validateFiles } from '../lib/rules.js';
import './cp-brand-header.js';
import './cp-loading.js';
import './cp-doc-card.js';
import './cp-progress-bar.js';
import './cp-state-screen.js';
import './cp-preview-modal.js';

const UPLOAD_MS = 900;

/** Most urgent first: rejected → requested → submitted (awaiting review) → approved. */
const PRIORITY = [STATUS.REJECTED, STATUS.REQUESTED, STATUS.SUBMITTED, STATUS.APPROVED];
const byPriority = (docs: DocumentItem[]): DocumentItem[] =>
  [...docs].sort((a, b) => PRIORITY.indexOf(a.status) - PRIORITY.indexOf(b.status)); // stable sort

/**
 * Step 2 — Customer Portal.
 * Props: phase     'loading' | 'error' | 'ready'
 *        response  what the (mocked) API answered for the link
 * State: documents, per-document errors and in-flight uploads live here (no globals).
 * Public: approveAll() — demo helper that stands in for the (out-of-scope) agent review.
 */
@customElement('cp-portal')
export class CpPortal extends LitElement {
  @property() phase: LoadPhase = 'loading';
  @property({ attribute: false }) response: PortalResponse | null = null;
  @state() private _docs: DocumentItem[] = [];
  @state() private _errors: Record<number, string | null> = {};
  @state() private _uploads: Record<number, { progress: number; name: string }> = {};
  @state() private _previewId: number | null = null;
  @state() private _announce = '';
  private readonly _timers = new Map<number, ReturnType<typeof setInterval>>();

  static styles = [
    sharedStyles,
    css`
      :host { display: block; min-height: 100%; }
      main { max-width: 1200px; margin: 0 auto; padding: var(--ig-space-4) var(--ig-space-4) var(--ig-space-16); }
      @media (min-width: 640px) { main { padding: var(--ig-space-6) var(--ig-space-6) var(--ig-space-16); } }
      @media (min-width: 1024px) { main { padding-left: var(--ig-space-8); padding-right: var(--ig-space-8); } }

      main { display: flex; flex-direction: column; gap: var(--ig-space-4); }
      .state-wrap { max-width: 640px; width: 100%; margin: var(--ig-space-6) auto 0; }

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
      @media (min-width: 720px) { dl.ref { grid-template-columns: repeat(4, 1fr); } }
      dl.ref dt { color: var(--ig-color-neutral-600); }
      dl.ref dd { margin: 0; font-weight: 600; color: var(--ig-color-primary-700); }

      .progress-wrap { padding: 0 var(--ig-space-1); }
      .docs { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--ig-space-4); }
      @media (min-width: 960px) { .docs { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      .docs li { display: flex; }
      .docs cp-doc-card { flex: 1; min-width: 0; }
      .state-card { padding: 0; }
      footer.help { text-align: center; color: var(--ig-color-neutral-500); }
    `,
  ];

  /** A fresh API response (re)initialises the working copy of the documents. */
  protected willUpdate(changed: PropertyValues<this>): void {
    if (!changed.has('response')) return;
    this._clearSession();
    this._docs = this.response?.status === 'valid' ? this.response.data.documents.map((d) => ({ ...d })) : [];
  }

  private _clearSession(): void {
    this._timers.forEach((t) => clearInterval(t));
    this._timers.clear();
    this._docs.forEach((d) => d.blobUrl && URL.revokeObjectURL(d.blobUrl));
    this._errors = {};
    this._uploads = {};
    this._previewId = null;
    this._announce = '';
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearSession();
  }

  /** Demo helper standing in for the agent review screen. */
  approveAll(): void {
    this._previewId = null;
    this._docs = this._docs.map((d) => ({ ...d, status: STATUS.APPROVED, rejectionReason: null }));
  }

  private get _linkValid(): boolean {
    return this.response?.status === 'valid';
  }

  private _patchDoc(id: number, patch: Partial<DocumentItem>): void {
    this._docs = this._docs.map((d) => (d.id === id ? { ...d, ...patch } : d));
  }

  private _setError(id: number, message: string | null): void {
    this._errors = { ...this._errors, [id]: message };
  }

  private _onFilesSelected({ detail: { id, files } }: CustomEvent<FilesSelectedDetail>): void {
    const doc = this._docs.find((d) => d.id === id);
    // Business rules: link must be valid, doc not locked, one upload at a time per document.
    if (!doc || !this._linkValid || doc.status === STATUS.APPROVED || this._uploads[id]) return;

    const error = validateFiles(files);
    this._setError(id, error);
    if (error) return;
    this._startUpload(doc, files[0]);
  }

  private _startUpload(doc: DocumentItem, file: File): void {
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

  private _finishUpload(id: number, file: File): void {
    const prev = this._docs.find((d) => d.id === id);
    if (!prev) return;
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

  private _onView({ detail: { id } }: CustomEvent<DocIdDetail>): void {
    if (this._linkValid && !allApproved(this._docs)) this._previewId = id;
  }

  private _onDownload({ detail: { id } }: CustomEvent<DocIdDetail>): void {
    const d = this._docs.find((x) => x.id === id);
    if (!this._linkValid || !d?.fileName || allApproved(this._docs)) return;
    // Mocked backend: real session uploads download as-is; seeded files get a stand-in text file.
    const url = d.blobUrl ?? URL.createObjectURL(new Blob([`Prototype stand-in for ${d.fileName}\n`], { type: 'text/plain' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: d.fileName });
    a.click();
    if (!d.blobUrl) setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private _active(data: PortalData) {
    const total = this._docs.length;
    const approved = this._docs.filter((d) => d.status === STATUS.APPROVED).length;
    const rejected = this._docs.filter((d) => d.status === STATUS.REJECTED).length;
    return html`
      <div class="intro">
        <h1>Upload your documents</h1>
        <p class="body-lg">Hi ${data.customer.name.split(' ')[0]}, we need a few documents to continue your request.</p>
      </div>

      <dl class="ref body-md" aria-label="Request details">
        <div><dt>Request</dt><dd>${data.request.process}</dd></div>
        <div><dt>Reference</dt><dd>${data.request.reference}</dd></div>
        <div><dt>Customer</dt><dd>${data.customer.name}</dd></div>
        <div><dt>Link expires</dt><dd>${formatDate(data.link.expiresAt)}</dd></div>
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

  private _stateCard(variant: 'expired' | 'tampered' | 'complete' | 'error') {
    const r = this.response;
    return html`<div class="state-wrap"><div class="card state-card">
      <cp-state-screen variant=${variant}
        .maskedEmail=${r?.status === 'expired' ? r.maskedEmail : ''}
        .support=${r && r.status !== 'valid' ? r.support : null}
        .customerName=${r?.status === 'valid' ? r.data.customer.name : ''}></cp-state-screen>
    </div></div>`;
  }

  private _body() {
    if (this.phase === 'loading') return html`<cp-loading layout="portal"></cp-loading>`;
    const r = this.response;
    if (this.phase === 'error' || !r) return this._stateCard('error');
    if (r.status === 'expired') return this._stateCard('expired');
    if (r.status === 'tampered') return this._stateCard('tampered');
    return allApproved(this._docs) ? this._stateCard('complete') : this._active(r.data);
  }

  render() {
    const previewDoc = this._docs.find((d) => d.id === this._previewId) ?? null;
    return html`
      <cp-brand-header></cp-brand-header>
      <main>${this._body()}</main>
      <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      <cp-preview-modal .open=${!!previewDoc && this._linkValid} .doc=${previewDoc}
        @close-preview=${() => (this._previewId = null)}
        @download-file=${this._onDownload}></cp-preview-modal>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'cp-portal': CpPortal;
  }
}
