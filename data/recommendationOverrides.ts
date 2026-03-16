/**
 * Recommendation overrides — boost, penalize, avoid, or highlight by trait combination.
 * Use for algorithmic scoring; attach to fabrics, metals, prints, makeup, runway refs later.
 */

import type { RecommendationOverride } from "@/lib/types";

export const recommendationOverrides: RecommendationOverride[] = [
  {
    id: "ov-1",
    skin_shade_number: 1,
    effect: "avoid",
    target_type: "neutral",
    target_value: "stark optic white",
    score_delta: -20,
    reason: "Very fair skin can wash out in pure white.",
  },
  {
    id: "ov-2",
    skin_shade_number: 29,
    effect: "boost",
    target_type: "metal",
    target_value: "rose_gold",
    score_delta: 15,
    reason: "Rich red undertones harmonize with rose gold.",
  },
  {
    id: "ov-3",
    hair_code: "copper_red",
    effect: "highlight",
    target_type: "accent",
    target_value: "olive moss",
    score_delta: 10,
    reason: "Copper hair pairs well with muted olive accents.",
  },
];

export function getOverridesForProfile(
  skinShadeNumber?: number,
  hairCode?: string,
  eyeCode?: string
): RecommendationOverride[] {
  return recommendationOverrides.filter((o) => {
    if (o.skin_shade_number != null && o.skin_shade_number !== skinShadeNumber) return false;
    if (o.hair_code != null && o.hair_code !== hairCode) return false;
    if (o.eye_code != null && o.eye_code !== eyeCode) return false;
    return true;
  });
}
