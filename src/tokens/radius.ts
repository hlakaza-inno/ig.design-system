/**
 * Innovation Group Design System — Border Radius Tokens
 *
 * Enterprise-appropriate radii. Aligned to PrimeNG preset and Tailwind rounded-* classes.
 */

export const radius = {
  none: '0px',      // rounded-none — sharp corners
  sm: '4px',        // rounded-sm  — badges, chips
  md: '6px',        // rounded-md  — inputs, cards (default)
  lg: '8px',        // rounded-lg  — modals, dialogs
  xl: '12px',       // rounded-xl  — large containers
  full: '9999px',   // rounded-full — pills, avatars
} as const;
