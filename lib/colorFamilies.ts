/**
 * Map fabric color family names to hex for swatch display.
 * Curated neutral and color-pop palettes for recommendation cards.
 */

const COLOR_FAMILY_HEX: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f0",
  ivory: "#fffff0",
  ecru: "#c2b280",
  cream: "#fffdd0",
  oatmeal: "#d4c5a9",
  natural: "#e8dcc4",
  flax: "#eedc82",
  grey: "#6b7280",
  gray: "#6b7280",
  charcoal: "#36454f",
  navy: "#1e3a5f",
  midnight: "#191970",
  indigo: "#4b0082",
  brown: "#5c4033",
  camel: "#c19a6b",
  rust: "#b7410e",
  terracotta: "#e2725b",
  burgundy: "#800020",
  wine: "#722f37",
  forest: "#228b22",
  olive: "#6b8e23",
  sage: "#9dc183",
  khaki: "#c3b091",
  emerald: "#50c878",
  gold: "#d4af37",
  champagne: "#f7e7ce",
  blush: "#de5d83",
  "dusty rose": "#dcae96",
  "dusty blue": "#a0aeb2",
};

/** Returns hex for a color family name (case-insensitive). Fallback for unknown names. */
export function getHexForColorFamily(name: string): string {
  const key = name.toLowerCase().trim();
  return COLOR_FAMILY_HEX[key] ?? "#9ca3af";
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

/** 5–10 purely neutral shades: whites, off-whites, greys, navys, blacks */
export const NEUTRAL_SWATCHES: ColorSwatch[] = [
  { name: "White", hex: "#fafafa" },
  { name: "Off-white", hex: "#f5f5f0" },
  { name: "Ivory", hex: "#fffff0" },
  { name: "Cream", hex: "#fffdd0" },
  { name: "Light grey", hex: "#b0b0b0" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Charcoal", hex: "#36454f" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Black", hex: "#1a1a1a" },
];

/** 3–5 color pops: reds, golds, silvers, greens, purples */
export const COLOR_POP_SWATCHES: ColorSwatch[] = [
  { name: "Red", hex: "#c41e3a" },
  { name: "Gold", hex: "#d4af37" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "Green", hex: "#228b22" },
  { name: "Purple", hex: "#6a0dad" },
];
