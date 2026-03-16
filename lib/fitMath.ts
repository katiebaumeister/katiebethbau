/**
 * Fit math — derive ratios and classify body shape from measurements.
 * Interpretable rules only; no ML. Used by fit assessment and adjustment engine.
 */

import type {
  MeasurementProfile,
  MeasurementProfileDerived,
  BodyShapeProfile,
  PrimaryShape,
  SecondaryShape,
  VerticalBalance,
  MeasurementEntryDraft,
} from "./fitTypes";

function n(value: number | undefined): number | undefined {
  if (value == null || Number.isNaN(value)) return undefined;
  return value;
}

/** Build MeasurementProfile from draft (e.g. wizard). */
export function draftToProfile(
  draft: MeasurementEntryDraft,
  id: string,
  profileName: string
): MeasurementProfile {
  return {
    id,
    profile_name: profileName || "Default Measurements",
    units: draft.units,
    bust_full: n(draft.bust_full),
    bust_high: n(draft.bust_high),
    underbust: n(draft.underbust),
    waist: n(draft.waist),
    high_hip: n(draft.high_hip),
    full_hip: n(draft.full_hip),
    abdomen: n(draft.abdomen),
    neck: n(draft.neck),
    bicep: n(draft.bicep),
    wrist: n(draft.wrist),
    thigh: n(draft.thigh),
    knee: n(draft.knee),
    calf: n(draft.calf),
    ankle: n(draft.ankle),
    height_total: n(draft.height_total),
    shoulder_to_floor: n(draft.shoulder_to_floor),
    nape_to_waist: n(draft.nape_to_waist),
    front_waist_length: n(draft.front_waist_length),
    back_waist_length: n(draft.back_waist_length),
    waist_to_hip: n(draft.waist_to_hip),
    waist_to_knee: n(draft.waist_to_knee),
    waist_to_floor: n(draft.waist_to_floor),
    crotch_depth: n(draft.crotch_depth),
    inseam: n(draft.inseam),
    rise_front: n(draft.rise_front),
    rise_back: n(draft.rise_back),
    shoulder_width: n(draft.shoulder_width),
    across_front: n(draft.across_front),
    across_back: n(draft.across_back),
    bust_span: n(draft.bust_span),
    back_width: n(draft.back_width),
    posture: draft.posture,
    shoulder_slope: draft.shoulder_slope,
    shoulder_balance: draft.shoulder_balance,
    bust_shape: draft.bust_shape,
    seat_shape: draft.seat_shape,
    abdomen_shape: draft.abdomen_shape,
    leg_balance: draft.leg_balance,
  };
}

/**
 * Derive ratios and numeric flags from a measurement profile.
 * Formulas are interpretable and documented.
 */
export function deriveMeasurementProfile(
  profile: MeasurementProfile
): MeasurementProfileDerived {
  const waist = profile.waist ?? 0;
  const fullHip = profile.full_hip ?? 0;
  const bustFull = profile.bust_full ?? 0;
  const shoulderWidth = profile.shoulder_width ?? 0;
  const highHip = profile.high_hip ?? 0;
  const frontWaistLength = profile.front_waist_length;
  const backWaistLength = profile.back_waist_length;
  const inseam = profile.inseam ?? 0;
  const riseFront = profile.rise_front;
  const riseBack = profile.rise_back;

  const waistToHipRatio =
    fullHip > 0 ? Math.round((waist / fullHip) * 10000) / 10000 : undefined;
  const bustToWaistRatio =
    waist > 0 ? Math.round((bustFull / waist) * 10000) / 10000 : undefined;
  const shoulderToHipRatio =
    fullHip > 0 ? Math.round((shoulderWidth / fullHip) * 10000) / 10000 : undefined;
  const highHipToFullHipRatio =
    fullHip > 0 && highHip > 0
      ? Math.round((highHip / fullHip) * 10000) / 10000
      : undefined;

  const frontToBackWaistDelta =
    frontWaistLength != null && backWaistLength != null
      ? Math.round((frontWaistLength - backWaistLength) * 100) / 100
      : undefined;

  const riseBalanceDelta =
    riseBack != null && riseFront != null
      ? Math.round((riseBack - riseFront) * 100) / 100
      : undefined;

  const torsoLegRatio =
    frontWaistLength != null && inseam > 0
      ? Math.round((frontWaistLength / inseam) * 10000) / 10000
      : undefined;

  const bustWaistDrop = waist > 0 ? Math.round((bustFull - waist) * 100) / 100 : undefined;
  const hipWaistDrop = fullHip > 0 ? Math.round((fullHip - waist) * 100) / 100 : undefined;
  const shoulderHipDelta =
    fullHip > 0 ? Math.round((shoulderWidth - fullHip) * 100) / 100 : undefined;

  const derived = classifyBodyShapeFromDerived({
    waistToHipRatio,
    bustToWaistRatio,
    shoulderToHipRatio,
    bustWaistDrop,
    hipWaistDrop,
    torsoLegRatio,
    abdomenShape: profile.abdomen_shape,
  });

  const verticalBalance = classifyVerticalBalance(torsoLegRatio);

  const fitFlags: string[] = [];
  if (waistToHipRatio != null && waistToHipRatio > 0.88) fitFlags.push("high_waist_hip_ratio");
  if (hipWaistDrop != null && hipWaistDrop >= 12) fitFlags.push("pronounced_hip_waist_drop");
  if (bustWaistDrop != null && bustWaistDrop >= 10) fitFlags.push("pronounced_bust_waist_drop");
  if (frontToBackWaistDelta != null && Math.abs(frontToBackWaistDelta) > 1.5)
    fitFlags.push("front_back_waist_imbalance");
  if (riseBalanceDelta != null && Math.abs(riseBalanceDelta) > 0.75)
    fitFlags.push("rise_balance_delta");

  return {
    measurement_profile_id: profile.id,
    waist_to_hip_ratio: waistToHipRatio,
    bust_to_waist_ratio: bustToWaistRatio,
    shoulder_to_hip_ratio: shoulderToHipRatio,
    high_hip_to_full_hip_ratio: highHipToFullHipRatio,
    front_to_back_waist_delta: frontToBackWaistDelta,
    rise_balance_delta: riseBalanceDelta,
    torso_leg_ratio: torsoLegRatio,
    bust_waist_drop: bustWaistDrop,
    hip_waist_drop: hipWaistDrop,
    shoulder_hip_delta: shoulderHipDelta,
    derived_body_shape: derived.primary,
    derived_vertical_balance: verticalBalance,
    derived_fit_flags: fitFlags,
  };
}

