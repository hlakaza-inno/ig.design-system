import { STATUS } from '../lib/rules.js';

export const SCENARIOS = Object.freeze(['valid', 'expired', 'tampered']);

export const customer = Object.freeze({
  name: 'Thandi Nkosi',
  email: 'thandi.nkosi@example.com',
  maskedEmail: 't•••••@example.com',
  process: 'Transfer of Ownership',
  reference: 'TOO-2026-004812',
});

export const support = Object.freeze({
  email: 'support@ig-transfers.example',
  phone: '0800 000 123',
});

/** Link expiry: 7 days from today. */
export const createLinkExpiry = () => new Date(Date.now() + 7 * 864e5);

export const SIGNED_LINK =
  'https://portal.ig-transfers.example/documents/upload?t=eyJwaSI6IjNmMmEuLi4iLCJlbSI6IjliN2MuLi4iLCJleHAiOjE3NTE...&sig=Qm9ldGllLXNpZ25hdHVyZQ';

/** Fresh copy of the initial mock documents (one per document type). */
export const createDocs = () => [
  {
    id: 1,
    name: 'Certified ID Copy',
    description: 'Certified within the last 3 months',
    status: STATUS.REQUESTED,
    fileName: null, fileSize: null, mimeType: null, blobUrl: null,
    submissions: 0,
    rejectionReason: null,
  },
  {
    id: 2,
    name: 'Proof of Address',
    description: 'Not older than 3 months',
    status: STATUS.SUBMITTED,
    fileName: 'utility-bill.pdf', fileSize: 482000, mimeType: 'application/pdf', blobUrl: null,
    submissions: 1,
    rejectionReason: null,
  },
  {
    id: 3,
    name: 'Signed Transfer Form',
    description: 'Signed by both seller and buyer',
    status: STATUS.REJECTED,
    fileName: null, fileSize: null, mimeType: null, blobUrl: null,
    submissions: 1,
    rejectionReason: 'Document is illegible',
  },
  {
    id: 4,
    name: 'Vehicle Registration (NaTIS)',
    description: 'Latest registration certificate',
    status: STATUS.APPROVED,
    fileName: 'natis.jpg', fileSize: 910000, mimeType: 'image/jpeg', blobUrl: null,
    submissions: 1,
    rejectionReason: null,
  },
];
