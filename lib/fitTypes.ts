/**
 * Fit recommendation system — measurement profiles, body shape, garment examples,
 * pattern blocks, fit assessments, and adjustment recommendations.
 * Schema aligns with suggested Postgres tables; data is in-memory/local for Phase 1.
 */

export type MeasurementUnits = "in" | "cm";

export type Posture =
  | "balanced"
  | "erect"
  | "stooped"
  | "swayback"
  | "kyphotic";

export type ShoulderSlope = "square" | "balanced" | "sloped";
export type ShoulderBalance = "narrow" | "average" | "broad";

export type BustShape =
  | "small"
  | "average"
  | "full"
  | "projected"
  | "full_upper"
  | "full_lower";

export type SeatShape = "flat" | "average" | "prominent";

export type AbdomenShape = "flat" | "average" | "full_low" | "full_high";

export type LegBalance =
  | "short_torso_long_leg"
  | "balanced"
  | "long_torso_short_leg";

/** Circumference, vertical, and horizontal measurements + optional shape notes */
export interface MeasurementProfile {
  id: string;
  profile_name: string;
  units: MeasurementUnits;

  bust_full?: number;
  bust_high?: number;
  underbust?: number;
  waist?: number;
  high_hip?: number;
  full_hip?: number;
  abdomen?: number;

  neck?: number;
  bicep?: number;
  wrist?: number;
  thigh?: number;
  knee?: number;
  calf?: number;
  ankle?: number;

  height_total?: number;
  shoulder_to_floor?: number;
  nape_to_waist?: number;
  front_waist_length?: number;
  back_waist_length?: number;
  waist_to_hip?: number;
  waist_to_knee?: number;
  waist_to_floor?: number;
  crotch_depth?: number;
  inseam?: number;
  rise_front?: number;
  rise_back?: number;

  shoulder_width?: number;
  across_front?: number;
  across_back?: number;
  bust_span?: number;
  back_width?: number;

  posture?: Posture;
  shoulder_slope?: ShoulderSlope;
  shoulder_balance?: ShoulderBalance;
  bust_shape?: BustShape;
  seat_shape?: SeatShape;
  abdomen_shape?: AbdomenShape;
  leg_balance?: LegBalance;
}

/** Derived ratios and computed body-shape hints from a measurement profile */
export interface MeasurementProfileDerived {
  measurement_profile_id: string;

  waist_to_hip_ratio?: number;
  bust_to_waist_ratio?: number;
  shoulder_to_hip_ratio?: number;
  high_hip_to_full_hip_ratio?: number;
  front_to_back_waist_delta?: number;
  rise_balance_delta?: number;
  torso_leg_ratio?: number;

  bust_waist_drop?: number;
  hip_waist_drop?: number;
  shoulder_hip_delta?: number;

  derived_body_shape?: PrimaryShape;
  derived_vertical_balance?: VerticalBalance;
  derived_fit_flags: string[];
}

export type PrimaryShape =
  | "hourglass"
  | "top_hourglass"
  | "bottom_hourglass"
  | "pear"
  | "spoon"
  | "rectangle"
  | "inverted_triangle"
  | "apple"
  | "oval"
  | "diamond";

export type SecondaryShape =
  | "balanced"
  | "short_waisted"
  | "long_waisted"
  | "petite_vertical"
  | "long_vertical"
  | "full_bust"
  | "small_bust"
  | "full_seat"
  | "flat_seat"
  | "prominent_abdomen"
  | "broad_shoulder"
  | "narrow_shoulder";

export interface BodyShapeProfile {
  id: string;
  measurement_profile_id: string;

  primary_shape?: PrimaryShape;
  secondary_shape?: SecondaryShape;
  user_selected_shape?: string;
  confidence_score?: number;
  explanation: string[];
}

export type GarmentSourceType =
  | "archival_look"
  | "runway_look"
  | "commercial_pattern"
  | "historical_pattern"
  | "editorial_reference"
  | "custom_block";

export type GarmentCategory =
  | "dress"
  | "gown"
  | "blouse"
  | "shirt"
  | "jacket"
  | "coat"
  | "corset"
  | "bra_top"
  | "skirt"
  | "pant"
  | "short"
  | "bodysuit";

export type WaistlineType =
  | "natural"
  | "raised"
  | "dropped"
  | "empire"
  | "basque"
  | "none";

export type FitType =
  | "close_fit"
  | "semi_fit"
  | "relaxed"
  | "structured"
  | "draped";

