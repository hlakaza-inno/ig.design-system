/**
 * Innovation Group Design System — Motion Tokens
 *
 * Transition durations and easing curves for consistent animation behavior.
 */

export const duration = {
  fast: '100ms',    // micro-interactions: hover, toggle
  normal: '200ms',  // standard transitions: expand, slide
  slow: '300ms',    // complex animations: modal open, page transition
} as const;

export const easing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',  // general purpose
  in: 'cubic-bezier(0.4, 0, 1, 1)',          // enter / accelerate
  out: 'cubic-bezier(0, 0, 0.2, 1)',         // exit / decelerate
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',     // symmetric
} as const;
