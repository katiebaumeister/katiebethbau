// fitAdjustmentRules.ts
// Phase 1 rule library for body measurement → fit interpretation → adjustment guidance
// Designed for archival looks, pattern examples, and garment references.
// Interpretable rules only. No ML required.

export type MeasurementUnits = "in" | "cm";

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

export type PostureType =
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
export type VerticalBalance = "short_waisted" | "balanced" | "long_waisted";
export type LegBalance = "short_torso_long_leg" | "balanced" | "long_torso_short_leg";

export type PrimaryBodyShape =
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

export type FitRiskLevel = "low" | "moderate" | "high" | "very_high";

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

export type Severity = "minor" | "moderate" | "major";

export interface MeasurementProfileInput {
  units: MeasurementUnits;

  bust_full?: number;
  bust_high?: number;
  underbust?: number;
  waist?: number;
  high_hip?: number;
  full_hip?: number;
  abdomen?: number;

  shoulder_width?: number;
  across_front?: number;
  across_back?: number;
  back_width?: number;
  bust_span?: number;

  front_waist_length?: number;
  back_waist_length?: number;
  waist_to_hip?: number;
  waist_to_floor?: number;
  waist_to_knee?: number;
  inseam?: number;
  crotch_depth?: number;
  rise_front?: number;
  rise_back?: number;
  height_total?: number;

  posture?: PostureType;
  shoulder_slope?: ShoulderSlope;
  shoulder_balance?: ShoulderBalance;
  bust_shape?: BustShape;
  seat_shape?: SeatShape;
  abdomen_shape?: AbdomenShape;
  leg_balance?: LegBalance;
  user_selected_shape?: PrimaryBodyShape | string;
}

export interface DerivedMeasurementProfile {
  waist_to_hip_ratio?: number;
  bust_to_waist_ratio?: number;
  shoulder_to_hip_ratio?: number;
  high_hip_to_full_hip_ratio?: number;
  bust_waist_drop?: number;
  hip_waist_drop?: number;
  shoulder_hip_delta?: number;
  front_to_back_waist_delta?: number;
  rise_balance_delta?: number;
  torso_leg_ratio?: number;
  vertical_balance?: VerticalBalance;
  primary_shape?: PrimaryBodyShape;
  fit_flags: string[];
}

export interface PatternBlockInput {
  id?: string;
  block_name?: string;
  category: GarmentCategory;
  waistline_type?: WaistlineType;
  fit_type?: FitType;

  base_bust?: number;
  base_waist?: number;
  base_hip?: number;
  base_shoulder_width?: number;
  base_front_waist_length?: number;
  base_back_waist_length?: number;
  base_rise_front?: number;
  base_rise_back?: number;

  standard_ease_bust?: number;
  standard_ease_waist?: number;
  standard_ease_hip?: number;

  intended_shape_assumption?: string;
  intended_vertical_assumption?: string;
}

export interface FitAssessmentContext {
  measurement: MeasurementProfileInput;
  derived: DerivedMeasurementProfile;
  pattern: PatternBlockInput;
  garmentTitle?: string;
  sourceName?: string;
}

export interface AdjustmentRecommendation {
  rule_code: string;
  recommendation_type: RecommendationType;
  body_region: BodyRegion;
  title: string;
  rationale: string;
  recommendation_text: string;
  severity: Severity;
  fit_risk: FitRiskLevel;
  requires_muslin: boolean;
  score: number;
  sort_order: number;
}

export interface FitRule {
  rule_code: string;
  title: string;
  applies_to_categories?: GarmentCategory[];
  applies_to_waistlines?: WaistlineType[];
  applies_to_fit_types?: FitType[];
  priority: number;
  evaluate: (ctx: FitAssessmentContext) => AdjustmentRecommendation | null;
}

// ---------- helpers ----------

const hasNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

const safeDelta = (user?: number, pattern?: number, ease?: number): number | undefined => {
  if (!hasNum(user) || !hasNum(pattern)) return undefined;
  return user - (pattern + (ease ?? 0));
};

const includesIfPresent = <T>(list: T[] | undefined, value: T | undefined): boolean => {
  if (!list || list.length === 0) return true;
  if (value === undefined) return false;
  return list.includes(value);
};

const appliesToRule = (rule: FitRule, ctx: FitAssessmentContext): boolean => {
  return (
    includesIfPresent(rule.applies_to_categories, ctx.pattern.category) &&
    includesIfPresent(rule.applies_to_waistlines, ctx.pattern.waistline_type) &&
    includesIfPresent(rule.applies_to_fit_types, ctx.pattern.fit_type)
  );
};

