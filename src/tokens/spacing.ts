/**
 * Innovation Group Design System — Spacing Tokens
 *
 * 8pt grid system. Primary stops: 8, 16, 24, 32px.
 * Maps 1:1 with Tailwind's default spacing scale (4px base).
 */

export const spacing = {
  0: '0px',
  1: '4px',    // 0.25rem
  2: '8px',    // 0.5rem  ← 8pt stop
  3: '12px',   // 0.75rem
  4: '16px',   // 1rem    ← 8pt stop
  5: '20px',   // 1.25rem
  6: '24px',   // 1.5rem  ← 8pt stop
  8: '32px',   // 2rem    ← 8pt stop
  10: '40px',  // 2.5rem  ← 8pt stop
  12: '48px',  // 3rem    ← 8pt stop
  16: '64px',  // 4rem    ← 8pt stop
  20: '80px',  // 5rem    ← 8pt stop
  24: '96px',  // 6rem    ← 8pt stop
} as const;
