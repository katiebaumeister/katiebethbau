/**
 * Fabric Finder — shared types
 * Extend these when adding yardage, stitch guidance, designer refs, etc.
 */

// --- Filter / user input types (used by Finder form and recommendation engine) ---

export type ClimateOption = "cold" | "temperate" | "hot" | "humid" | "dry";

export type DurabilityOption = "low" | "medium" | "high";

export type ComfortOption =
  | "soft-drapey"
  | "breathable"
  | "structured"
  | "low-maintenance";

export interface FinderFilters {
  climate: ClimateOption | null;
  skinToneId: string | null;
  durability: DurabilityOption | null;
  comfort: ComfortOption | null;
}

// --- Skin tone (real data; 30-shade system) ---

export type Undertone = "warm" | "cool" | "neutral" | "olive";

export type Depth = "fair" | "light" | "light-medium" | "medium" | "tan" | "medium-deep" | "dark" | "deep" | "rich";

export interface SkinTone {
  id: string;
  shadeNumber: number;
  name: string;
  description: string;
  baseHex: string;
  undertone: Undertone;
  depth: Depth;
  /** Coordinating color names for fabric recommendations (e.g. "porcelain sand", "blush stone") */
  coordinatingNeutralPalette: string[];
}

// --- Fabric (extensible for yardage, stitches, runway refs) ---

export type ClimateTag = ClimateOption;

export interface Fabric {
  id: string;
  name: string;
  category: string;
  fiberContent: string;
  climateTags: ClimateTag[];
  /** 1–5; used for durability matching (placeholder scoring until real data) */
  durabilityScore: number;
  comfortTags: ComfortOption[];
  /** soft → structured spectrum (placeholder) */
  structureLevel: "soft" | "medium-soft" | "medium" | "medium-structured" | "structured";
  /** 1–5 (placeholder until real data) */
  breathabilityScore: number;
  careLevel: string;
  /** Which undertones this fabric flatters (real data drives color recs) */
  recommendedForSkinUndertones: Undertone[];
  /** Color families that coordinate with the user's skin tone recommendation */
  recommendedColorFamilies: string[];
  commonUses: string[];
  notes: string;
  // Future: plug in when data is ready
  yardageRules?: string;
  stitchRecommendations?: string[];
  runwayReferences?: string[];
  designerExamples?: string[];
}

// --- Recommendation result (what we show on results page) ---

/** Score breakdown for UI to explain why a fabric was chosen. All scores 0–100. */
export interface RecommendationScoreBreakdown {
  total_score: number;
  skin_tone_score: number;
  climate_score: number;
  durability_score: number;
  comfort_score: number;
  /** Human-readable summary of why this fabric was chosen */
  explanation: string;
}

export interface FabricRecommendation {
  fabric: Fabric;
  /** 0–100; same as breakdown.total_score (kept for backward compatibility) */
  score: number;
  /** Per-dimension scores and explanation for the UI */
  scoreBreakdown: RecommendationScoreBreakdown;
  /** Human-readable reasons this fabric was recommended (detailed list) */
  matchReasons: string[];
  /** Best coordinating color family for this user's skin tone */
  bestColorFamily: string;
  /** Optional; future: exact yardage estimate */
  estimatedYardage?: string;
  /** Optional; future: stitch/seam guidance */
  stitchGuidance?: string[];
  /** Optional; future: designer/runway inspiration */
  designerInspiration?: string[];
}

// --- Master fabric database schema (normalized, for detail page & future API) ---

export interface FabricRecord {
  id: string;
  name: string;
  category: string;
  fiber_family: string;
  construction: "woven" | "knit" | "nonwoven" | "lace" | "pile" | "coated" | "composite";
  weight_class: "ultralight" | "light" | "medium" | "medium-heavy" | "heavy";
  stretch_level: "none" | "low" | "moderate" | "high";
  drape_level: "crisp" | "balanced" | "fluid";
  texture_level: "smooth" | "textured" | "high-texture" | "soft";
  opacity: "sheer" | "semi-sheer" | "opaque";
  durability_level: "low" | "medium" | "high" | "very-high";
  stitch_profile_id: string;
  climate_profile_id: string;
  designer_profile_id: string;
  common_uses: string[];
  notes?: string;
  /** Optional; for detail page color guidance (skin-tone-agnostic suggestions) */
  recommended_color_families?: string[];
}

export interface StitchProfile {
  id: string;
  name: string;
  seam_recommendations: string[];
  stitch_recommendations: string[];
  needle_recommendations: string[];
  edge_finish_recommendations: string[];
  pressing_notes: string[];
  caution_notes?: string[];
}

export interface ClimateProfile {
  id: string;
  name: string;
  hot: number;
  humid: number;
  temperate: number;
  cool: number;
  cold: number;
  dry: number;
  notes: string[];
}

export interface DesignerUsageProfile {
  id: string;
  name: string;
  historical_designers: string[];
  runway_or_house_associations: string[];
  usage_examples: string[];
  notes?: string[];
}
