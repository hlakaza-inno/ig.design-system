# Publishing `@ig/design-system`

The design system is published as a private npm package to the **IGZA-Packages** Azure Artifacts feed.  
Package name: `@ig/design-system`  
Feed URL: `https://pkgs.dev.azure.com/innovation-group/IG.ZA/_packaging/IGZA-Packages/npm/registry/`

---

## Prerequisites

- Node.js 22.14.0 (`nvm use v22.14.0`)
- pnpm latest-10
- Access to the `IGZA-Packages` Azure Artifacts feed (**Contributor** role or higher)
- `vsts-npm-auth` for local authentication

---

## One-Time Local Setup

Authenticate your machine against Azure Artifacts. This writes a token into your local `.npmrc`:

```sh
npx vsts-npm-auth -config .npmrc
```

You will be prompted to sign in with your Azure DevOps account. The token expires periodically — re-run this command if you get a 401 error during publish.

---

## Versioning

Before publishing, bump the version in `libs/design-system/package.json`:

```json
{
  "version": "1.0.1"
}
```

Follow **semantic versioning**:

| Change type | Example | Version bump |
|---|---|---|
| Bug fix, token value correction | Fix wrong color hex | Patch `1.0.0 → 1.0.1` |
| New token, new utility class, new component class | Add `success-100` | Minor `1.0.0 → 1.1.0` |
| Rename/remove token, breaking API change | Rename `primary` → `brand` | Major `1.0.0 → 2.0.0` |

---

## Publish

```sh
pnpx nx publish design-system
```

This single command runs the following steps automatically in order:

1. **`build`** — compiles TypeScript source to ESM format in `dist/libs/design-system/src/`
2. **`build-cjs`** — compiles TypeScript source to CommonJS format in `dist/libs/design-system/cjs/` (required by PostCSS/tailwind config at build time in consuming projects)
3. **`npm publish`** — publishes the entire `dist/libs/design-system/` folder to the Azure Artifacts feed

The published package will contain:

```
dist/libs/design-system/
  src/
    index.js              ← token exports (ESM)
    tailwind/preset.js    ← Tailwind preset (ESM)
    primeng/ig-preset.js  ← PrimeNG theme (ESM)
    tokens/...
  cjs/
    tailwind/preset.js    ← Tailwind preset (CommonJS) — required by consuming projects
    tokens/...
  styles/
    index.scss
    _components.scss, _reset.scss, _typography.scss, _utilities.scss
  package.json
```

Verify the package appears in the feed after publishing:  
`https://dev.azure.com/innovation-group/IG.ZA/_artifacts/feed/IGZA-Packages`

---

## Consuming in MFE Projects (portal-sales, portal-entity)

### 1. Ensure `.npmrc` points to IGZA-Packages

Each consuming repo must have an `.npmrc` at the root:

```ini
registry=https://pkgs.dev.azure.com/innovation-group/IG.ZA/_packaging/IGZA-Packages/npm/registry/
always-auth=true
```

### 2. Authenticate (one-time per machine)

```sh
npx vsts-npm-auth -config .npmrc
```

### 3. Install

```sh
pnpm add -D @ig/design-system
```

### 4. Usage

**Tailwind config** (`tailwind.config.ts`):
```ts
import igPreset from '@ig/design-system/tailwind/preset';

export default {
  presets: [igPreset],
  content: [ ... ],
};
```

**Global SCSS** (`styles.scss`):
```scss
@use "@ig/design-system/styles" as ds;
```

**PrimeNG preset** (`app.config.ts`):
```ts
import IgPreset from '@ig/design-system/primeng/ig-preset';

providePrimeNG({
  theme: { preset: IgPreset, options: { darkModeSelector: 'none' } }
})
```

**Design tokens** (TypeScript):
```ts
import { primary, neutral, accent } from '@ig/design-system';
```

---

## Updating an Existing Installation

After publishing a new version, update consuming projects:

```sh
pnpm update @ig/design-system
```

Or pin to an exact version in `package.json`:

```json
{
  "devDependencies": {
    "@ig/design-system": "1.1.0"
  }
}
```

---

## Troubleshooting

**`401 Unauthorized` during publish or install**  
Re-run `npx vsts-npm-auth -config .npmrc` — your token has expired.

**`EPUBLISHCONFLICT` — version already exists**  
Bump the version in `libs/design-system/package.json` before publishing. Azure Artifacts does not allow overwriting existing versions.

**`Cannot find module '@ig/design-system/tailwind/preset'`**  
The package is not installed. Run `pnpm add -D @ig/design-system`. If already installed, check the `exports` field in `node_modules/@ig/design-system/package.json` is present.

**SCSS `@use "@ig/design-system/styles"` not resolving**  
Ensure your sass compiler resolves `node_modules`. In Angular, add `stylePreprocessorOptions.includePaths` to `project.json` if needed:
```json
"stylePreprocessorOptions": {
  "includePaths": ["node_modules"]
}
```
