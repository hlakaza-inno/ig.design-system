# Customer Document Upload Portal

Standalone Lit (TypeScript) + Vite prototype of the signed-link customer portal from `../04-customer-document-portal.html`, styled with the IG design system tokens. All data is mocked: a JSON file behind a small API layer with simulated latency.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build
```

- Flow: `#/` email preview → `#/portal`.
- Link scenario: `?scenario=valid|expired|tampered` (or the demo bar at the top).
- Loading: the shell fetches on load and on every change; a skeleton shows while loading and a retryable error screen if it fails. The email example loads a valid link; the portal loads with the chosen scenario.
- Demo cog: switch scenario, skip to portal, simulate a load error, "Approve all documents" (stands in for the out-of-scope agent review), reset.

## Structure
- `src/components/` — `cp-shell`, `cp-email-preview`, `cp-portal`, `cp-doc-card` (prop-driven), `cp-progress-bar`, `cp-state-screen`, `cp-preview-modal`, `cp-brand-header`, `cp-loading` (skeleton)
- `src/styles/tokens.css` — `--ig-*` variables mirrored from `ig.design-system/src/tokens`
- `src/styles/shared.ts` — button / alert / pill / card / type-scale styles ported from the design system SCSS (shadow DOM can't inherit global classes)
- `src/lib/rules.ts` — business rules (5 MB, PDF/JPG/PNG, single file, upload permissions)
- `src/lib/types.ts` — `DocumentItem`, `DocStatus`, `Scenario` and event detail types
- `src/lib/api.ts` — mocked API: `fetchPortal()` and `requestNewLink()` (900ms latency, abortable, can simulate failure)
- `public/mock/portal.json` — the fake backend data (request, customer, support, link, documents)

Components use Lit's `@customElement`, `@property` and `@state` decorators (`experimentalDecorators`, `useDefineForClassFields: false` in `tsconfig.json`).