export function deriveMeasurementProfile(
  m: MeasurementProfileInput,
): DerivedMeasurementProfile {
  const waist_to_hip_ratio =
    hasNum(m.waist) && hasNum(m.full_hip) && m.full_hip !== 0 ? m.waist / m.full_hip : undefined;

  const bust_to_waist_ratio =
    hasNum(m.bust_full) && hasNum(m.waist) && m.waist !== 0 ? m.bust_full / m.waist : undefined;

  const shoulder_to_hip_ratio =
    hasNum(m.shoulder_width) && hasNum(m.full_hip) && m.full_hip !== 0
      ? m.shoulder_width / m.full_hip
      : undefined;

  const high_hip_to_full_hip_ratio =
    hasNum(m.high_hip) && hasNum(m.full_hip) && m.full_hip !== 0 ? m.high_hip / m.full_hip : undefined;

  const bust_waist_drop =
    hasNum(m.bust_full) && hasNum(m.waist) ? m.bust_full - m.waist : undefined;

  const hip_waist_drop =
    hasNum(m.full_hip) && hasNum(m.waist) ? m.full_hip - m.waist : undefined;

  const shoulder_hip_delta =
    hasNum(m.shoulder_width) && hasNum(m.full_hip) ? m.shoulder_width - m.full_hip : undefined;

  const front_to_back_waist_delta =
    hasNum(m.front_waist_length) && hasNum(m.back_waist_length)
      ? m.front_waist_length - m.back_waist_length
      : undefined;

  const rise_balance_delta =
    hasNum(m.rise_back) && hasNum(m.rise_front) ? m.rise_back - m.rise_front : undefined;

  const torso_leg_ratio =
    hasNum(m.front_waist_length) && hasNum(m.inseam) && m.inseam !== 0
      ? m.front_waist_length / m.inseam
      : undefined;

  let vertical_balance: VerticalBalance | undefined = undefined;
  if (hasNum(torso_leg_ratio)) {
    if (torso_leg_ratio < 0.72) vertical_balance = "short_waisted";
    else if (torso_leg_ratio > 0.84) vertical_balance = "long_waisted";
    else vertical_balance = "balanced";
  }

  let primary_shape: PrimaryBodyShape | undefined = undefined;
  if (hasNum(bust_waist_drop) && hasNum(hip_waist_drop) && hasNum(shoulder_to_hip_ratio)) {
    if (hip_waist_drop >= 10 && shoulder_to_hip_ratio < 0.95) {
      primary_shape = "pear";
    } else if (Math.abs(bust_waist_drop - hip_waist_drop) <= 2 && bust_waist_drop >= 8) {
      primary_shape = "hourglass";
    } else if (bust_waist_drop < 7 && hip_waist_drop < 8) {
      primary_shape = "rectangle";
    } else if (bust_waist_drop >= 8 && shoulder_to_hip_ratio > 1.03) {
      primary_shape = "inverted_triangle";
    } else if ((hasNum(waist_to_hip_ratio) && waist_to_hip_ratio > 0.88) || m.abdomen_shape === "full_high") {
      primary_shape = "apple";
    }
  }

  const fit_flags: string[] = [];
  if (m.posture === "swayback") fit_flags.push("swayback");
  if (m.seat_shape === "prominent") fit_flags.push("prominent_seat");
  if (m.abdomen_shape === "full_high" || m.abdomen_shape === "full_low") fit_flags.push("prominent_abdomen");
  if (m.shoulder_balance === "broad") fit_flags.push("broad_shoulder");
  if (m.shoulder_balance === "narrow") fit_flags.push("narrow_shoulder");
  if (m.bust_shape === "projected" || m.bust_shape === "full" || m.bust_shape === "full_upper" || m.bust_shape === "full_lower") {
    fit_flags.push("full_or_projected_bust");
  }
  if (vertical_balance) fit_flags.push(`vertical_${vertical_balance}`);
  if (primary_shape) fit_flags.push(`shape_${primary_shape}`);

  return {
    waist_to_hip_ratio,
    bust_to_waist_ratio,
    shoulder_to_hip_ratio,
    high_hip_to_full_hip_ratio,
    bust_waist_drop,
    hip_waist_drop,
    shoulder_hip_delta,
    front_to_back_waist_delta,
    rise_balance_delta,
    torso_leg_ratio,
    vertical_balance,
    primary_shape,
    fit_flags,
  };
}

// ---------- rule library ----------

