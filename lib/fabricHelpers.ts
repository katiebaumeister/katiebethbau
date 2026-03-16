/**
 * Helpers for fabric detail page and climate scoring.
 * Uses master fabric catalog + stitch, climate, designer profiles.
 */

import type { FabricRecord, ClimateProfile } from "@/lib/types";
import { fabrics } from "@/data/fabrics";
import { getStitchProfileById } from "@/data/stitchProfiles";
import { getClimateProfileById } from "@/data/climateProfiles";
import { getDesignerProfileById } from "@/data/designerProfiles";

export function getFabricById(id: string): FabricRecord | undefined {
  return fabrics.find((f) => f.id === id);
}

export function getStitchProfileForFabric(fabric: FabricRecord) {
  return getStitchProfileById(fabric.stitch_profile_id);
}

export function getClimateProfileForFabric(fabric: FabricRecord) {
  return getClimateProfileById(fabric.climate_profile_id);
}

export function getDesignerProfileForFabric(fabric: FabricRecord) {
  return getDesignerProfileById(fabric.designer_profile_id);
}

/** User-facing climate options; map to profile scores (1–10) for scoring */
export type ClimateKey = "hot" | "humid" | "temperate" | "cool" | "cold" | "dry";

/**
 * Score how well a fabric suits a given climate using its climate profile.
 * Returns 0–100. Uses the profile's 1–10 value for that climate key.
 */
export function scoreFabricForClimate(
  fabric: FabricRecord,
  climate: ClimateKey
): number {
  const profile = getClimateProfileForFabric(fabric);
  if (!profile) return 50;
  const value = profile[climate];
  if (value == null) return 50;
  return Math.round((value / 10) * 100);
}
