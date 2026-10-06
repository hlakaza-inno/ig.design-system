import type { DocumentItem, PortalData, PortalResponse, Scenario, Customer, SupportContact } from './types.js';

/** Demo scenarios the mocked API can answer with. */
export const SCENARIOS: readonly Scenario[] = ['valid', 'expired', 'tampered'];

/** Simulated network round-trip, so loading states are visible. */
const LATENCY_MS = 900;
const MOCK_URL = `${import.meta.env.BASE_URL}mock/portal.json`;

/** Shape of `public/mock/portal.json`. The expiry is relative so "7 days from today" stays true. */
interface RawPortal {
  request: PortalData['request'];
  customer: Customer;
  support: SupportContact;
  link: { expiresInDays: number; signedUrl: string };
  documents: DocumentItem[];
}

export interface FetchPortalOptions {
  /** Which link state the mocked backend should answer with. */
  scenario?: Scenario;
  /** Force a network failure to demo the error state. */
  fail?: boolean;
  signal?: AbortSignal;
}

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });

/** Load the portal for the current (signed) link. */
export async function fetchPortal({ scenario = 'valid', fail = false, signal }: FetchPortalOptions = {}): Promise<PortalResponse> {
  await sleep(LATENCY_MS, signal);
  if (fail) throw new Error('Simulated network failure');

  const res = await fetch(MOCK_URL, { signal });
  if (!res.ok) throw new Error(`Could not load portal data (${res.status})`);
  const raw = (await res.json()) as RawPortal;

  if (scenario === 'expired') return { status: 'expired', maskedEmail: raw.customer.maskedEmail, support: raw.support };
  if (scenario === 'tampered') return { status: 'tampered', support: raw.support };

  return {
    status: 'valid',
    data: {
      request: raw.request,
      customer: raw.customer,
      support: raw.support,
      link: {
        signedUrl: raw.link.signedUrl,
        expiresAt: new Date(Date.now() + raw.link.expiresInDays * 864e5),
      },
      documents: raw.documents,
    },
  };
}

/** Ask for a fresh signed link to be emailed (mocked). */
export async function requestNewLink(signal?: AbortSignal): Promise<void> {
  await sleep(LATENCY_MS, signal);
}