const rules: FitRule[] = [
  {
    rule_code: "WAIST_HIP_PRONOUNCED_VS_STRAIGHT_BLOCK",
    title: "Pronounced waist-to-hip shape against a straighter block",
    applies_to_categories: ["dress", "skirt", "pant", "short", "gown"],
    priority: 10,
    evaluate: (ctx) => {
      const d = ctx.derived;
      const p = ctx.pattern;
      const userDrop = d.hip_waist_drop;
      const blockDrop =
        hasNum(p.base_hip) && hasNum(p.base_waist) ? p.base_hip - p.base_waist : undefined;
      if (!hasNum(userDrop) || !hasNum(blockDrop)) return null;
      if (userDrop - blockDrop < 3) return null;
      return {
        rule_code: "WAIST_HIP_PRONOUNCED_VS_STRAIGHT_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "waist",
        title: "Increase shaping without forcing the waist seam downward",
        rationale:
          "Your hip-to-waist difference is more pronounced than the pattern block assumes. A straighter ready-to-wear block can distort balance if width is removed only at the waist seam.",
        recommendation_text:
          "Preserve the intended silhouette by redistributing shaping through darts, princess seams, or side-seam contouring, and allow the garment to release more cleanly over the upper hip. In waist-seamed garments, consider slightly raising the apparent waist placement or refining seam geometry rather than simply over-suppressing the waist.",
        severity: "moderate",
        fit_risk: "high",
        requires_muslin: true,
        score: 92,
        sort_order: 10,
      };
    },
  },
  {
    rule_code: "FULL_BUST_VS_BASE_BUST",
    title: "Full or projected bust against base bust assumption",
    applies_to_categories: ["dress", "gown", "blouse", "shirt", "jacket", "coat", "corset", "bodysuit"],
    priority: 20,
    evaluate: (ctx) => {
      const delta = safeDelta(
        ctx.measurement.bust_full,
        ctx.pattern.base_bust,
        ctx.pattern.standard_ease_bust,
      );
      if (!hasNum(delta) || delta < 1.5) return null;
      return {
        rule_code: "FULL_BUST_VS_BASE_BUST",
        recommendation_type: "pattern_adjustment",
        body_region: "bust",
        title: "Add bust room before widening the whole torso",
        rationale:
          "Your full bust measurement exceeds the block's bust assumption after ease is considered. Enlarging the entire side seam often throws off shoulder, neckline, and armhole balance.",
        recommendation_text:
          "Use a full-bust style adjustment, added projection, or controlled front-panel expansion before globally increasing the torso. Check apex placement, front length, dart intake, and side-seam balance. For historical or close-fit garments, preserve neckline and shoulder geometry as much as possible while introducing bust volume locally.",
        severity: "major",
        fit_risk: "high",
        requires_muslin: true,
        score: 95,
        sort_order: 20,
      };
    },
  },
  {
    rule_code: "SMALLER_BUST_THAN_BLOCK",
    title: "Smaller bust than block assumption",
    applies_to_categories: ["dress", "gown", "blouse", "shirt", "jacket", "corset", "bodysuit"],
    priority: 25,
    evaluate: (ctx) => {
      const delta = safeDelta(
        ctx.measurement.bust_full,
        ctx.pattern.base_bust,
        ctx.pattern.standard_ease_bust,
      );
      if (!hasNum(delta) || delta > -1.25) return null;
      return {
        rule_code: "SMALLER_BUST_THAN_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "bust",
        title: "Reduce excess front volume without collapsing balance",
        rationale:
          "The block appears to assume more bust volume than your measurements indicate. Excess fabric can pool at the upper chest, side front, or armscye if removed indiscriminately.",
        recommendation_text:
          "Reduce front fullness through dart reduction, princess seam refinement, cup-area flattening, or upper-front reshaping rather than simply narrowing the entire bodice. Recheck strap length, armhole height, and front waist length once bust volume is reduced.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 80,
        sort_order: 25,
      };
    },
  },
  {
    rule_code: "SHORT_WAISTED_VS_NATURAL_WAIST_SEAM",
    title: "Short-waisted profile against natural waist seam placement",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "bodysuit", "corset"],
    applies_to_waistlines: ["natural", "basque"],
    priority: 30,
    evaluate: (ctx) => {
      if (ctx.derived.vertical_balance !== "short_waisted") return null;
      return {
        rule_code: "SHORT_WAISTED_VS_NATURAL_WAIST_SEAM",
        recommendation_type: "visual_balance",
        body_region: "torso",
        title: "Use seam placement to restore vertical balance",
        rationale:
          "A natural-waist seam drafted for a longer torso can crowd the ribcage or appear visually compressed on a shorter-waisted body.",
        recommendation_text:
          "Check front and side waist placement carefully. A slightly raised visual waist, cleaner uninterrupted torso panel, or redistributed shaping above the waist can often reproduce the intended balance better than rigidly preserving the original seam level.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 84,
        sort_order: 30,
      };
    },
  },
  {
    rule_code: "LONG_WAISTED_VS_RAISED_WAISTLINE",
    title: "Long-waisted profile against a raised waistline",
    applies_to_categories: ["dress", "gown", "bodysuit"],
    applies_to_waistlines: ["raised", "empire"],
    priority: 35,
    evaluate: (ctx) => {
      if (ctx.derived.vertical_balance !== "long_waisted") return null;
      return {
        rule_code: "LONG_WAISTED_VS_RAISED_WAISTLINE",
        recommendation_type: "visual_balance",
        body_region: "torso",
        title: "Refine raised-waist placement to avoid bust compression",
        rationale:
          "Raised waistlines can visually help a long torso, but the original seam placement may sit too high relative to bust apex and front length.",
        recommendation_text:
          "Test the raised seam position against your actual front length and apex level. Often the best result is a controlled lowering of the seam or a reshaped underbust line that keeps the vertical effect without creating drag, flattening, or a crowded upper torso.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 82,
        sort_order: 35,
      };
    },
  },
  {
    rule_code: "FRONT_LENGTH_LONGER_THAN_BACK",
    title: "Front waist length exceeds back waist length",
    applies_to_categories: ["dress", "gown", "blouse", "shirt", "jacket", "coat", "corset", "bodysuit"],
    priority: 40,
    evaluate: (ctx) => {
      const delta = ctx.derived.front_to_back_waist_delta;
      if (!hasNum(delta) || delta < 1) return null;
      return {
        rule_code: "FRONT_LENGTH_LONGER_THAN_BACK",
        recommendation_type: "pattern_adjustment",
        body_region: "torso",
        title: "Add front length where the body actually needs it",
        rationale:
          "Your front waist length is meaningfully longer than your back waist length. Front drag can occur if torso length is added globally instead of selectively.",
        recommendation_text:
          "Add length through the front body only where needed: over bust projection, upper abdomen, or center front contour. Avoid simply lengthening the entire bodice uniformly unless the whole torso is proportionally long.",
        severity: "moderate",
        fit_risk: "high",
        requires_muslin: true,
        score: 88,
        sort_order: 40,
      };
    },
  },
  {
    rule_code: "SWAYBACK_ADJUSTMENT",
    title: "Swayback length pooling at center back waist",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "shirt", "blouse", "skirt", "pant"],
    priority: 50,
    evaluate: (ctx) => {
      if (ctx.measurement.posture !== "swayback") return null;
      return {
        rule_code: "SWAYBACK_ADJUSTMENT",
        recommendation_type: "pattern_adjustment",
        body_region: "torso",
        title: "Remove excess length at center back rather than tightening everywhere",
        rationale:
          "Swayback posture often creates pooling above the seat or at the small of the back even when side seams appear close to correct.",
        recommendation_text:
          "Pin out excess length horizontally or in a curved wedge across the back waist area, then true the side seams and hem. Avoid solving swayback drag by over-tightening the entire garment at the waist or hip.",
        severity: "moderate",
        fit_risk: "high",
        requires_muslin: true,
        score: 90,
        sort_order: 50,
      };
    },
  },
  {
    rule_code: "PROMINENT_SEAT_VS_STRAIGHT_SKIRT_OR_PANT",
    title: "Prominent seat against a straighter back block",
    applies_to_categories: ["skirt", "pant", "short", "dress", "gown"],
    priority: 60,
    evaluate: (ctx) => {
      if (ctx.measurement.seat_shape !== "prominent") return null;
      return {
        rule_code: "PROMINENT_SEAT_VS_STRAIGHT_SKIRT_OR_PANT",
        recommendation_type: "pattern_adjustment",
        body_region: "seat",
        title: "Add back length and projection before adding width everywhere",
        rationale:
          "A prominent seat usually needs additional back shape and length, not just more side-seam circumference. Without projection, hems kick back and side seams can swing.",
        recommendation_text:
          "Add back-seat projection and back length first, then reassess width. In skirts and dresses, recheck hem level and back dart shaping. In pants or shorts, review back rise shape and crotch extension before increasing side seam width.",
        severity: "major",
        fit_risk: "high",
        requires_muslin: true,
        score: 94,
        sort_order: 60,
      };
    },
  },
  {
    rule_code: "FLAT_SEAT_VS_FULLER_BACK_BLOCK",
    title: "Flat seat against fuller back-seat assumptions",
    applies_to_categories: ["skirt", "pant", "short", "dress", "gown"],
    priority: 65,
    evaluate: (ctx) => {
      if (ctx.measurement.seat_shape !== "flat") return null;
      return {
        rule_code: "FLAT_SEAT_VS_FULLER_BACK_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "seat",
        title: "Reduce back projection and re-level the hem",
        rationale:
          "If the block assumes more back-seat projection than your body provides, excess fabric can pool under the seat or through the back thigh.",
        recommendation_text:
          "Reduce unnecessary back-seat extension, shorten or flatten the back curve where appropriate, and recheck dart intake. In pants, verify the back crotch shape and leg hang after reducing projection.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 78,
        sort_order: 65,
      };
    },
  },
  {
    rule_code: "FULL_ABDOMEN_VS_FLAT_FRONT_BLOCK",
    title: "Fuller abdomen against a flatter front assumption",
    applies_to_categories: ["dress", "gown", "shirt", "blouse", "jacket", "coat", "pant", "short", "skirt", "bodysuit"],
    priority: 70,
    evaluate: (ctx) => {
      const abdomenFlag =
        ctx.measurement.abdomen_shape === "full_high" || ctx.measurement.abdomen_shape === "full_low";
      if (!abdomenFlag) return null;
      return {
        rule_code: "FULL_ABDOMEN_VS_FLAT_FRONT_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "abdomen",
        title: "Introduce front room without losing side-seam balance",
        rationale:
          "A flatter block can strain or ride up across the front abdomen when the body carries more volume in that area.",
        recommendation_text:
          "Add front length and controlled front width where needed, then re-walk side seams and hem balance. For skirts and pants, check whether the issue is primarily front rise length, front abdomen shape, or both. Avoid compensating only by dropping the garment lower on the body.",
        severity: "major",
        fit_risk: "high",
        requires_muslin: true,
        score: 93,
        sort_order: 70,
      };
    },
  },
  {
    rule_code: "BROAD_SHOULDER_VS_NARROW_BLOCK",
    title: "Broad shoulders against a narrower shoulder block",
    applies_to_categories: ["dress", "gown", "shirt", "blouse", "jacket", "coat", "bodysuit"],
    priority: 80,
    evaluate: (ctx) => {
      const delta = safeDelta(ctx.measurement.shoulder_width, ctx.pattern.base_shoulder_width, 0);
      if (!hasNum(delta) || delta < 0.5) {
        if (ctx.measurement.shoulder_balance !== "broad") return null;
      }
      return {
        rule_code: "BROAD_SHOULDER_VS_NARROW_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "shoulder",
        title: "Correct shoulder width before enlarging the torso",
        rationale:
          "A narrow shoulder block can pull at the upper bodice, distort necklines, and throw off sleeve hang even when the torso is otherwise close.",
        recommendation_text:
          "Adjust shoulder width, shoulder point position, and possibly armscye shape before widening the whole garment. Reassess sleeve pitch, cap distribution, and neckline once shoulder geometry is corrected.",
        severity: "moderate",
        fit_risk: "high",
        requires_muslin: true,
        score: 89,
        sort_order: 80,
      };
    },
  },
  {
    rule_code: "NARROW_SHOULDER_VS_BROAD_BLOCK",
    title: "Narrow shoulders against a broader shoulder block",
    applies_to_categories: ["dress", "gown", "shirt", "blouse", "jacket", "coat", "bodysuit"],
    priority: 85,
    evaluate: (ctx) => {
      const delta = safeDelta(ctx.measurement.shoulder_width, ctx.pattern.base_shoulder_width, 0);
      if (!hasNum(delta) || delta > -0.5) {
        if (ctx.measurement.shoulder_balance !== "narrow") return null;
      }
      return {
        rule_code: "NARROW_SHOULDER_VS_BROAD_BLOCK",
        recommendation_type: "pattern_adjustment",
        body_region: "shoulder",
        title: "Reduce shoulder span before tightening through the chest",
        rationale:
          "When the block's shoulder span exceeds the body's, fabric often collapses near the armhole or neckline. Tightening the side seam alone will not restore the intended upper-body balance.",
        recommendation_text:
          "Move the shoulder point inward as needed, refine the neckline-to-shoulder transition, and reassess sleeve or strap attachment after correcting the shoulder line. Then evaluate chest width separately.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 77,
        sort_order: 85,
      };
    },
  },
  {
    rule_code: "SLOPED_SHOULDER_CONSIDERATION",
    title: "Sloped shoulders affect neckline and armhole behavior",
    applies_to_categories: ["dress", "gown", "shirt", "blouse", "jacket", "coat", "bodysuit", "bra_top"],
    priority: 90,
    evaluate: (ctx) => {
      if (ctx.measurement.shoulder_slope !== "sloped") return null;
      return {
        rule_code: "SLOPED_SHOULDER_CONSIDERATION",
        recommendation_type: "construction_caution",
        body_region: "shoulder",
        title: "Check drag from neckline to armscye before blaming the bust or torso",
        rationale:
          "A sloped shoulder can cause diagonal drag, neckline collapse, strap slippage, or excess fabric at the upper chest if the shoulder angle is drafted too square.",
        recommendation_text:
          "Refine shoulder slope and strap angle first. After that, reassess any apparent chest excess or armhole distortion. In tailored garments, also check pad assumptions and sleeve-head support.",
        severity: "minor",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 71,
        sort_order: 90,
      };
    },
  },
  {
    rule_code: "SQUARE_SHOULDER_CONSIDERATION",
    title: "Square shoulders can create upper-armhole strain",
    applies_to_categories: ["dress", "gown", "shirt", "blouse", "jacket", "coat", "bodysuit"],
    priority: 95,
    evaluate: (ctx) => {
      if (ctx.measurement.shoulder_slope !== "square") return null;
      return {
        rule_code: "SQUARE_SHOULDER_CONSIDERATION",
        recommendation_type: "construction_caution",
        body_region: "shoulder",
        title: "Check shoulder angle before lowering the armhole",
        rationale:
          "Square shoulders can create upper-bodice pull lines that are sometimes mistaken for insufficient width or a too-high armhole.",
        recommendation_text:
          "Test shoulder angle correction before enlarging the chest or dropping the armscye. Once the shoulder line reflects the body correctly, upper-bodice drag often resolves more cleanly.",
        severity: "minor",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 70,
        sort_order: 95,
      };
    },
  },
  {
    rule_code: "FRONT_RISE_SHORT_FOR_ABDOMEN_OR_TORSO",
    title: "Front rise likely short for body volume or front length",
    applies_to_categories: ["pant", "short"],
    priority: 100,
    evaluate: (ctx) => {
      const riseDelta =
        hasNum(ctx.measurement.rise_front) && hasNum(ctx.pattern.base_rise_front)
          ? ctx.measurement.rise_front - ctx.pattern.base_rise_front
          : undefined;
      const abdomenFlag =
        ctx.measurement.abdomen_shape === "full_high" || ctx.measurement.abdomen_shape === "full_low";
      if ((!hasNum(riseDelta) || riseDelta < 0.75) && !abdomenFlag) return null;
      return {
        rule_code: "FRONT_RISE_SHORT_FOR_ABDOMEN_OR_TORSO",
        recommendation_type: "pattern_adjustment",
        body_region: "rise",
        title: "Add front rise where the body actually needs length",
        rationale:
          "A short front rise can cause cutting-in, front pull lines, or the garment dropping below the intended waist position, especially when the front abdomen needs additional shape.",
        recommendation_text:
          "Lengthen and reshape the front rise before adding general waist width. Re-evaluate front crotch curve, waistband position, and front thigh hang after the rise is corrected.",
        severity: "major",
        fit_risk: "high",
        requires_muslin: true,
        score: 91,
        sort_order: 100,
      };
    },
  },
  {
    rule_code: "BACK_RISE_SHORT_FOR_PROMINENT_SEAT",
    title: "Back rise likely short for seat projection",
    applies_to_categories: ["pant", "short"],
    priority: 105,
    evaluate: (ctx) => {
      const riseDelta =
        hasNum(ctx.measurement.rise_back) && hasNum(ctx.pattern.base_rise_back)
          ? ctx.measurement.rise_back - ctx.pattern.base_rise_back
          : undefined;
      if ((!hasNum(riseDelta) || riseDelta < 0.75) && ctx.measurement.seat_shape !== "prominent") return null;
      return {
        rule_code: "BACK_RISE_SHORT_FOR_PROMINENT_SEAT",
        recommendation_type: "pattern_adjustment",
        body_region: "rise",
        title: "Add back rise and seat extension before widening the hip",
        rationale:
          "A prominent seat often requires more back rise length and shaping. If those are missing, the garment may drag backward, cut into the back waist, or distort the leg line.",
        recommendation_text:
          "Increase back rise length and adjust seat extension first, then reassess hip circumference. After correcting rise shape, recheck dart intake, yoke angle, and back-thigh hang if applicable.",
        severity: "major",
        fit_risk: "high",
        requires_muslin: true,
        score: 94,
        sort_order: 105,
      };
    },
  },
  {
    rule_code: "HIGH_HIP_FULLNESS",
    title: "High-hip fullness may need earlier release than the block provides",
    applies_to_categories: ["dress", "gown", "skirt", "pant", "short", "coat", "jacket"],
    priority: 110,
    evaluate: (ctx) => {
      const ratio = ctx.derived.high_hip_to_full_hip_ratio;
      if (!hasNum(ratio) || ratio < 0.93) return null;
      return {
        rule_code: "HIGH_HIP_FULLNESS",
        recommendation_type: "pattern_adjustment",
        body_region: "hip",
        title: "Let the garment release earlier over the upper hip",
        rationale:
          "A fuller high hip can cause drag, side-seam swing, or waistband displacement if the block assumes most width enters lower at the full hip.",
        recommendation_text:
          "Release shaping earlier between waist and full hip. Revisit dart length, side-seam curve, and any pocket or seam placements that cross the upper hip. In close silhouettes, muslin the upper-hip transition rather than guessing from circumference alone.",
        severity: "moderate",
        fit_risk: "high",
        requires_muslin: true,
        score: 87,
        sort_order: 110,
      };
    },
  },
  {
    rule_code: "INVERTED_TRIANGLE_BALANCE_NOTE",
    title: "Top-dominant balance against narrow-hip silhouette",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "blouse", "shirt"],
    priority: 115,
    evaluate: (ctx) => {
      if (ctx.derived.primary_shape !== "inverted_triangle") return null;
      return {
        rule_code: "INVERTED_TRIANGLE_BALANCE_NOTE",
        recommendation_type: "visual_balance",
        body_region: "overall",
        title: "Preserve the intended line by balancing the lower half visually",
        rationale:
          "When upper-body width or volume dominates, silhouettes that remain very narrow through the hip can read more severe than intended depending on the original reference look.",
        recommendation_text:
          "Consider preserving shoulder geometry while introducing slightly more lower-body presence through hem shape, drape, pocket scale, peplum release, or skirt/pant volume. This is a balance decision rather than a rule of correctness.",
        severity: "minor",
        fit_risk: "moderate",
        requires_muslin: false,
        score: 66,
        sort_order: 115,
      };
    },
  },
  {
    rule_code: "PEAR_BALANCE_NOTE",
    title: "Lower-body dominant balance against a straighter upper block",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "blouse", "shirt", "skirt", "pant"],
    priority: 120,
    evaluate: (ctx) => {
      if (ctx.derived.primary_shape !== "pear" && ctx.derived.primary_shape !== "spoon") return null;
      return {
        rule_code: "PEAR_BALANCE_NOTE",
        recommendation_type: "visual_balance",
        body_region: "overall",
        title: "Maintain visual balance without distorting the waist seam",
        rationale:
          "A lower-body-dominant shape may need the eye to be balanced above the waist, especially when reproducing a look designed on a straighter or more evenly distributed block.",
        recommendation_text:
          "Favor shoulder detail, neckline presence, sleeve articulation, or upper-body texture to balance the silhouette. Technically, keep shaping honest to your measurements rather than forcing the lower garment into a narrower line than the body supports.",
        severity: "minor",
        fit_risk: "moderate",
        requires_muslin: false,
        score: 68,
        sort_order: 120,
      };
    },
  },
  {
    rule_code: "CLOSE_FIT_CORSETED_WARNING",
    title: "Close-fit or corseted references need lower tolerance for mismatch",
    applies_to_categories: ["corset", "dress", "gown", "bra_top", "bodysuit", "jacket"],
    applies_to_fit_types: ["close_fit", "structured"],
    priority: 130,
    evaluate: (ctx) => {
      const bustDelta = safeDelta(ctx.measurement.bust_full, ctx.pattern.base_bust, ctx.pattern.standard_ease_bust);
      const waistDelta = safeDelta(ctx.measurement.waist, ctx.pattern.base_waist, ctx.pattern.standard_ease_waist);
      const hipDelta = safeDelta(ctx.measurement.full_hip, ctx.pattern.base_hip, ctx.pattern.standard_ease_hip);
      const anyLarge =
        (hasNum(bustDelta) && Math.abs(bustDelta) >= 1.5) ||
        (hasNum(waistDelta) && Math.abs(waistDelta) >= 1.5) ||
        (hasNum(hipDelta) && Math.abs(hipDelta) >= 1.5);
      if (!anyLarge) return null;
      return {
        rule_code: "CLOSE_FIT_CORSETED_WARNING",
        recommendation_type: "construction_caution",
        body_region: "overall",
        title: "Use a test garment before committing to final materials",
        rationale:
          "Structured or close-fit garments have less tolerance for even moderate mismatch between body and block. Small errors compound quickly across multiple seams.",
        recommendation_text:
          "Make a muslin or toile before cutting final fabric. Confirm seam placement, vertical balance, compression or support requirements, and movement tolerance in the intended undergarments and footwear.",
        severity: "major",
        fit_risk: "very_high",
        requires_muslin: true,
        score: 98,
        sort_order: 130,
      };
    },
  },
  {
    rule_code: "DROPPED_WAIST_ON_SHORT_WAIST",
    title: "Dropped waist may crowd the upper hip on a short waist",
    applies_to_categories: ["dress", "gown"],
    applies_to_waistlines: ["dropped"],
    priority: 135,
    evaluate: (ctx) => {
      if (ctx.derived.vertical_balance !== "short_waisted") return null;
      return {
        rule_code: "DROPPED_WAIST_ON_SHORT_WAIST",
        recommendation_type: "visual_balance",
        body_region: "waist",
        title: "Check whether the dropped seam lands at the widest or most active part of the torso-hip transition",
        rationale:
          "A dropped waist can visually elongate, but on a shorter waist it may land awkwardly across the upper hip or create horizontal emphasis in the wrong place.",
        recommendation_text:
          "Test a slightly higher drop point, a softened seam line, or a more continuous torso treatment if the original placement feels crowded. Preserve the spirit of the reference rather than treating the seam mark as sacred.",
        severity: "moderate",
        fit_risk: "moderate",
        requires_muslin: true,
        score: 79,
        sort_order: 135,
      };
    },
  },
  {
    rule_code: "LONG_TORSO_SHORT_LEG_BALANCE_NOTE",
    title: "Long torso / short leg proportion can benefit from controlled waist emphasis",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "pant", "short", "skirt"],
    priority: 140,
    evaluate: (ctx) => {
      if (ctx.measurement.leg_balance !== "long_torso_short_leg") return null;
      return {
        rule_code: "LONG_TORSO_SHORT_LEG_BALANCE_NOTE",
        recommendation_type: "styling_advice",
        body_region: "overall",
        title: "Use waist placement and leg line to preserve proportion",
        rationale:
          "Some garments technically fit but visually over-emphasize torso length relative to the leg line.",
        recommendation_text:
          "Consider slightly higher waist placement, longer uninterrupted leg lines, cleaner hems, or reduced torso segmentation when adapting the look. This is a balance refinement rather than a strict fit correction.",
        severity: "minor",
        fit_risk: "low",
        requires_muslin: false,
        score: 60,
        sort_order: 140,
      };
    },
  },
  {
    rule_code: "SHORT_TORSO_LONG_LEG_BALANCE_NOTE",
    title: "Short torso / long leg proportion may need more upper-body breathing room",
    applies_to_categories: ["dress", "gown", "jacket", "coat", "pant", "short", "skirt"],
    priority: 145,
    evaluate: (ctx) => {
      if (ctx.measurement.leg_balance !== "short_torso_long_leg") return null;
      return {
        rule_code: "SHORT_TORSO_LONG_LEG_BALANCE_NOTE",
        recommendation_type: "styling_advice",
        body_region: "overall",
        title: "Avoid over-compressing the torso visually",
        rationale:
          "Certain seam placements, belts, or rigid waist emphasis can make a short torso appear even more compact despite technically correct fit.",
        recommendation_text:
          "Use cleaner vertical transitions across the torso, reduce excessive waist interruption, and test whether a slightly lowered or softened waist treatment preserves the look more gracefully.",
        severity: "minor",
        fit_risk: "low",
        requires_muslin: false,
        score: 59,
        sort_order: 145,
      };
    },
  },
];

