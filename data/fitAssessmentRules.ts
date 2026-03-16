/**
 * Fit assessment rules — condition triggers output (recommendation template).
 * Engine compares user derived values + garment/block assumptions and applies rules.
 */

import type { FitAssessmentRule } from "@/lib/fitTypes";

export const fitAssessmentRules: FitAssessmentRule[] = [
  {
    id: "rule-1",
    rule_code: "hip_waist_larger_than_block",
    applies_to_category: "dress",
    condition_json: {
      hip_waist_drop_gt: 12,
      pattern_base_hip_waist_drop_lt: 10,
      category_in: ["dress", "skirt", "pant"],
    },
    output_json: {
      recommendation_type: "pattern_adjustment",
      body_region: "waist",
      title: "Preserve balance by shifting shaping upward",
      rationale: "Your waist-to-hip relationship is more pronounced than the pattern's base block.",
      recommendation_text:
        "Rather than only taking additional width from the waist seam, consider slightly raising the visual waist placement, deepening darts or princess shaping, and letting the side seam release over the high hip. This usually keeps the garment from appearing pulled downward or overly tight at the upper hip.",
      severity: "moderate",
      requires_muslin: true,
    },
    priority: 100,
    is_active: true,
  },
  {
    id: "rule-2",
    rule_code: "long_torso_raised_waist",
    applies_to_waistline: "empire",
    condition_json: {
      vertical_balance: "long_waisted",
      waistline_type: "empire",
    },
    output_json: {
      recommendation_type: "pattern_adjustment",
      body_region: "torso",
      title: "Lower empire seam slightly for comfort",
      rationale: "A raised waist may visually shorten the torso attractively, but the seam placement may sit high on a long torso.",
      recommendation_text:
        "Consider lowering the empire seam slightly from the original pattern mark to avoid pulling across the bust apex. Add length to the bodice section so the seam sits just under the bust where intended.",
      severity: "minor",
      requires_muslin: true,
    },
    priority: 90,
    is_active: true,
  },
  {
    id: "rule-3",
    rule_code: "prominent_seat_straight_skirt",
    applies_to_category: "skirt",
    condition_json: {
      seat_shape: "prominent",
      category_in: ["skirt", "pant"],
    },
    output_json: {
      recommendation_type: "pattern_adjustment",
      body_region: "seat",
      title: "Add back length and seat projection before widening",
      rationale: "The garment assumes a flatter seat profile.",
      recommendation_text:
        "Add back length and seat projection before widening side seams indiscriminately; otherwise the hem may kick backward and the side seams may swing. Consider a full seat adjustment or additional back dart shaping.",
      severity: "moderate",
      requires_muslin: true,
    },
    priority: 95,
    is_active: true,
  },
  {
    id: "rule-4",
    rule_code: "short_waisted_natural_waist",
    applies_to_category: "dress",
    condition_json: {
      vertical_balance: "short_waisted",
      waistline_type: "natural",
    },
    output_json: {
      recommendation_type: "visual_balance",
      body_region: "torso",
      title: "Waistline may sit slightly low on you",
      rationale: "Your torso is proportionally shorter; the pattern's natural waist may align lower on your body.",
      recommendation_text:
        "The pattern's natural waistline may hit slightly below your actual waist. You can shorten the bodice above the waist seam or raise the waistline placement to match your waist, then adjust skirt length as needed.",
      severity: "minor",
      requires_muslin: false,
    },
    priority: 80,
    is_active: true,
  },
  {
    id: "rule-5",
    rule_code: "front_back_waist_imbalance",
    condition_json: {
      front_back_waist_delta_abs_gt: 1.5,
    },
    output_json: {
      recommendation_type: "pattern_adjustment",
      body_region: "torso",
      title: "Balance front and back waist length",
      rationale: "Your front and back waist lengths differ from the pattern's assumption.",
      recommendation_text:
        "Consider a front or back length adjustment so the waistline sits level and the garment doesn't pull forward or backward. This is especially important for fitted waistlines.",
      severity: "moderate",
      requires_muslin: true,
    },
    priority: 85,
    is_active: true,
  },
];
