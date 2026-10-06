import { LitElement, html, css, nothing } from 'lit';
import { sharedStyles } from '../styles/shared.js';
import { icon } from '../lib/icons.js';
import { formatSize } from '../lib/rules.js';

/**
 * File preview dialog (native <dialog>: focus trap, Esc to close, inert background).
 * Props:  open (Boolean), doc (Object)
 * Events: close-preview, download-file { id }
 * Real preview for files uploaded in this session (blobUrl); a placeholder page for seeded mock files.
 */
export class CpPreviewModal extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    doc: { type: Object },
  };

  static styles = [
    sharedStyles,
    css`
      dialog {
        width: min(560px, calc(100vw - var(--ig-space-6)));
        max-height: calc(100dvh - var(--ig-space-6));
        padding: 0;
        border: 0;
        border-radius: var(--ig-radius-xl);
        box-shadow: var(--ig-shadow-xl);
        color: var(--ig-color-neutral-900);
        overflow: auto;
      }
      dialog::backdrop { background: rgba(0, 10, 46, 0.55); }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--ig-space-3);
        padding: var(--ig-space-5) var(--ig-space-5) 0;
      }
      .x {
        flex: none;
        width: 44px; height: 44px; margin: -8px -8px 0 0;
        display: grid; place-items: center;
        background: transparent; border: 0; border-radius: var(--ig-radius-md);
        color: var(--ig-color-neutral-600); cursor: pointer;
      }
      .x:hover { background: var(--ig-color-neutral-100); }
      .x:focus-visible { outline: 2px solid var(--ig-color-primary-500); outline-offset: 2px; }
      .meta { padding: var(--ig-space-1) var(--ig-space-5) 0; color: var(--ig-color-neutral-600); }
      .preview {
        margin: var(--ig-space-4) var(--ig-space-5);
        height: 280px;
        background: var(--ig-color-neutral-100);
        border: 1px solid var(--ig-color-neutral-200);
        border-radius: var(--ig-radius-lg);
        display: grid;
        place-items: center;
        overflow: hidden;
      }
      .preview img { max-width: 100%; max-height: 100%; object-fit: contain; }
      .preview iframe { width: 100%; height: 100%; border: 0; background: #fff; }
      .sheet {
        width: 150px; height: 200px; background: #fff; border-radius: var(--ig-radius-sm);
        box-shadow: var(--ig-shadow-md); padding: var(--ig-space-4);
        display: flex; flex-direction: column; gap: var(--ig-space-2);
      }
      .sheet i { display: block; height: 6px; border-radius: var(--ig-radius-full); background: var(--ig-color-neutral-200); }
      .sheet i:nth-child(1) { width: 60%; background: var(--ig-color-primary-200); height: 8px; margin-bottom: var(--ig-space-2); }
      .sheet i:nth-child(4n) { width: 80%; }
      .sheet i:nth-child(5n) { width: 45%; }
      .note { text-align: center; color: var(--ig-color-neutral-600); padding: 0 var(--ig-space-4); }
      .foot {
        display: flex; justify-content: flex-end; flex-wrap: wrap; gap: var(--ig-space-2);
        padding: 0 var(--ig-space-5) var(--ig-space-5);
      }
    `,
  ];

  constructor() {
    super();
    this.open = false;
    this.doc = null;
  }

  updated(changed) {
    if (!changed.has('open')) return;
    const dlg = this.renderRoot.querySelector('dialog');
    if (this.open && !dlg.open) dlg.showModal();
    else if (!this.open && dlg.open) dlg.close();
  }

  _close() {
    this.dispatchEvent(new CustomEvent('close-preview', { bubbles: true, composed: true }));
  }

  _body(d) {
    if (d.blobUrl && d.mimeType?.startsWith('image/')) {
      return html`<img src=${d.blobUrl} alt="Preview of ${d.fileName}" />`;
    }
    if (d.blobUrl && d.mimeType === 'application/pdf') {
      return html`<iframe src=${d.blobUrl} title="Preview of ${d.fileName}"></iframe>`;
    }
    return html`
      <div>
        <div class="sheet" aria-hidden="true">${Array.from({ length: 12 }, () => html`<i></i>`)}</div>
        <p class="note body-md" style="margin-top:var(--ig-space-3)">Sample preview of ${d.fileName}</p>
      </div>`;
  }

  render() {
    const d = this.doc;
    return html`
      <dialog aria-labelledby="title" @close=${this._close} @cancel=${this._close}
        @click=${(e) => e.target === e.currentTarget && this._close()}>
        ${d
          ? html`
              <div class="head">
                <h2 class="heading-lg" id="title">${d.name}</h2>
                <button class="x" aria-label="Close preview" @click=${this._close}>${icon('x', 20)}</button>
              </div>
              <p class="meta body-md">${d.fileName} · ${formatSize(d.fileSize)} · Submission ${d.submissions}</p>
              <div class="preview">${this._body(d)}</div>
              <div class="foot">
                <button class="btn btn-secondary"
                  @click=${() => this.dispatchEvent(new CustomEvent('download-file', { detail: { id: d.id }, bubbles: true, composed: true }))}>
                  ${icon('download', 16)}Download
                </button>
                <button class="btn btn-primary" @click=${this._close}>Close</button>
              </div>`
          : nothing}
      </dialog>`;
  }
}
customElements.define('cp-preview-modal', CpPreviewModal);
