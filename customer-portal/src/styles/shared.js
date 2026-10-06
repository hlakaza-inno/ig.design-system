import { css } from 'lit';

/**
 * Shared component styles, ported from ig.design-system `_components.scss`
 * (buttons, badges, alerts, cards) and `_typography.scss` (type scale).
 * Shadow DOM does not inherit global classes, so every component adopts this.
 *
 * Deliberate tweaks (portal is customer-facing, mobile-first):
 *  - `.btn` has a 44px minimum height for touch targets.
 *  - Focus ring uses primary-500: accent cyan is invisible on white.
 *  - Status pills pair solid badge colours with text that passes AA (see `.pill-*`).
 */
export const sharedStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  h1, h2, h3, h4, p { margin: 0; }
  button { font: inherit; }

  /* Type scale */
  .heading-lg { font-size: var(--ig-text-xl); line-height: var(--ig-leading-lg); font-weight: 600; }
  .heading-md { font-size: var(--ig-text-lg); line-height: var(--ig-leading-lg); font-weight: 600; }
  .heading-sm { font-size: var(--ig-text-base); line-height: var(--ig-leading-base); font-weight: 600; }
  .body-lg { font-size: var(--ig-text-base); line-height: var(--ig-leading-base); }
  .body-md { font-size: var(--ig-text-sm); line-height: var(--ig-leading-sm); }
  .caption { font-size: var(--ig-text-xs); line-height: var(--ig-leading-xs); }
  .muted { color: var(--ig-color-neutral-500); }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ig-space-2);
    min-height: 44px;
    padding: var(--ig-space-2) var(--ig-space-4);
    font-family: var(--ig-font-family-body);
    font-size: var(--ig-text-sm);
    line-height: var(--ig-leading-sm);
    font-weight: 500;
    border: 2px solid transparent;
    border-radius: var(--ig-radius-md);
    cursor: pointer;
    text-decoration: none;
    transition: all var(--ig-duration-normal) var(--ig-easing-default);
  }
  .btn:focus-visible,
  .drop:focus-visible {
    outline: 2px solid var(--ig-color-primary-500);
    outline-offset: 2px;
  }
  .btn[disabled],
  .btn[aria-disabled='true'] { cursor: not-allowed; }
  .btn-primary {
    background: var(--ig-color-primary-500);
    color: #fff;
    border-color: var(--ig-color-primary-500);
    box-shadow: var(--ig-shadow-xs);
  }
  .btn-primary:hover:not([disabled]) {
    background: transparent;
    color: var(--ig-color-primary-500);
    box-shadow: none;
  }
  .btn-primary:active:not([disabled]) {
    background: var(--ig-color-primary-700);
    border-color: var(--ig-color-primary-700);
    color: #fff;
  }
  .btn-primary[disabled] {
    background: var(--ig-color-neutral-200);
    border-color: var(--ig-color-neutral-200);
    color: var(--ig-color-neutral-400);
    box-shadow: none;
  }
  .btn-secondary {
    background: transparent;
    color: var(--ig-color-primary-500);
    border-color: var(--ig-color-primary-500);
  }
  .btn-secondary:hover:not([disabled]) {
    background: var(--ig-color-primary-500);
    color: #fff;
  }
  .btn-secondary:active:not([disabled]) {
    background: var(--ig-color-primary-700);
    border-color: var(--ig-color-primary-700);
    color: #fff;
  }

  /* Alerts */
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--ig-space-3);
    padding: var(--ig-space-3) var(--ig-space-4);
    border-radius: var(--ig-radius-md);
    border-left: 4px solid;
    font-size: var(--ig-text-sm);
    line-height: var(--ig-leading-sm);
  }
  .alert svg { flex: none; margin-top: 1px; }
  .alert-error { background: var(--ig-color-error-50); color: var(--ig-color-error-700); border-left-color: var(--ig-color-error-500); }
  .alert-success { background: var(--ig-color-success-50); color: var(--ig-color-neutral-800); border-left-color: var(--ig-color-success-500); }
  .alert-info { background: var(--ig-color-primary-50); color: var(--ig-color-primary-700); border-left-color: var(--ig-color-primary-500); }
  .alert-warning { background: var(--ig-color-warning-50); color: var(--ig-color-neutral-800); border-left-color: var(--ig-color-warning-500); }

  /* Status pills (badge shape), weighted by urgency for the customer:
     Rejected = badge-error (fix now), Requested = badge-warning (to do),
     Submitted = soft primary (we're reviewing, nothing to do), Approved = badge-primary (done). */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: var(--ig-space-2);
    padding: var(--ig-space-2) var(--ig-space-3);
    border-radius: var(--ig-radius-full);
    font-size: var(--ig-text-sm);
    line-height: var(--ig-leading-sm);
    font-weight: 500;
    white-space: nowrap;
  }
  .pill-rejected { background: var(--ig-color-error-500); color: #fff; }
  .pill-requested { background: var(--ig-color-warning-500); color: var(--ig-color-neutral-900); }
  .pill-submitted { background: var(--ig-color-primary-50); color: var(--ig-color-primary-700); }
  .pill-approved { background: var(--ig-color-primary-500); color: #fff; }

  /* Card */
  .card {
    background: var(--ig-color-neutral-0);
    border: 1px solid var(--ig-color-neutral-200);
    border-radius: var(--ig-radius-md);
    box-shadow: var(--ig-shadow-xs);
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition: none !important; animation: none !important; }
  }
`;
