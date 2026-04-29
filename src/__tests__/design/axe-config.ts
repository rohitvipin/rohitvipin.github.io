import { configureAxe } from "jest-axe";

/**
 * jsdom cannot compute layout, focus order, or pixel-accurate styles.
 * Disable rules that depend on those signals — they would either skip
 * silently or report false positives. Real-browser coverage of these
 * dimensions lives in the Playwright suite (axe + Lighthouse).
 */
export const axe = configureAxe({
  rules: {
    "color-contrast": { enabled: false },
    "target-size": { enabled: false },
    "focus-order-semantics": { enabled: false },
  },
});
