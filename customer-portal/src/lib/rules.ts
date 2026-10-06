import type { DocStatus, DocumentItem } from './types.js';

/** Business rules + formatting helpers for the document portal. */

export const MAX_BYTES = 5 * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const ACCEPT_ATTR = ALLOWED_EXTENSIONS.join(',');

export const STATUS = {
  REQUESTED: 'Requested',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

/** Upload allowed for Requested, Submitted (replace) and Rejected (resubmit). Approved is locked. */
export const canUpload = (status: DocStatus): boolean => status !== STATUS.APPROVED;

/** A file row is shown only if a file exists and the document was not rejected. */
export const hasVisibleFile = (doc: DocumentItem): boolean => !!doc.fileName && doc.status !== STATUS.REJECTED;

export const allApproved = (docs: DocumentItem[]): boolean => docs.length > 0 && docs.every((d) => d.status === STATUS.APPROVED);

export const formatSize = (bytes: number): string =>
  bytes < 1048576 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

export const formatDate = (date: Date): string =>
  date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

/**
 * Validate a dropped / selected selection. Returns a plain-language error, or null if OK.
 * Rules: exactly one file, PDF/JPG/PNG, ≤ 5 MB.
 */
export function validateFiles(files: ArrayLike<File>): string | null {
  if (!files.length) return null;
  if (files.length > 1) return 'Please add one file at a time.';
  const file = files[0];
  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `We can’t accept ${ext ? `“${ext}”` : 'this'} files. Please upload a PDF, JPG or PNG.`;
  }
  if (file.size > MAX_BYTES) {
    return `That file is too big (${formatSize(file.size)}). The limit is 5 MB.`;
  }
  return null;
}
