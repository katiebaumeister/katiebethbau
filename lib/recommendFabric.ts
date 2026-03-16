/**
 * Fabric recommendation engine.
 * Skin tone/color coordination has the highest weight. Climate influences
 * breathability, insulation, and weight; durability favors stronger and
 * lower-maintenance fabrics; comfort influences drape, softness, and structure.
 * Returns a score breakdown so the UI can explain why each fabric was chosen.
 */

import type {
  Fabric,
  FabricRecommendation,
  FinderFilters,
  ClimateOption,
  DurabilityOption,
  ComfortOption,
  RecommendationScoreBreakdown,
} from "@/lib/types";
import { fabricsFinder as fabrics } from "@/data/fabricsFinder";
import { getSkinToneById } from "@/data/skinTones";

// Weights: skin tone highest, then climate, durability, comfort
const WEIGHT_SKIN_TONE = 0.40;
const WEIGHT_CLIMATE = 0.25;
const WEIGHT_DURABILITY = 0.20;
const WEIGHT_COMFORT = 0.15;

/** Normalize 0–1 to 0–100 for display */
function toPercent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

// --- Skin tone (highest weight; real data) ---

function scoreSkinTone(
  fabric: Fabric,
  skinToneId: string | null
): { score: number; bestColorFamily: string } {
  if (!skinToneId) {
    return { score: 1, bestColorFamily: fabric.recommendedColorFamilies[0] ?? "—" };
  }
  const skinTone = getSkinToneById(skinToneId);
  if (!skinTone) {
    return { score: 1, bestColorFamily: fabric.recommendedColorFamilies[0] ?? "—" };
  }
  const undertoneMatch = fabric.recommendedForSkinUndertones.includes(skinTone.undertone);
  const score = undertoneMatch ? 1 : 0.35;
  const bestColorFamily = fabric.recommendedColorFamilies[0] ?? "—";
  return { score, bestColorFamily };
}

// --- Climate: breathability, insulation, fabric weight ---

/** Climate drives desired breathability and insulation; score 0–1 */
function scoreClimate(fabric: Fabric, climate: ClimateOption | null): number {
  if (!climate) return 1;

  const directTagMatch = fabric.climateTags.includes(climate) ? 0.4 : 0;

  // Hot/humid: favor high breathability
  if (climate === "hot" || climate === "humid") {
    const breathScore = fabric.breathabilityScore / 5;
    return Math.min(1, directTagMatch + 0.6 * breathScore);
  }

  // Cold: favor lower breathability (more insulation), heavier structure
  if (climate === "cold") {
    const insulationScore = (6 - fabric.breathabilityScore) / 5; // inverse of breathability
    const structureBonus = ["structured", "medium-structured"].includes(fabric.structureLevel) ? 0.3 : 0;
    return Math.min(1, directTagMatch + 0.4 * insulationScore + structureBonus);
  }

  // Temperate/dry: flexible; tag match and mid breathability both ok
  if (climate === "temperate" || climate === "dry") {
    return directTagMatch > 0 ? 0.9 : 0.6;
  }

  return directTagMatch || 0.5;
}

// --- Durability: stronger fabrics, lower maintenance ---

function scoreDurability(
  fabric: Fabric,
  durability: DurabilityOption | null
): number {
  if (!durability) return 1;

  const wantLevel = { low: 1, medium: 3, high: 5 }[durability];
  const diff = Math.abs(fabric.durabilityScore - wantLevel);
  const strengthScore = Math.max(0, 1 - diff / 5);

  // Low-maintenance: favor easy care (machine wash, etc.)
  const care = fabric.careLevel.toLowerCase();
  const easyCare = care.includes("machine wash") ? 1 : care.includes("hand wash") ? 0.6 : 0.3;
  const maintenanceScore = durability === "high" ? easyCare : 1; // only penalize when they want high durability

  return durability === "high"
    ? 0.6 * strengthScore + 0.4 * maintenanceScore
    : strengthScore;
}

// --- Comfort: drape, softness, structure ---

