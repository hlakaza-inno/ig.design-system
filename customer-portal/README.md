# Customer Document Upload Portal

Standalone Lit + Vite prototype of the signed-link customer portal from `../04-customer-document-portal.html`, styled with the IG design system tokens. All data is mocked.

```bash
npm install
npm run dev     # http://localhost:5173
```

- Flow: `#/` email preview → `#/portal`.
- Link scenario: `?scenario=valid|expired|tampered` (or the demo bar at the top).
- Demo bar: switch scenario, skip to portal, "Approve all documents" (stands in for the out-of-scope agent review), reset.

## Structure
- `src/components/` — `cp-shell`, `cp-email-preview`, `cp-portal`, `cp-doc-card` (prop-driven), `cp-progress-bar`, `cp-state-screen`, `cp-preview-modal`
- `src/styles/tokens.css` — `--ig-*` variables mirrored from `ig.design-system/src/tokens`
- `src/styles/shared.js` — button / alert / pill / card / type-scale styles ported from the design system SCSS (shadow DOM can't inherit global classes)
- `src/lib/rules.js` — business rules (5 MB, PDF/JPG/PNG, single file, upload permissions)
- `src/data/mock.js` — reference data
