# Innovation Group — Design System Specification

## Overview

The `@ig/design-system` library is the single source of truth for all visual design tokens, typography, component styles, and theming across the Innovation Group Portal micro-frontend architecture (shell, sales, entity).

---

## 1. Color System

### 1.1 Brand Colors

| Token | Hex | Usage |
|---|---|---|
| **Brand Primary** | `#001A72` | Primary brand navy — headers, CTAs, navigation |
| **Brand Accent** | `#00E6FF` | Accent cyan — highlights, data visualisation, links |

### 1.2 Primary Palette (Navy)

| Scale | Hex | CSS Variable | Tailwind |
|---|---|---|---|
| 50 | `#EFF5FD` | `--ig-color-primary-50` | `primary-50` |
| 100 | `#B3BAD6` | `--ig-color-primary-100` | `primary-100` |
| 200 | `#8090BA` | `--ig-color-primary-200` | `primary-200` |
| 300 | `#4D669E` | `--ig-color-primary-300` | `primary-300` |
| 400 | `#264089` | `--ig-color-primary-400` | `primary-400` |
| **500** | **`#001A72`** | `--ig-color-primary-500` | `primary` / `primary-500` |
| 600 | `#001766` | `--ig-color-primary-600` | `primary-600` |
| 700 | `#001355` | `--ig-color-primary-700` | `primary-700` |
| 800 | `#000F44` | `--ig-color-primary-800` | `primary-800` |
| 900 | `#000A2E` | `--ig-color-primary-900` | `primary-900` |

### 1.3 Accent Palette (Cyan)

| Scale | Hex | Tailwind |
|---|---|---|
| 50 | `#E6FCFF` | `accent-50` |
| 100 | `#B3F5FF` | `accent-100` |
| 200 | `#80EEFF` | `accent-200` |
| 300 | `#4DE8FF` | `accent-300` |
| 400 | `#26E7FF` | `accent-400` |
| **500** | **`#00E6FF`** | `accent` / `accent-500` |
| 600 | `#00B8CC` | `accent-600` |
| 700 | `#008A99` | `accent-700` |
| 800 | `#005C66` | `accent-800` |
| 900 | `#002E33` | `accent-900` |

### 1.4 Semantic Colors

| Color | Scale(s) | Hex | Purpose |
|---|---|---|---|
| **Error** | 50 / 500 / 700 | `#FEF2F2` / `#CF2E2E` / `#911D1D` | Form errors, destructive actions |
| **Warning** | 50 / 500 / 600 | `#FFF8E1` / `#FCB900` / `#FF6900` | Warnings, attention needed |
| **Success** | 50 / 500 | `#C8FFC8` / `#00AA00` | Confirmations, positive states |

### 1.5 Neutral Palette

| Scale | Hex | Usage |
|---|---|---|
| 0 | `#FFFFFF` | Page backgrounds |
| 50 | `#F9FAFB` | Section backgrounds |
| 100 | `#F3F4F6` | Card backgrounds |
| 200 | `#E5E7EB` | Borders, dividers |
| 300 | `#D1D5DB` | Disabled borders |
| 400 | `#9CA3AF` | Placeholder text |
| 500 | `#6B7280` | Secondary text |
| 600 | `#4B5563` | Body text |
| 700 | `#384146` | Emphasis text |
| 800 | `#1F2937` | Strong text |
| 900 | `#111928` | Headings, primary text |

### 1.6 Legacy Aliases

| Legacy CSS Variable | Maps To |
|---|---|
| `--primary-color` | `--ig-color-primary-500` |
| `--secondary-color` | `#8899A8` |
| `--dark-color` | `--ig-color-neutral-900` |
| `--light-gray-color` | `#DFE4EA` |
| `--shadow-color` | `rgba(0, 0, 0, 0.25)` |

---

## 2. Typography

### 2.1 Font Families

| Role | Font | Fallback Stack | CSS Variable | Tailwind |
|---|---|---|---|---|
| **Display** | Prota Pro Regular | Helvetica Neue, Arial, sans-serif | `--ig-font-family-display` | `font-display` |
| **Body** | Neue Haas Unica | Helvetica Neue, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif | `--ig-font-family-body` | `font-body` / `font-sans` |
| **Mono** | System UI Monospace | SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace | `--ig-font-family-mono` | `font-mono` |

### 2.2 Font Sources

