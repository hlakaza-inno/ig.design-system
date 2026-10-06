/**
 * Innovation Group Design System — Color Tokens
 *
 * Brand anchors:
 *   Primary (Navy): #001A72
 *   Accent (Cyan):  #00E6FF
 *
 * All UI colors MUST reference these tokens.
 * Do not invent new colors or use ad-hoc hex values.
 */

// ─── Brand ───────────────────────────────────────────────
export const brand = {
  primary: '#001A72',
  accent: '#00E6FF',
} as const;

// ─── Primary Palette (Navy) ──────────────────────────────
export const primary = {
  50: '#EFF5FD',
  100: '#B3BAD6',
  200: '#8090BA',
  300: '#4D669E',
  400: '#264089',
  500: '#001A72', // = brand.primary
  600: '#001766',
  700: '#001355',
  800: '#000F44',
  900: '#000A2E',
} as const;

// ─── Accent Palette (Cyan) ──────────────────────────────
// ⚠ WCAG: #00E6FF on white FAILS contrast.
//   Use only as decorative accents, borders, or on dark backgrounds.
export const accent = {
  50: '#E6FCFF',
  100: '#B3F5FF',
  200: '#80EEFF',
  300: '#4DE8FF',
  400: '#26E7FF',
  500: '#00E6FF', // = brand.accent
  600: '#00B8CC',
  700: '#008A99',
  800: '#005C66',
  900: '#002E33',
} as const;

// ─── Error ───────────────────────────────────────────────
export const error = {
  50: '#FEF2F2',
  100: '#FDE2E2',
  200: '#FACACA',
  300: '#F5A5A5',
  400: '#E56060',
  500: '#CF2E2E', // primary error
  600: '#B02525',
  700: '#911D1D',
  800: '#731717',
  900: '#4C0F0F',
} as const;

// ─── Warning ─────────────────────────────────────────────
// ⚠ WCAG: #FCB900 on white FAILS contrast.
//   Always pair with dark text on warning backgrounds.
// Use #FF6900 only for critical warnings.
export const warning = {
  50: '#FFF8E1',
  100: '#FFECB3',
  200: '#FFE082',
  300: '#FFD54F',
  400: '#FFCA28',
  500: '#FCB900', // default warning
  600: '#FF6900', // critical warnings only
  700: '#E65100',
  800: '#BF360C',
  900: '#8D2508',
} as const;

// ─── Success ─────────────────────────────────────────────
// ⚠ WCAG: #00AA00 on white is marginal (contrast 3.8:1).
//   Use for icons/large text only; pair with dark text for body.
//   Use success-50 (#c8ffc8) for backgrounds with dark text.
export const success = {
  50: '#C8FFC8',  // supplied — light background
  100: '#A0F0A0',
  200: '#78E278',
  300: '#50CC50',
  400: '#28BB28',
  500: '#00AA00', // supplied — primary success
  600: '#008800',
  700: '#006600',
  800: '#004400',
  900: '#002200',
} as const;

// ─── Neutral ─────────────────────────────────────────────
export const neutral = {
  0: '#FFFFFF',
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#384146',
  800: '#1F2937',
  900: '#111928',
} as const;

// ─── Semantic Tokens ─────────────────────────────────────
// Maps to primitives above. Use these in components.
export const semantic = {
  text: {
    primary: neutral[900],
    secondary: neutral[500],
    inverse: neutral[0],
    brand: primary[500],
    link: primary[500],
    linkHover: primary[600],
  },
  bg: {
    primary: neutral[50],
    secondary: neutral[100],
    brand: primary[500],
    accent: accent[500],
  },
  border: {
    default: neutral[200],
    strong: neutral[400],
    brand: primary[500],
  },
} as const;
