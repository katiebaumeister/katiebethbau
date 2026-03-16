/**
 * Reusable enums/constants for fabric taxonomy.
 * Use for validation, filters, and consistent display.
 */

export const CONSTRUCTION = [
  "woven",
  "knit",
  "nonwoven",
  "lace",
  "pile",
  "coated",
  "composite",
] as const;
export type Construction = (typeof CONSTRUCTION)[number];

export const WEIGHT_CLASS = [
  "ultralight",
  "light",
  "medium",
  "medium-heavy",
  "heavy",
] as const;
export type WeightClass = (typeof WEIGHT_CLASS)[number];

export const STRETCH_LEVEL = ["none", "low", "moderate", "high"] as const;
export type StretchLevel = (typeof STRETCH_LEVEL)[number];

export const DRAPE_LEVEL = ["crisp", "balanced", "fluid"] as const;
export type DrapeLevel = (typeof DRAPE_LEVEL)[number];

export const TEXTURE_LEVEL = ["smooth", "textured", "high-texture", "soft"] as const;
export type TextureLevel = (typeof TEXTURE_LEVEL)[number];

export const OPACITY = ["sheer", "semi-sheer", "opaque"] as const;
export type Opacity = (typeof OPACITY)[number];

export const DURABILITY_LEVEL = ["low", "medium", "high", "very-high"] as const;
export type DurabilityLevel = (typeof DURABILITY_LEVEL)[number];

/** Category labels for grouping (cotton, linen, silk, etc.) */
export const FABRIC_CATEGORIES = [
  "cotton",
  "linen",
  "silk",
  "wool",
  "rayon",
  "cupro",
  "acetate",
  "hemp",
  "ramie",
  "bamboo",
  "modal",
  "lyocell",
  "tencel",
  "polyester",
  "nylon",
  "knit",
  "stretch",
  "technical",
  "lace",
  "formal",
  "utility",
] as const;
export type FabricCategory = (typeof FABRIC_CATEGORIES)[number];