- **Neue Haas Unica**: Adobe TypeKit (Kit ID: `qqq6ejd`), weights 300/400/500/600
- **Prota Pro**: Self-hosted TTF at `/fonts/prota-pro-regular.ttf`, weight normal only

### 2.3 Type Scale

| Class | Font Family | Size | Line Height | Weight |
|---|---|---|---|---|
| `.display-xl` | Display | 2.25rem (36px) | 2.5rem (40px) | 700 |
| `.display-lg` | Display | 1.875rem (30px) | 2.25rem (36px) | 700 |
| `.display-md` | Display | 1.5rem (24px) | 2rem (32px) | 700 |
| `.heading-lg` | Display | 1.25rem (20px) | 1.75rem (28px) | 600 |
| `.heading-md` | Display | 1.125rem (18px) | 1.5rem (24px) | 600 |
| `.heading-sm` | Display | 1rem (16px) | 1.5rem (24px) | 600 |
| `.body-lg` | Body | 1.125rem (18px) | 1.75rem (28px) | 400 |
| `.body-md` | Body | 1rem (16px) | 1.5rem (24px) | 400 |
| `.body-sm` | Body | 0.875rem (14px) | 1.25rem (20px) | 400 |
| `.caption` | Body | 0.75rem (12px) | 1rem (16px) | 400 |

---

## 3. Spacing

8-point grid system using `--ig-space-*` tokens.

| Token | Value | Tailwind Equiv |
|---|---|---|
| `--ig-space-0` | 0px | `p-0` |
| `--ig-space-1` | 4px | `p-1` |
| `--ig-space-2` | 8px | `p-2` |
| `--ig-space-3` | 12px | `p-3` |
| `--ig-space-4` | 16px | `p-4` |
| `--ig-space-5` | 20px | `p-5` |
| `--ig-space-6` | 24px | `p-6` |
| `--ig-space-8` | 32px | `p-8` |
| `--ig-space-10` | 40px | `p-10` |
| `--ig-space-12` | 48px | `p-12` |
| `--ig-space-16` | 64px | `p-16` |
| `--ig-space-20` | 80px | `p-20` |
| `--ig-space-24` | 96px | `p-24` |

---

## 4. Border Radius

| Token | Value | Tailwind |
|---|---|---|
| `--ig-radius-none` | 0px | `rounded-none` |
| `--ig-radius-sm` | 4px | `rounded-sm` |
| `--ig-radius-md` | 6px | `rounded-md` / `rounded` |
| `--ig-radius-lg` | 8px | `rounded-lg` |
| `--ig-radius-xl` | 12px | `rounded-xl` |
| `--ig-radius-full` | 9999px | `rounded-full` |

---

## 5. Elevation (Shadows)

| Token | Value | Tailwind |
|---|---|---|
| `--ig-shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-xs` |
| `--ig-shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | `shadow-sm` |
| `--ig-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)` | `shadow-md` |
| `--ig-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05)` | `shadow-lg` |
| `--ig-shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)` | `shadow-xl` |

---

## 6. Motion

| Token | Value | Purpose |
|---|---|---|
| `--ig-duration-fast` | 100ms | Micro-interactions (hover, focus) |
| `--ig-duration-normal` | 200ms | UI state transitions |
| `--ig-duration-slow` | 300ms | Page/modal transitions |
| `--ig-easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose |
| `--ig-easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements entering |
| `--ig-easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements exiting |

---

## 7. Component Patterns

### 7.1 Buttons

| Class | Default State | Hover State |
|---|---|---|
| `.btn-primary` | Filled navy (`primary-500`) with white text | Outlined with navy border + navy text |
| `.btn-secondary` | Outlined with `neutral-300` border | Filled `primary-50` background |

### 7.2 Cards

```html
<div class="card">
  <div class="card-header">Title</div>
  <div class="card-content">Body</div>
  <div class="card-footer">Actions</div>
</div>
```

### 7.3 Alerts

| Class | Border Color | Background | Text Color |
|---|---|---|---|
| `.alert-error` | `error-500` | `error-50` | `error-700` |
| `.alert-warning` | `warning-500` | `warning-50` | `warning-600` |
| `.alert-success` | `success-500` | `success-50` | `success-500` |
| `.alert-info` | `primary-500` | `primary-50` | `primary-700` |

### 7.4 Badges

| Class | Background | Text |
|---|---|---|
| `.badge-primary` | `primary-500` | white |
| `.badge-accent` | `accent-500` | `neutral-900` |
| `.badge-error` | `error-500` | white |
| `.badge-warning` | `warning-500` | `neutral-900` |
| `.badge-success` | `success-500` | white |

