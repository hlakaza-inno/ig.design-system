import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { ACCEPT_ATTR, STATUS, canUpload, formatSize, hasVisibleFile } from '../lib/rules.js';
import './cp-progress-bar.js';

const UPLOAD_LABEL = {
  [STATUS.REQUESTED]: 'Choose a file',
  [STATUS.SUBMITTED]: 'Replace file',
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
 *
 * Props:  doc { id, name, description, status, fileName, fileSize, submissions, rejectionReason }
 *         error           inline validation message (string | null)
 *         uploadProgress  0–100 while an upload is in flight, otherwise null
 *         uploadingName   name of the file being uploaded
 *         readonly        hides the upload zone and file actions (e.g. link no longer valid)
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
      .doc {
        background: var(--ig-color-neutral-0);
        border: 1px solid var(--ig-color-neutral-200);
        border-left: 4px solid var(--ig-color-neutral-300);
        border-radius: var(--ig-radius-lg);
        padding: var(--ig-space-4);
        box-shadow: var(--ig-shadow-xs);
      }
      .st-submitted { border-left-color: var(--ig-color-primary-500); }
      .st-approved { border-left-color: var(--ig-color-success-500); }
      .st-rejected {
        border-color: var(--ig-color-error-500);
        border-left-width: 4px;
        background: var(--ig-color-error-50);
      }
      .top { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--ig-space-3); }
      .name { color: var(--ig-color-neutral-900); }
      .desc { margin-top: 2px; color: var(--ig-color-neutral-600); }

      .reason {
        margin-top: var(--ig-space-3);
        padding: var(--ig-space-3);
        background: var(--ig-color-neutral-0);
        border: 1px solid var(--ig-color-error-200);
        border-radius: var(--ig-radius-md);
        color: var(--ig-color-error-700);
        display: flex;
        gap: var(--ig-space-2);
      }
      .reason svg { flex: none; margin-top: 1px; }
      .reason strong { font-weight: 600; }

      .file-row {
        margin-top: var(--ig-space-3);
        padding: var(--ig-space-3);
        background: var(--ig-color-neutral-100);
        border-radius: var(--ig-radius-md);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--ig-space-3);
      }
      .file-info { display: flex; align-items: center; gap: var(--ig-space-3); flex: 1 1 180px; min-width: 0; }
      .file-info svg { flex: none; color: var(--ig-color-primary-500); }
      .file-text { min-width: 0; }
      .file-name { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .actions { display: flex; gap: var(--ig-space-2); flex-wrap: wrap; }

      .locked {
        margin-top: var(--ig-space-3);
        display: flex;
        align-items: center;
        gap: var(--ig-space-2);
        color: var(--ig-color-success-700);
      }

      .drop {
        margin-top: var(--ig-space-3);
        width: 100%;
        min-height: 88px;
        padding: var(--ig-space-4);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--ig-space-1);
        text-align: center;
        color: var(--ig-color-neutral-600);
        background: var(--ig-color-neutral-0);
        border: 2px dashed var(--ig-color-neutral-300);
        border-radius: var(--ig-radius-lg);
        cursor: pointer;
        transition: background var(--ig-duration-normal) var(--ig-easing-default),
          border-color var(--ig-duration-normal) var(--ig-easing-default);
      }
      .drop:hover,
      .drop.dragging {
        border-color: var(--ig-color-primary-500);
        background: var(--ig-color-primary-50);
      }
      .drop .cta { color: var(--ig-color-primary-500); font-weight: 500; display: inline-flex; align-items: center; gap: var(--ig-space-2); }
      .drop .hint { color: var(--ig-color-neutral-500); }
      .st-rejected .drop { border-color: var(--ig-color-error-500); }

      .uploading { margin-top: var(--ig-space-3); padding: var(--ig-space-3); background: var(--ig-color-neutral-100); border-radius: var(--ig-radius-md); }
      .err {
        margin-top: var(--ig-space-3);
        display: flex;
        align-items: flex-start;
        gap: var(--ig-space-2);
        color: var(--ig-color-error-700);
      }
      .err svg { flex: none; margin-top: 1px; }
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

  _onPick(e) {
    const files = [...e.target.files];
    e.target.value = ''; // allow picking the same file again
    if (files.length) this._emit('files-selected', { id: this.doc.id, files });
  }

  _onDragOver(e) {
    e.preventDefault();
    this._dragging = true;
  }

  _onDrop(e) {
    e.preventDefault();
    this._dragging = false;
    const files = [...e.dataTransfer.files];
    if (files.length) this._emit('files-selected', { id: this.doc.id, files });
  }

  _pill(status) {
    return html`<span class="pill pill-${status.toLowerCase()}">${icon(PILL_ICON[status], 14)}${status}</span>`;
  }

  _fileRow(d) {
    return html`
      <div class="file-row">
        <div class="file-info">
          ${icon('file', 24)}
          <div class="file-text">
            <div class="file-name body-md" title=${d.fileName}>${d.fileName}</div>
            <div class="caption muted">${formatSize(d.fileSize)} · Submission ${d.submissions}</div>
          </div>
        </div>
        ${this.readonly
          ? nothing
          : html`
              <div class="actions">
                <button class="btn btn-secondary" aria-label="View ${d.fileName} for ${d.name}"
                  @click=${() => this._emit('view-file', { id: d.id })}>${icon('eye', 16)}View</button>
                <button class="btn btn-secondary" aria-label="Download ${d.fileName} for ${d.name}"
                  @click=${() => this._emit('download-file', { id: d.id })}>${icon('download', 16)}Download</button>
              </div>
            `}
      </div>`;
  }

  _uploadZone(d) {
    if (this._uploading) {
      return html`
        <div class="uploading" aria-live="polite">
          <cp-progress-bar tone="primary" .value=${this.uploadProgress}
            label="Uploading ${this.uploadingName}…"></cp-progress-bar>
        </div>`;
    }
    return html`
      <button type="button" class="drop ${this._dragging ? 'dragging' : ''}"
        aria-label="${UPLOAD_LABEL[d.status]} for ${d.name}. PDF, JPG or PNG, up to 5 MB."
        @click=${() => this.renderRoot.querySelector('input[type=file]').click()}
        @dragover=${this._onDragOver}
        @dragleave=${() => (this._dragging = false)}
        @drop=${this._onDrop}>
        <span class="cta body-md">${icon('upload', 18)}${UPLOAD_LABEL[d.status]}</span>
        <span class="body-md">or drop it here</span>
        <span class="caption hint">PDF, JPG or PNG · max 5 MB</span>
      </button>
      <input type="file" class="sr-only" tabindex="-1" aria-hidden="true" accept=${ACCEPT_ATTR}
        @change=${this._onPick} />`;
  }

  render() {
    const d = this.doc;
    if (!d) return nothing;
    const st = d.status.toLowerCase();
    const locked = !canUpload(d.status);
    const showZone = !locked && !this.readonly;
    return html`
      <article class="doc st-${st}" aria-labelledby="name">
        <div class="top">
          <div>
            <h3 class="name heading-sm" id="name">${d.name}</h3>
            <p class="desc body-md">${d.description}</p>
          </div>
          ${this._pill(d.status)}
        </div>

        ${d.status === STATUS.REJECTED && d.rejectionReason
          ? html`<div class="reason body-md" role="note">
              ${icon('alert-circle', 18)}
              <div><strong>Why it was rejected:</strong> ${d.rejectionReason}. Please upload a new file.</div>
            </div>`
          : nothing}

        ${hasVisibleFile(d) ? this._fileRow(d) : nothing}

        ${locked
          ? html`<div class="locked body-md">${icon('check-circle', 18)}Approved — nothing more to do here.</div>`
          : nothing}
        ${showZone ? this._uploadZone(d) : nothing}
        ${this.error
          ? html`<p class="err body-md" role="alert">${icon('alert-circle', 18)}<span>${this.error}</span></p>`
          : nothing}
      </article>`;
  }
}
customElements.define('cp-doc-card', CpDocCard);
