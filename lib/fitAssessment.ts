/**
 * Fit assessment engine — compare user profile to garment/block assumptions,
 * produce fit assessment and adjustment recommendations.
 * Uses the interpretable rule library in fitAdjustmentRules.ts.
 */

import type {
  MeasurementProfile,
  MeasurementProfileDerived,
  GarmentExample,
  PatternBlock,
  FitAssessment,
  AdjustmentRecommendation,
} from "./fitTypes";
import {
  buildFitAssessmentContext,
  evaluateFitRules,
  computeFitRiskLevel,
  type MeasurementProfileInput,
  type PatternBlockInput,
  type AdjustmentRecommendation as RuleRecommendation,
} from "./fitAdjustmentRules";
import { getPatternBlockByGarmentId } from "@/data/patternBlocks";

/** Build measurement input for the rule engine from stored profile. */
function toMeasurementInput(profile: MeasurementProfile): MeasurementProfileInput {
  return {
    units: profile.units,
    bust_full: profile.bust_full,
    bust_high: profile.bust_high,
    underbust: profile.underbust,
    waist: profile.waist,
    high_hip: profile.high_hip,
    full_hip: profile.full_hip,
    abdomen: profile.abdomen,
    shoulder_width: profile.shoulder_width,
    across_front: profile.across_front,
    across_back: profile.across_back,
    back_width: profile.back_width,
    bust_span: profile.bust_span,
    front_waist_length: profile.front_waist_length,
    back_waist_length: profile.back_waist_length,
    waist_to_hip: profile.waist_to_hip,
    waist_to_floor: profile.waist_to_floor,
    waist_to_knee: profile.waist_to_knee,
    inseam: profile.inseam,
    crotch_depth: profile.crotch_depth,
    rise_front: profile.rise_front,
    rise_back: profile.rise_back,
    height_total: profile.height_total,
    posture: profile.posture,
    shoulder_slope: profile.shoulder_slope,
    shoulder_balance: profile.shoulder_balance,
    bust_shape: profile.bust_shape,
    seat_shape: profile.seat_shape,
    abdomen_shape: profile.abdomen_shape,
    leg_balance: profile.leg_balance,
  };
}

/** Build pattern block input for the rule engine from garment + block. */
function toPatternBlockInput(
  garment: GarmentExample,
  block: PatternBlock | null | undefined
): PatternBlockInput {
  return {
    id: block?.id,
    block_name: block?.block_name,
    category: garment.category,
    waistline_type: garment.waistline_type,
    fit_type: garment.fit_type,
    base_bust: block?.base_bust,
    base_waist: block?.base_waist,
    base_hip: block?.base_hip,
    base_shoulder_width: block?.base_shoulder_width,
    base_front_waist_length: block?.base_front_waist_length,
    base_back_waist_length: block?.base_back_waist_length,
    base_rise_front: block?.base_rise_front,
    base_rise_back: block?.base_rise_back,
    standard_ease_bust: block?.standard_ease_bust,
    standard_ease_waist: block?.standard_ease_waist,
    standard_ease_hip: block?.standard_ease_hip,
    intended_shape_assumption: block?.shape_assumption,
    intended_vertical_assumption: block?.vertical_assumption,
  };
}

/** Map rule engine recommendation to our API shape (with id and fit_assessment_id). */
function toAdjustmentRecommendation(
  rec: RuleRecommendation,
  assessmentId: string,
  index: number
): AdjustmentRecommendation {
  return {
    id: `adj-${assessmentId}-${rec.rule_code}-${index}`,
    fit_assessment_id: assessmentId,
    recommendation_type: rec.recommendation_type,
    body_region: rec.body_region,
    title: rec.title,
    rationale: rec.rationale,
    recommendation_text: rec.recommendation_text,
    severity: rec.severity,
    requires_muslin: rec.requires_muslin,
    sort_order: rec.sort_order,
  };
}

/** Generate a fit assessment and recommendations for a profile + garment using the rule library. */
export function assessGarmentFit(
  profileId: string,
  profile: MeasurementProfile,
  _derived: MeasurementProfileDerived,
  garment: GarmentExample,
  block?: PatternBlock | null
): { assessment: FitAssessment; recommendations: AdjustmentRecommendation[] } {
  const blockResolved = block ?? getPatternBlockByGarmentId(garment.id);
  const measurementInput = toMeasurementInput(profile);
  const patternInput = toPatternBlockInput(garment, blockResolved ?? undefined);

  const ctx = buildFitAssessmentContext(
    measurementInput,
    patternInput,
    garment.title,
    garment.source_name ?? garment.source_designer
  );

  const ruleRecommendations = evaluateFitRules(ctx);
  const fitRiskLevel = computeFitRiskLevel(ruleRecommendations);

  const assessmentId = `fit-${profileId}-${garment.id}`;
  const assessment: FitAssessment = {
    id: assessmentId,
    measurement_profile_id: profileId,
    garment_example_id: garment.id,
    pattern_block_id: blockResolved?.id,
    fit_risk_level: fitRiskLevel,
    ratio_flags: ctx.derived.fit_flags.filter((f) => f.startsWith("shape_") || f.includes("waist") || f.includes("hip")),
    balance_flags: ctx.derived.fit_flags.filter((f) => f.startsWith("vertical_") || f.includes("front_back")),
    silhouette_flags: ctx.derived.fit_flags.filter((f) => f.includes("shoulder") || f.includes("bust") || f.includes("seat") || f.includes("abdomen")),
    summary:
      ruleRecommendations.length > 0
        ? "This garment's intended proportions differ from your measurements in a few areas. The suggestions below can help you achieve the intended balance."
        : "Your measurements are close to this garment's assumptions. Minor adjustments may still improve fit.",
  };

  const recommendations: AdjustmentRecommendation[] = ruleRecommendations.map((rec, i) =>
    toAdjustmentRecommendation(rec, assessmentId, i)
  );

  return { assessment, recommendations };
}
