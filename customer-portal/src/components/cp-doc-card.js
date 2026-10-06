import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { ACCEPT_ATTR, STATUS, canUpload, formatSize, hasVisibleFile } from '../lib/rules.js';
import './cp-progress-bar.js';

const UPLOAD_LABEL = {
  [STATUS.REQUESTED]: 'Choose a file',
  [STATUS.REJECTED]: 'Upload a new file',
};
const PILL_ICON = {
  [STATUS.REQUESTED]: 'clock',
  [STATUS.SUBMITTED]: 'upload',
  [STATUS.APPROVED]: 'check-circle',
  [STATUS.REJECTED]: 'alert-circle',
};

/**
 * One document-type card. Fully prop-driven — owns no document state.
 * Structure follows the design system card: header / content / footer.
 *
 * Props:  doc { id, name, description, status, fileName, fileSize, submissions, rejectionReason }
 *         error           inline validation message (string | null)
 *         uploadProgress  0–100 while an upload is in flight, otherwise null
 *         uploadingName   name of the file being uploaded
 *         readonly        hides upload and file actions (e.g. link no longer valid)
 * Events: files-selected { id, files }, view-file { id }, download-file { id }
 */
export class CpDocCard extends LitElement {
  static properties = {
    doc: { type: Object },
    error: { type: String },
    uploadProgress: { type: Number, attribute: 'upload-progress' },
    uploadingName: { type: String, attribute: 'uploading-name' },
    readonly: { type: Boolean },
    _dragging: { state: true },
  };

  static styles = [
    sharedStyles,
    css`
      :host { display: block; }
      .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: border-color var(--ig-duration-normal) var(--ig-easing-default),
          box-shadow var(--ig-duration-normal) var(--ig-easing-default);
      }
      .card.dragging { border-color: var(--ig-color-primary-500); box-shadow: 0 0 0 2px var(--ig-color-primary-500); }
      .st-rejected { border-color: var(--ig-color-error-500); }
      .st-rejected .card-header { background: var(--ig-color-error-50); border-bottom-color: var(--ig-color-error-200); }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--ig-space-3);
        padding: var(--ig-space-4);
        border-bottom: 1px solid var(--ig-color-neutral-200);
      }
      .desc { margin-top: 2px; color: var(--ig-color-neutral-600); }

      .card-content {
        flex: 1;
        padding: var(--ig-space-4);
        display: flex;
        flex-direction: column;
        gap: var(--ig-space-3);
      }
      .card-footer {
        padding: var(--ig-space-4);
        border-top: 1px solid var(--ig-color-neutral-200);
      }

      .file { display: flex; align-items: center; gap: var(--ig-space-4); min-width: 0; }
      .tile {
        flex: none;
        width: 56px;
        height: 56px;
        display: grid;
        place-items: center;
        border-radius: var(--ig-radius-lg);
        background: var(--ig-color-primary-50);
        color: var(--ig-color-primary-500);
      }
      .tile.empty { background: var(--ig-color-neutral-100); color: var(--ig-color-neutral-400); }
      .file-text { min-width: 0; }
      .file-name {
        font-size: var(--ig-text-lg);
        line-height: var(--ig-leading-lg);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .file-name.empty { color: var(--ig-color-neutral-600); font-weight: 500; }
      .file-meta { color: var(--ig-color-neutral-600); }

      .approved-note { display: flex; align-items: center; gap: var(--ig-space-2); color: var(--ig-color-primary-700); }

      .actions { display: flex; flex-wrap: wrap; gap: var(--ig-space-2); }
      @media (max-width: 479px) { .actions .btn { flex: 1 1 auto; } }

      .drop {
        width: 100%;
        min-height: 56px;
        padding: var(--ig-space-3) var(--ig-space-4);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: var(--ig-space-1) var(--ig-space-2);
        text-align: center;
        color: var(--ig-color-neutral-600);
        background: var(--ig-color-neutral-0);
        border: 2px dashed var(--ig-color-neutral-300);
        border-radius: var(--ig-radius-md);
        cursor: pointer;
        transition: background var(--ig-duration-normal) var(--ig-easing-default),
          border-color var(--ig-duration-normal) var(--ig-easing-default);
      }
      .drop:hover, .dragging .drop {
        border-color: var(--ig-color-primary-500);
        background: var(--ig-color-primary-50);
      }
      .drop .cta { color: var(--ig-color-primary-500); font-weight: 500; display: inline-flex; align-items: center; gap: var(--ig-space-2); }
      /* No drag-and-drop on touch screens: don't suggest it. */
      @media (hover: none) { .drop .dropword { display: none; } }

      .err { margin-top: var(--ig-space-3); display: flex; align-items: flex-start; gap: var(--ig-space-2); color: var(--ig-color-error-700); }
      .err svg { flex: none; margin-top: 1px; }
      .err { margin-top: 0; }
    `,
  ];

  constructor() {
    super();
    this.doc = null;
    this.error = null;
    this.uploadProgress = null;
    this.uploadingName = '';
    this.readonly = false;
    this._dragging = false;
  }

