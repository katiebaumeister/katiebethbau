/**
 * Design tokens for Fabric Finder — editorial, fashion-focused palette.
 * Use these for consistent spacing, colors, and typography.
 */

export const theme = {
  colors: {
    background: "#FAFAF9",
    surface: "#FFFFFF",
    border: "#E7E5E4",
    muted: "#A8A29E",
    foreground: "#1C1917",
    accent: "#57534E",
    accentSoft: "#D6D3D1",
  },
  font: {
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    full: "9999px",
  },
  shadow: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    hover: "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.04)",
  },
} as const;