---

## 8. WCAG 2.1 AA Contrast Ratios

| Foreground | Background | Ratio | Pass (Normal) | Pass (Large) |
|---|---|---|---|---|
| `#001A72` (primary) | `#FFFFFF` (white) | **12.6:1** | ✅ AA | ✅ AAA |
| `#FFFFFF` (white) | `#001A72` (primary) | **12.6:1** | ✅ AA | ✅ AAA |
| `#111928` (neutral-900) | `#FFFFFF` (white) | **17.4:1** | ✅ AA | ✅ AAA |
| `#6B7280` (neutral-500) | `#FFFFFF` (white) | **4.6:1** | ✅ AA | ✅ AAA |
| `#9CA3AF` (neutral-400) | `#FFFFFF` (white) | **2.9:1** | ❌ | ✅ AA |
| `#CF2E2E` (error-500) | `#FFFFFF` (white) | **4.9:1** | ✅ AA | ❌ AAA |
| `#CF2E2E` (error-500) | `#FEF2F2` (error-50) | **4.7:1** | ✅ AA | ❌ AAA |
| `#911D1D` (error-700) | `#FEF2F2` (error-50) | **8.2:1** | ✅ AA | ✅ AAA |
| `#00AA00` (success-500) | `#FFFFFF` (white) | **3.8:1** | ❌ | ❌ |
| `#00AA00` (success-500) | `#C8FFC8` (success-50) | **2.5:1** | ❌ | ❌ |
| `#006600` (success-700) | `#C8FFC8` (success-50) | **5.9:1** | ✅ AA | ❌ AAA |
| `#FCB900` (warning) | `#FFFFFF` (white) | **1.8:1** | ❌ | ❌ |
| `#00E6FF` (accent) | `#001A72` (primary) | **8.2:1** | ✅ AA | ✅ AAA |

### Contrast Notes

- **neutral-400** (`#9CA3AF`): Only use for placeholder text or decorative elements, not body copy
- **success-500** (`#00AA00`): Passes AA for large text (18px+) and icons on white only. For body text on white use `success-700` (`#006600`). For text on `success-50` backgrounds use `success-700`
- **warning-500** (`#FCB900`): Do NOT use as text on white — use as background with dark (`neutral-900`) text
- **accent-500** (`#00E6FF`): Do NOT use as text on white — pair with `primary-500` background

---

## 9. File Structure

```
libs/design-system/
├── project.json
├── tsconfig.json
├── DESIGN-SYSTEM-SPEC.md          ← this file
└── src/
    ├── index.ts                   ← barrel export for tokens
    ├── tokens/
    │   ├── index.ts
    │   ├── colors.ts
    │   ├── typography.ts
    │   ├── spacing.ts
    │   ├── radius.ts
    │   ├── elevation.ts
    │   └── motion.ts
    ├── tailwind/
    │   └── preset.js              ← shared Tailwind preset
    ├── primeng/
    │   └── ig-preset.ts           ← PrimeNG Aura theme override
    └── styles/
        ├── index.scss             ← main SCSS entry point
        ├── _tokens.scss           ← CSS custom properties
        ├── _typography.scss       ← @font-face + type scale classes
        ├── _reset.scss            ← CSS reset
        ├── _utilities.scss        ← semantic utility classes
        └── _components.scss       ← button/card/alert/badge styles
```

## 10. Integration

### Shell (host)
```ts
// tailwind.config.js
const igPreset = require('../../libs/design-system/src/tailwind/preset');
module.exports = { presets: [igPreset], ... };

// styles.scss
@use "../../../libs/design-system/src/styles" as ds;

// app.config.ts
import IgPreset from '@ig/design-system/primeng/ig-preset';
```

### Sales / Entity (remotes)
```ts
// tailwind.config.js — use relative path to shell workspace
const igPreset = require('../../../portal-shell/libs/design-system/src/tailwind/preset');
module.exports = { presets: [igPreset], ... };

// styles.scss
@use "../../../../portal-shell/libs/design-system/src/styles" as ds;
```

### tsconfig.base.json (each workspace)
```json
{
  "compilerOptions": {
    "paths": {
      "@ig/design-system": ["../portal-shell/libs/design-system/src/index.ts"],
      "@ig/design-system/*": ["../portal-shell/libs/design-system/src/*"]
    }
  }
}
```