  get _uploading() {
    return this.uploadProgress != null;
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  _browse() {
    this.renderRoot.querySelector('input[type=file]').click();
  }

  _onPick(e) {
    const files = [...e.target.files];
    e.target.value = ''; // allow picking the same file again
    if (files.length) this._emit('files-selected', { id: this.doc.id, files });
  }

  get _canDrop() {
    return canUpload(this.doc.status) && !this.readonly && !this._uploading;
  }

  _onDragOver(e) {
    if (!this._canDrop) return;
    e.preventDefault();
    this._dragging = true;
  }

  _onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) this._dragging = false;
  }

  _onDrop(e) {
    if (!this._canDrop) return;
    e.preventDefault();
    this._dragging = false;
    const files = [...e.dataTransfer.files];
    if (files.length) this._emit('files-selected', { id: this.doc.id, files });
  }

  _pill(status) {
    return html`<span class="pill pill-${status.toLowerCase()}">${icon(PILL_ICON[status], 16)}${status}</span>`;
  }

  /** Content: the document itself (or an empty placeholder). No actions here. */
  _fileInfo(d, hasFile) {
    return hasFile
      ? html`
          <div class="file">
            <div class="tile">${icon('file', 30)}</div>
            <div class="file-text">
              <div class="file-name" title=${d.fileName}>${d.fileName}</div>
              <div class="file-meta body-md">${formatSize(d.fileSize)} · Submission ${d.submissions}</div>
            </div>
          </div>`
      : html`
          <div class="file">
            <div class="tile empty">${icon('file', 30)}</div>
            <div class="file-text">
              <div class="file-name empty">${d.status === STATUS.REJECTED ? 'Waiting for a new file' : 'No file uploaded yet'}</div>
              <div class="file-meta body-md">PDF, JPG or PNG · max 5 MB</div>
            </div>
          </div>`;
  }

  /** Footer: always the actions. */
  _footer(d, hasFile) {
    if (this.readonly) return nothing;
    if (hasFile) {
      const canReplace = d.status === STATUS.SUBMITTED && !this._uploading;
      return html`<div class="card-footer"><div class="actions">
        <button class="btn btn-secondary" aria-label="View ${d.fileName} for ${d.name}"
          @click=${() => this._emit('view-file', { id: d.id })}>${icon('eye', 16)}View</button>
        <button class="btn btn-secondary" aria-label="Download ${d.fileName} for ${d.name}"
          @click=${() => this._emit('download-file', { id: d.id })}>${icon('download', 16)}Download</button>
        ${canReplace
          ? html`<button class="btn btn-secondary" aria-label="Replace the file for ${d.name}"
              @click=${this._browse}>${icon('upload', 16)}Replace</button>`
          : nothing}
      </div></div>`;
    }
    if (canUpload(d.status) && !this._uploading) {
      return html`<div class="card-footer">
        <button type="button" class="drop"
          aria-label="${UPLOAD_LABEL[d.status]} for ${d.name}. PDF, JPG or PNG, up to 5 MB."
          @click=${this._browse}>
          <span class="cta">${icon('upload', 18)}${UPLOAD_LABEL[d.status]}</span>
          <span class="dropword body-md">or drop it here</span>
        </button>
      </div>`;
    }
    return nothing;
  }

  render() {
    const d = this.doc;
    if (!d) return nothing;
    const st = d.status.toLowerCase();
    const rejected = d.status === STATUS.REJECTED && d.rejectionReason;
    const hasFile = hasVisibleFile(d);
    const approved = d.status === STATUS.APPROVED;

    return html`
      <article class="card st-${st} ${this._dragging ? 'dragging' : ''}" aria-labelledby="name"
        @dragover=${this._onDragOver} @dragleave=${this._onDragLeave} @drop=${this._onDrop}>
        <div class="card-header">
          <div>
            <h3 class="heading-md" id="name">${d.name}</h3>
            <p class="desc body-md">${d.description}</p>
          </div>
          ${this._pill(d.status)}
        </div>

        <div class="card-content">
          ${rejected
            ? html`<div class="alert alert-error" role="note">
                ${icon('alert-circle', 18)}
                <div><strong>Why it was rejected:</strong> ${d.rejectionReason}. Please upload a new file.</div>
              </div>`
            : nothing}
          ${this._uploading
            ? html`<div aria-live="polite"><cp-progress-bar tone="primary" .value=${this.uploadProgress}
                label="Uploading ${this.uploadingName}…"></cp-progress-bar></div>`
            : this._fileInfo(d, hasFile)}
          ${approved
            ? html`<div class="approved-note body-md">${icon('check-circle', 18)}Approved — nothing more to do here.</div>`
            : nothing}
          ${this.error
            ? html`<p class="err body-md" role="alert">${icon('alert-circle', 18)}<span>${this.error}</span></p>`
            : nothing}
        </div>

        ${this._footer(d, hasFile)}
        ${canUpload(d.status) && !this.readonly
          ? html`<input type="file" class="sr-only" tabindex="-1" aria-hidden="true" accept=${ACCEPT_ATTR} @change=${this._onPick} />`
          : nothing}
      </article>`;
  }
}
customElements.define('cp-doc-card', CpDocCard);
