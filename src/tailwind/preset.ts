/**
 * Innovation Group Design System — Shared Tailwind Preset
 *
 * All MFEs extend from this preset to ensure consistent design tokens.
 * Single source of truth — imports directly from design system tokens.
 *
 * Usage in tailwind.config.ts:
 *   import igPreset from '../../libs/design-system/src/tailwind/preset';
 *   presets: [igPreset]
 */
import type { Config } from 'tailwindcss';
import { primary, accent, error, warning, success, neutral } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { elevation } from '../tokens/elevation';
import { duration, easing } from '../tokens/motion';
import { fontFamily } from '../tokens/typography';

const preset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: { ...primary, DEFAULT: primary[500] },
        accent: { ...accent, DEFAULT: accent[500] },
        error: { ...error, DEFAULT: error[500] },
        warning: { ...warning, DEFAULT: warning[500] },
        success: { ...success, DEFAULT: success[500] },
        neutral: { ...neutral },
        // Legacy aliases (backward compat)
        secondary: '#8899A8',
        dark: '#111928',
        'light-gray': '#DFE4EA',
        shadow: 'rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        display: fontFamily.display.split(', '),
        body: fontFamily.body.split(', '),
        mono: fontFamily.mono.split(', '),
        // Legacy alias
        sans: fontFamily.body.split(', '),
      },
      borderRadius: {
        ...radius,
        DEFAULT: radius.md,
      },
      boxShadow: {
        xs: elevation.xs,
        sm: elevation.sm,
        DEFAULT: elevation.sm,
        md: elevation.md,
        lg: elevation.lg,
        xl: elevation.xl,
      },
      transitionDuration: {
        fast: duration.fast,
        normal: duration.normal,
        slow: duration.slow,
      },
      transitionTimingFunction: {
        default: easing.default,
        in: easing.in,
        out: easing.out,
      },
    },
  },

};

export default preset;
