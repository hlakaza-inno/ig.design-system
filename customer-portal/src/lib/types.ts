import type { STATUS } from './rules.js';

export type DocStatus = (typeof STATUS)[keyof typeof STATUS];
export type Scenario = 'valid' | 'expired' | 'tampered';

/** One requested document type for a customer's process. */
export interface DocumentItem {
  id: number;
  name: string;
  description: string;
  status: DocStatus;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  blobUrl: string | null;
  submissions: number;
  rejectionReason: string | null;
}

export interface FilesSelectedDetail {
  id: number;
  files: File[];
}
export interface DocIdDetail {
  id: number;
}

export interface SupportContact {
  email: string;
  phone: string;
}

export interface Customer {
  name: string;
  email: string;
  /** Safe to show on the expired screen, e.g. "t•••••@example.com". */
  maskedEmail: string;
}

/** Everything the portal and the email example need for one valid link. */
export interface PortalData {
  request: { process: string; reference: string };
  customer: Customer;
  support: SupportContact;
  link: { expiresAt: Date; signedUrl: string };
  documents: DocumentItem[];
}

/**
 * What the (mocked) portal API answers for a signed link. Expired and tampered
 * links expose no documents, only what the error screens need.
 */
export type PortalResponse =
  | { status: 'valid'; data: PortalData }
  | { status: 'expired'; maskedEmail: string; support: SupportContact }
  | { status: 'tampered'; support: SupportContact };

export type LoadPhase = 'loading' | 'error' | 'ready';