function scoreComfort(fabric: Fabric, comfort: ComfortOption | null): number {
  if (!comfort) return 1;

  switch (comfort) {
    case "soft-drapey": {
      const drapeScore = ["soft", "medium-soft"].includes(fabric.structureLevel) ? 1 : 0.4;
      const tagMatch = fabric.comfortTags.includes("soft-drapey") ? 0.3 : 0;
      return Math.min(1, drapeScore * 0.7 + tagMatch);
    }
    case "breathable": {
      const breathScore = fabric.breathabilityScore / 5;
      const tagMatch = fabric.comfortTags.includes("breathable") ? 0.3 : 0;
      return Math.min(1, breathScore * 0.7 + tagMatch);
    }
    case "structured": {
      const structScore = ["structured", "medium-structured"].includes(fabric.structureLevel) ? 1 : 0.4;
      const tagMatch = fabric.comfortTags.includes("structured") ? 0.3 : 0;
      return Math.min(1, structScore * 0.7 + tagMatch);
    }
    case "low-maintenance": {
      const care = fabric.careLevel.toLowerCase();
      const easyCare = care.includes("machine wash") ? 1 : care.includes("hand wash") ? 0.6 : 0.3;
      const tagMatch = fabric.comfortTags.includes("low-maintenance") ? 0.3 : 0;
      return Math.min(1, easyCare * 0.7 + tagMatch);
    }
    default:
      return 1;
  }
}

/** Build match reasons list and a single explanation string from the breakdown */
function buildExplanationAndReasons(
  fabric: Fabric,
  filters: FinderFilters,
  bestColorFamily: string,
  scores: { skin: number; climate: number; durability: number; comfort: number }
): { explanation: string; matchReasons: string[] } {
  const reasons: string[] = [];
  const skinTone = filters.skinToneId ? getSkinToneById(filters.skinToneId) : null;

  if (skinTone && scores.skin > 0.5) {
    const undertoneMatch = fabric.recommendedForSkinUndertones.includes(skinTone.undertone);
    if (undertoneMatch) {
      reasons.push(`Recommended for ${skinTone.undertone} undertones—flatters your skin tone.`);
    }
    reasons.push(`Best in ${bestColorFamily} to complement your shade.`);
  }

  if (filters.climate && scores.climate > 0.5) {
    if (fabric.climateTags.includes(filters.climate)) {
      reasons.push(`Suited to ${filters.climate} climates.`);
    } else {
      reasons.push(`Works for your climate (breathability and weight considered).`);
    }
  }

  if (filters.durability && scores.durability > 0.5) {
    const level = fabric.durabilityScore >= 4 ? "high" : fabric.durabilityScore >= 3 ? "medium" : "low";
    reasons.push(`Durability: ${level}; ${fabric.careLevel}.`);
  }

  if (filters.comfort && scores.comfort > 0.5) {
    reasons.push(`Offers the ${filters.comfort.replace(/-/g, " ")} you want.`);
  }

  if (reasons.length === 0) {
    reasons.push("A versatile choice across your criteria.");
  }

  const explanation = reasons.join(" ");
  return { explanation, matchReasons: reasons };
}

/**
 * Get ranked fabric recommendations with full score breakdown.
 * Phase 1: returns top 3. All scores 0–100; explanation summarizes why it was chosen.
 */
export function getRecommendations(filters: FinderFilters): FabricRecommendation[] {
  const { skinToneId, climate, durability, comfort } = filters;

  const scored = fabrics.map((fabric) => {
    const skinResult = scoreSkinTone(fabric, skinToneId);
    const skinRaw = skinResult.score;
    const climateRaw = scoreClimate(fabric, climate);
    const durabilityRaw = scoreDurability(fabric, durability);
    const comfortRaw = scoreComfort(fabric, comfort);

    const totalRaw =
      WEIGHT_SKIN_TONE * skinRaw +
      WEIGHT_CLIMATE * climateRaw +
      WEIGHT_DURABILITY * durabilityRaw +
      WEIGHT_COMFORT * comfortRaw;

    const { explanation, matchReasons } = buildExplanationAndReasons(
      fabric,
      filters,
      skinResult.bestColorFamily,
      { skin: skinRaw, climate: climateRaw, durability: durabilityRaw, comfort: comfortRaw }
    );

    const scoreBreakdown: RecommendationScoreBreakdown = {
      total_score: toPercent(totalRaw),
      skin_tone_score: toPercent(skinRaw),
      climate_score: toPercent(climateRaw),
      durability_score: toPercent(durabilityRaw),
      comfort_score: toPercent(comfortRaw),
      explanation,
    };

    return {
      fabric,
      score: scoreBreakdown.total_score,
      scoreBreakdown,
      matchReasons,
      bestColorFamily: skinResult.bestColorFamily,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((r) => r.score > 0).slice(0, 3);
}