interface DerivedInput {
  waistToHipRatio?: number;
  bustToWaistRatio?: number;
  shoulderToHipRatio?: number;
  bustWaistDrop?: number;
  hipWaistDrop?: number;
  torsoLegRatio?: number;
  abdomenShape?: string;
}

function classifyBodyShapeFromDerived(d: DerivedInput): {
  primary: PrimaryShape | undefined;
  secondary: SecondaryShape | undefined;
  confidence: number;
  explanation: string[];
} {
  const explanation: string[] = [];
  let primary: PrimaryShape | undefined;
  let confidence = 0;

  const { hipWaistDrop, bustWaistDrop, shoulderToHipRatio, waistToHipRatio, abdomenShape } = d;

  if (
    hipWaistDrop != null &&
    hipWaistDrop >= 10 &&
    shoulderToHipRatio != null &&
    shoulderToHipRatio < 0.95
  ) {
    primary = "pear";
    confidence = 0.75;
    explanation.push("Hip-to-waist difference is pronounced relative to shoulder width.");
  }

  if (
    bustWaistDrop != null &&
    hipWaistDrop != null &&
    Math.abs(bustWaistDrop - hipWaistDrop) <= 2 &&
    bustWaistDrop >= 8
  ) {
    primary = "hourglass";
    confidence = Math.max(confidence, 0.8);
    explanation.push("Bust and hip drops are similar with defined waist.");
  }

  if (
    bustWaistDrop != null &&
    bustWaistDrop < 7 &&
    hipWaistDrop != null &&
    hipWaistDrop < 8
  ) {
    primary = "rectangle";
    confidence = Math.max(confidence, 0.7);
    explanation.push("Modest bust and hip-to-waist differences suggest rectangular silhouette.");
  }

  if (
    bustWaistDrop != null &&
    bustWaistDrop >= 8 &&
    shoulderToHipRatio != null &&
    shoulderToHipRatio > 1.03
  ) {
    primary = "inverted_triangle";
    confidence = Math.max(confidence, 0.75);
    explanation.push("Shoulders are wider than hip proportion; bust drop is defined.");
  }

  if (
    abdomenShape === "full_high" ||
    (waistToHipRatio != null && waistToHipRatio > 0.88)
  ) {
    primary = "apple";
    confidence = Math.max(confidence, 0.7);
    explanation.push("Waist-to-hip ratio or abdomen shape suggests apple silhouette.");
  }

  if (!primary) {
    primary = "rectangle";
    confidence = 0.5;
    explanation.push("Insufficient data for a more specific shape; defaulting to rectangle.");
  }

  return { primary, secondary: undefined, confidence, explanation };
}

function classifyVerticalBalance(
  torsoLegRatio: number | undefined
): VerticalBalance | undefined {
  if (torsoLegRatio == null) return undefined;
  if (torsoLegRatio < 0.72) return "short_waisted";
  if (torsoLegRatio > 0.84) return "long_waisted";
  return "balanced";
}

/**
 * Classify body shape from a measurement profile (derives first, then classifies).
 */
export function classifyBodyShape(
  profile: MeasurementProfile,
  derived: MeasurementProfileDerived
): BodyShapeProfile {
  const d = {
    waistToHipRatio: derived.waist_to_hip_ratio,
    bustToWaistRatio: derived.bust_to_waist_ratio,
    shoulderToHipRatio: derived.shoulder_to_hip_ratio,
    bustWaistDrop: derived.bust_waist_drop,
    hipWaistDrop: derived.hip_waist_drop,
    torsoLegRatio: derived.torso_leg_ratio,
    abdomenShape: profile.abdomen_shape,
  };

  const result = classifyBodyShapeFromDerived(d);
  const verticalBalance = classifyVerticalBalance(derived.torso_leg_ratio);

  const explanation = [...result.explanation];
  if (verticalBalance === "short_waisted") {
    explanation.push("Torso-to-leg ratio suggests short-waisted balance.");
  } else if (verticalBalance === "long_waisted") {
    explanation.push("Torso-to-leg ratio suggests long-waisted balance.");
  }

  return {
    id: `body-${profile.id}`,
    measurement_profile_id: profile.id,
    primary_shape: result.primary,
    secondary_shape: verticalBalance === "short_waisted" ? "short_waisted" : verticalBalance === "long_waisted" ? "long_waisted" : "balanced",
    user_selected_shape: undefined,
    confidence_score: result.confidence,
    explanation,
  };
}