export interface GarmentExample {
  id: string;
  title: string;
  source_type: GarmentSourceType;
  source_name?: string;
  source_designer?: string;
  source_year?: number;
  era?: string;

  category: GarmentCategory;
  silhouette_family?: string;
  waistline_type?: WaistlineType;
  fit_type?: FitType;

  ease_bust?: number;
  ease_waist?: number;
  ease_hip?: number;

  construction_notes?: string;
  visual_balance_notes?: string;
  known_fit_sensitivities: string[];

  image_urls: string[];
  pattern_piece_notes: string[];
}

/** Intended body base and ease assumptions for a pattern/block */
export interface PatternBlock {
  id: string;
  garment_example_id?: string;

  block_name: string;
  intended_body_base?: string;
  drafting_system?: string;
  size_system?: string;

  base_bust?: number;
  base_waist?: number;
  base_hip?: number;
  base_shoulder_width?: number;
  base_back_waist_length?: number;
  base_front_waist_length?: number;
  base_rise_front?: number;
  base_rise_back?: number;

  standard_ease_bust?: number;
  standard_ease_waist?: number;
  standard_ease_hip?: number;

  vertical_assumption?: string;
  shape_assumption?: string;
  notes?: string;
}

export type FitRiskLevel = "low" | "moderate" | "high" | "very_high";

export interface FitAssessment {
  id: string;
  measurement_profile_id: string;
  garment_example_id: string;
  pattern_block_id?: string;

  size_selected?: string;
  fit_risk_level: FitRiskLevel;

  bust_delta?: number;
  waist_delta?: number;
  hip_delta?: number;
  shoulder_delta?: number;
  front_length_delta?: number;
  back_length_delta?: number;

  ratio_flags: string[];
  balance_flags: string[];
  silhouette_flags: string[];

  summary?: string;
}

export type RecommendationType =
  | "pattern_adjustment"
  | "visual_balance"
  | "sizing_advice"
  | "construction_caution"
  | "styling_advice";

export type BodyRegion =
  | "bust"
  | "waist"
  | "hip"
  | "shoulder"
  | "torso"
  | "rise"
  | "seat"
  | "abdomen"
  | "thigh"
  | "overall";

export type RecommendationSeverity = "minor" | "moderate" | "major";

export interface AdjustmentRecommendation {
  id: string;
  fit_assessment_id: string;

  recommendation_type: RecommendationType;
  body_region: BodyRegion;

  title: string;
  rationale: string;
  recommendation_text: string;
  severity?: RecommendationSeverity;

  confidence_score?: number;
  requires_muslin: boolean;
  sort_order: number;
}

/** Rule engine: condition_json triggers output_json (recommendation template) */
export interface FitAssessmentRule {
  id: string;
  rule_code: string;
  applies_to_category?: GarmentCategory;
  applies_to_waistline?: WaistlineType;
  applies_to_fit_type?: FitType;

  condition_json: Record<string, unknown>;
  output_json: Record<string, unknown>;

  priority: number;
  is_active: boolean;
}

/** UI draft state for measurement entry wizard */
export type MeasurementEntryMode = "quick" | "full";

export type VerticalBalance = "short_waisted" | "long_waisted" | "balanced";

export interface MeasurementEntryDraft {
  mode: MeasurementEntryMode;
  units: MeasurementUnits;

  bust_full?: number;
  bust_high?: number;
  underbust?: number;
  waist?: number;
  high_hip?: number;
  full_hip?: number;
  abdomen?: number;

  neck?: number;
  bicep?: number;
  wrist?: number;
  thigh?: number;
  knee?: number;
  calf?: number;
  ankle?: number;

  height_total?: number;
  shoulder_to_floor?: number;
  nape_to_waist?: number;
  front_waist_length?: number;
  back_waist_length?: number;
  waist_to_hip?: number;
  waist_to_knee?: number;
  waist_to_floor?: number;
  crotch_depth?: number;
  inseam?: number;
  rise_front?: number;
  rise_back?: number;

  shoulder_width?: number;
  across_front?: number;
  across_back?: number;
  bust_span?: number;
  back_width?: number;

  posture?: Posture;
  shoulder_slope?: ShoulderSlope;
  shoulder_balance?: ShoulderBalance;
  bust_shape?: BustShape;
  seat_shape?: SeatShape;
  abdomen_shape?: AbdomenShape;
  leg_balance?: LegBalance;

  user_selected_shape?: string;
  profile_name?: string;
}
