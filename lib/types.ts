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
  /** Hair shade code for combined color profile (e.g. "golden_blonde"). */
  hairCode?: string | null;
  /** Eye shade code for combined color profile (e.g. "amber"). */
  eyeCode?: string | null;
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

// --- Reference library (runway, vintage patterns, museum, editorial) ---

export type ReferenceSourceType =
  | "runway_look"
  | "designer_collection"
  | "museum_garment"
  | "editorial"
  | "vintage_pattern"
  | "costume_archive"
  | "auction_listing"
  | "brand_product";

export type ReferenceSeason = "SS" | "FW" | "Resort" | "Pre-Fall" | "Unknown";

export type ReferenceRightsStatus =
  | "unknown"
  | "internal-only"
  | "link-only"
  | "licensed";

export type ReferenceVerificationStatus =
  | "unreviewed"
  | "reviewed"
  | "expert-reviewed";

export interface ReferenceSource {
  id: string;
  source_type: ReferenceSourceType;
  title: string;
  creator_name?: string;
  house_or_brand?: string;
  year?: number;
  season?: ReferenceSeason;
  era_bucket?: string;
  garment_type?: string;
  source_name?: string;
  source_url?: string;
  image_url?: string;
  thumbnail_url?: string;
  description?: string;
  rights_status?: ReferenceRightsStatus;
  verification_status?: ReferenceVerificationStatus;
  /** Short phrases for teaching (e.g. "shows bias drape clearly") */
  educational_value?: string[];
}

export type MaterialEvidenceType =
  | "explicit_source_text"
  | "visual_inference"
  | "expert_tagging"
  | "pattern_recommendation"
  | "archival_metadata";

export interface ReferenceMaterialObservation {
  id: string;
  reference_source_id: string;
  fabric_id?: string;
  material_label_raw?: string;
  confidence_score: number;
  evidence_type: MaterialEvidenceType;
  is_primary_fabric: boolean;
  notes?: string;
}

export interface ReferenceAttributes {
  id: string;
  reference_source_id: string;
  silhouette_tags: string[];
  construction_tags: string[];
  surface_tags: string[];
  weight_tags: string[];
  drape_tags: string[];
  structure_tags: string[];
  color_family_tags: string[];
  occasion_tags: string[];
  climate_tags: string[];
}

export interface ReferencePatternLink {
  id: string;
  reference_source_id: string;
  pattern_company?: string;
  pattern_number?: string;
  pattern_year?: number;
  view_label?: string;
  recommended_fabrics_raw?: string[];
  notions_raw?: string[];
  yardage_raw?: string[];
  size_range_raw?: string;
  envelope_notes?: string;
}

export type FabricReferenceRelationshipType =
  | "explicit_use"
  | "probable_use"
  | "similar_hand"
  | "similar_surface"
  | "pattern_recommended"
  | "construction_analogue";

export interface FabricReferenceLink {
  id: string;
  fabric_id: string;
  reference_source_id: string;
  relationship_type: FabricReferenceRelationshipType;
  confidence_score: number;
  notes?: string;
}

export interface ReferenceDesignerLink {
  id: string;
  reference_source_id: string;
  designer_name: string;
  house_name?: string;
  collection_name?: string;
}

/** Computed view for UI: one card per reference with kind and confidence */
export type ReferenceCardKind = "runway" | "vintage" | "museum";

export type ConfidenceLabel = "high" | "medium" | "low";

export interface ReferenceCardView {
  reference_id: string;
  title: string;
  kind: ReferenceCardKind;
  confidence_label: ConfidenceLabel;
  primary_fabric_name?: string;
  material_label_raw?: string;
  summary: string;
  year?: number;
  season?: string;
  garment_type?: string;
  house_or_brand?: string;
  creator_name?: string;
  era_bucket?: string;
  educational_value?: string[];
  /** Vintage-only: pattern company, number, recommended fabrics */
  pattern_company?: string;
  pattern_number?: string;
  recommended_fabrics_raw?: string[];
  notions_raw?: string[];
  yardage_raw?: string[];
  envelope_notes?: string;
}

// --- Color profile system (skin + hair + eye + combined) ---
// Designed to attach fabrics, metals, prints, makeup, runway refs, stitch guidance later.

export type ColorProfileUndertone =
  | "warm"
  | "cool"
  | "neutral"
  | "olive"
  | "golden"
  | "peach"
  | "red"
  | "rosy"
  | "ash";

export type DepthFamily =
  | "very_fair"
  | "fair"
  | "light"
  | "light_medium"
  | "medium"
  | "tan"
  | "dark"
  | "deep";

export type ContrastLevel = "low" | "medium" | "high";

export type HairFamily =
  | "blonde"
  | "brown"
  | "black"
  | "red"
  | "auburn"
  | "gray"
  | "white";

export type EyeFamily =
  | "blue"
  | "green"
  | "hazel"
  | "brown"
  | "gray"
  | "amber"
  | "mixed";

export type IntensityLevel = "soft" | "medium" | "bright" | "deep";

export type MetalRecommendation =
  | "soft_gold"
  | "yellow_gold"
  | "champagne_gold"
  | "rose_gold"
  | "silver"
  | "gunmetal"
  | "bronze"
  | "oxidized_bronze";

export interface RawShadeData {
  name: string;
  base_hex: string;
  palette: string[];
}

export interface SkinShade extends RawShadeData {
  id: string;
  shade_number: number;
  depth_family: DepthFamily;
  undertone_family: ColorProfileUndertone[];
  temperature_bias: "warm" | "cool" | "neutral";
  contrast_default: ContrastLevel;
  recommended_metals: MetalRecommendation[];
  best_whites: string[];
  best_denims: string[];
  avoid_neutrals: string[];
}

export type HairDepthLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface HairShade {
  id: string;
  code: string;
  name: string;
  family: HairFamily;
  depth_level: HairDepthLevel;
  undertone_family: ColorProfileUndertone[];
  default_hex: string;
  intensity: IntensityLevel;
  recommended_metals: MetalRecommendation[];
  notes?: string;
}

export type EyePattern =
  | "solid"
  | "flecked"
  | "ringed"
  | "mixed"
  | "central_heterochromia";

export interface EyeShade {
  id: string;
  code: string;
  name: string;
  family: EyeFamily;
  undertone_family: ColorProfileUndertone[];
  intensity: IntensityLevel;
  default_hex: string;
  pattern?: EyePattern;
}

export type TemperatureSummary =
  | "warm"
  | "cool"
  | "neutral-balanced"
  | "olive-balanced";

export interface CombinedProfile {
  id: string;
  code: string;
  skin_shade_number: number;
  hair_code: string;
  eye_code: string;
  overall_contrast: ContrastLevel;
  temperature_summary: TemperatureSummary;
  top_neutrals: string[];
  accent_colors: string[];
  avoid_colors: string[];
  best_metals: MetalRecommendation[];
  notes: string;
}

export type OverrideEffect = "boost" | "penalize" | "avoid" | "highlight";

export type OverrideTargetType =
  | "neutral"
  | "accent"
  | "metal"
  | "denim"
  | "print";

export interface RecommendationOverride {
  id: string;
  skin_shade_number?: number;
  hair_code?: string;
  eye_code?: string;
  effect: OverrideEffect;
  target_type: OverrideTargetType;
  target_value: string;
  score_delta: number;
  reason: string;
}