// ---------- public engine ----------

export function evaluateFitRules(ctx: FitAssessmentContext): AdjustmentRecommendation[] {
  return rules
    .filter((rule) => appliesToRule(rule, ctx))
    .map((rule) => rule.evaluate(ctx))
    .filter((r): r is AdjustmentRecommendation => r !== null)
    .sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return b.score - a.score;
    });
}

export function computeFitRiskLevel(recommendations: AdjustmentRecommendation[]): FitRiskLevel {
  if (recommendations.some((r) => r.fit_risk === "very_high")) return "very_high";
  if (recommendations.filter((r) => r.fit_risk === "high").length >= 2) return "high";
  if (recommendations.some((r) => r.fit_risk === "high")) return "high";
  if (recommendations.some((r) => r.fit_risk === "moderate")) return "moderate";
  return "low";
}

export function buildFitAssessmentContext(
  measurement: MeasurementProfileInput,
  pattern: PatternBlockInput,
  garmentTitle?: string,
  sourceName?: string,
): FitAssessmentContext {
  const derived = deriveMeasurementProfile(measurement);
  return { measurement, derived, pattern, garmentTitle, sourceName };
}

// ---------- example usage ----------

export const exampleMeasurementProfile: MeasurementProfileInput = {
  units: "in",
  bust_full: 36,
  waist: 28,
  high_hip: 38,
  full_hip: 41.5,
  shoulder_width: 15,
  front_waist_length: 16.5,
  back_waist_length: 15.25,
  inseam: 29.5,
  rise_front: 11,
  rise_back: 15,
  posture: "balanced",
  shoulder_slope: "balanced",
  shoulder_balance: "average",
  bust_shape: "projected",
  seat_shape: "prominent",
  abdomen_shape: "average",
  leg_balance: "balanced",
};

export const examplePatternBlock: PatternBlockInput = {
  category: "dress",
  waistline_type: "natural",
  fit_type: "structured",
  base_bust: 34,
  base_waist: 27,
  base_hip: 37,
  base_shoulder_width: 14.5,
  base_front_waist_length: 15.5,
  base_back_waist_length: 15,
  standard_ease_bust: 1.5,
  standard_ease_waist: 1,
  standard_ease_hip: 1.5,
  intended_shape_assumption: "moderately shaped waist with straighter hip than custom couture block",
  intended_vertical_assumption: "balanced natural waist torso",
};

export function exampleRun() {
  const ctx = buildFitAssessmentContext(
    exampleMeasurementProfile,
    examplePatternBlock,
    "1950s Waist-Seamed Day Dress",
    "Archival Reference",
  );
  const recommendations = evaluateFitRules(ctx);
  const fitRisk = computeFitRiskLevel(recommendations);
  return { derived: ctx.derived, fitRisk, recommendations };
}
