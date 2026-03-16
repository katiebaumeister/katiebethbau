/**
 * Color profile helpers — resolve skin + hair + eye and combined recommendation logic.
 * Designed so you can later attach fabrics, metals, prints, makeup, runway refs, stitch guidance.
 */

import type { SkinShade, CombinedProfile, RecommendationOverride } from "@/lib/types";
import { getSkinShadeByNumber } from "@/data/skinShades";
import { getHairShadeByCode } from "@/data/hairShades";
import { getEyeShadeByCode } from "@/data/eyeShades";
import {
  getCombinedProfile,
  getCombinedProfileByCode,
  combinedProfiles,
} from "@/data/combinedProfiles";
import { getOverridesForProfile } from "@/data/recommendationOverrides";

/**
 * Get the hand-authored combined profile for a (skin, hair, eye) triple, if it exists.
 */
export function getProfileForTriple(
  skinShadeNumber: number,
  hairCode: string,
  eyeCode: string
): CombinedProfile | undefined {
  return getCombinedProfile(skinShadeNumber, hairCode, eyeCode);
}

/**
 * Resolved recommendation view: merge skin shade defaults with combined profile and overrides.
 * Use this for UI and for attaching fabrics/metals/prints later.
 */
export interface ResolvedColorRecommendations {
  skin: SkinShade;
  hairCode: string;
  eyeCode: string;
  /** Hand-authored combined profile, or null if none exists for this triple */
  combined: CombinedProfile | null;
  /** Top neutrals (from combined profile or fallback to skin.palette slice) */
  top_neutrals: string[];
  /** Accent colors (from combined or empty) */
  accent_colors: string[];
  /** Avoid colors (from combined or skin.avoid_neutrals) */
  avoid_colors: string[];
  /** Best metals (from combined or skin.recommended_metals) */
  best_metals: string[];
  /** Overall contrast (from combined or skin.contrast_default) */
  overall_contrast: "low" | "medium" | "high";
  /** Temperature summary (from combined or derived from skin.temperature_bias) */
  temperature_summary: "warm" | "cool" | "neutral-balanced" | "olive-balanced";
  /** Applicable overrides for this profile */
  overrides: RecommendationOverride[];
}

export function getResolvedRecommendations(
  skinShadeNumber: number,
  hairCode: string,
  eyeCode: string
): ResolvedColorRecommendations | null {
  const skin = getSkinShadeByNumber(skinShadeNumber);
  if (!skin) return null;

  const combined = getProfileForTriple(skinShadeNumber, hairCode, eyeCode) ?? null;
  const overrides = getOverridesForProfile(skinShadeNumber, hairCode, eyeCode);

  const top_neutrals =
    combined?.top_neutrals?.length ? combined.top_neutrals : skin.palette.slice(0, 5);
  const accent_colors = combined?.accent_colors ?? [];
  const avoid_colors =
    combined?.avoid_colors?.length ? combined.avoid_colors : skin.avoid_neutrals;
  const best_metals =
    combined?.best_metals?.length
      ? combined.best_metals
      : skin.recommended_metals;
  const overall_contrast = combined?.overall_contrast ?? skin.contrast_default;
  const temperature_summary =
    combined?.temperature_summary ??
    (skin.temperature_bias === "neutral"
      ? "neutral-balanced"
      : skin.temperature_bias === "warm"
        ? "warm"
        : "cool");

  return {
    skin,
    hairCode,
    eyeCode,
    combined,
    top_neutrals,
    accent_colors,
    avoid_colors,
    best_metals,
    overall_contrast,
    temperature_summary,
    overrides,
  };
}

/**
 * List all combined profile codes (for dropdowns or search).
 */
export function getAllCombinedProfileCodes(): string[] {
  return combinedProfiles.map((p) => p.code);
}

export { getSkinShadeByNumber, getSkinShadeById } from "@/data/skinShades";
export { getHairShadeByCode, getHairShadeById } from "@/data/hairShades";
export { getEyeShadeByCode, getEyeShadeById } from "@/data/eyeShades";
export { getCombinedProfileByCode, getCombinedProfilesForSkin } from "@/data/combinedProfiles";
