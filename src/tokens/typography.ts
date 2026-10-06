/**
 * Innovation Group Design System — Typography Tokens
 *
 * Display/Headings: prota_proregular (Prota Pro)
 * Body/UI text:     neue-haas-unica (Neue Haas Unica via Adobe TypeKit)
 * Code:             System monospace stack
 *
 * Type scale aligned to Tailwind text-* classes.
 */

// ─── Font Families ───────────────────────────────────────
export const fontFamily = {
  display: "'prota_proregular', 'Helvetica Neue', Arial, sans-serif",
  body: "'neue-haas-unica', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
} as const;

// ─── Font Sources ────────────────────────────────────────
/** Adobe TypeKit CSS import URL for Neue Haas Unica */
export const typekitUrl =
  'https://p.typekit.net/p.css?s=1&k=qqq6ejd&ht=tk&f=39512.39519.39521.39523&a=9841214&app=typekit&e=css';

// ─── Type Scale ──────────────────────────────────────────
// Each entry: [fontSize, lineHeight, fontWeight, fontFamily token key]
export const typeScale = {
  'display-xl': { size: '2.25rem', lineHeight: '2.5rem', weight: 700, family: 'display' },   // 36px — text-4xl
  'display-lg': { size: '1.875rem', lineHeight: '2.25rem', weight: 700, family: 'display' },  // 30px — text-3xl
  'display-md': { size: '1.5rem', lineHeight: '2rem', weight: 600, family: 'display' },       // 24px — text-2xl
  'heading-lg': { size: '1.25rem', lineHeight: '1.75rem', weight: 600, family: 'body' },      // 20px — text-xl
  'heading-md': { size: '1.125rem', lineHeight: '1.75rem', weight: 600, family: 'body' },     // 18px — text-lg
  'heading-sm': { size: '1rem', lineHeight: '1.5rem', weight: 600, family: 'body' },          // 16px — text-base
  'body-lg': { size: '1rem', lineHeight: '1.5rem', weight: 400, family: 'body' },             // 16px — text-base
  'body-md': { size: '0.875rem', lineHeight: '1.25rem', weight: 400, family: 'body' },        // 14px — text-sm
  'body-sm': { size: '0.75rem', lineHeight: '1rem', weight: 400, family: 'body' },            // 12px — text-xs
  label: { size: '0.875rem', lineHeight: '1.25rem', weight: 500, family: 'body' },            // 14px — text-sm
  caption: { size: '0.75rem', lineHeight: '1rem', weight: 400, family: 'body' },              // 12px — text-xs
} as const;
