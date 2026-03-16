/**
 * 30-shade skin tone system — backward-compatible view for Finder and recommendFabric.
 * Derived from the expanded skinShades (color profile anchor). Use skinShades + hair + eye
 * for the full combined recommendation system.
 */

import type { SkinTone, Undertone, Depth } from "@/lib/types";
import { skinShadesList } from "./skinShades";

function depthFromDepthFamily(
  depthFamily: string
): Depth {
  switch (depthFamily) {
    case "very_fair":
    case "fair":
      return "fair";
    case "light":
    case "light_medium":
      return "light";
    case "medium":
      return "medium";
    case "tan":
      return "tan";
    case "medium-deep":
      return "medium-deep";
    case "dark":
      return "dark";
    case "deep":
      return "deep";
    case "rich":
      return "rich";
    default:
      return "medium";
  }
}

function undertoneFromSkinShade(
  temperatureBias: "warm" | "cool" | "neutral",
  undertoneFamily: string[]
): Undertone {
  if (undertoneFamily.includes("olive")) return "olive";
  if (temperatureBias === "warm") return "warm";
  if (temperatureBias === "cool") return "cool";
  return "neutral";
}

/** Legacy list: one SkinTone per skin shade for Finder/recommendFabric. IDs are st-1 .. st-30. */
export const skinTones: SkinTone[] = skinShadesList.map((s) => ({
  id: `st-${s.shade_number}`,
  shadeNumber: s.shade_number,
  name: s.name,
  description: s.name,
  baseHex: s.base_hex,
  undertone: undertoneFromSkinShade(s.temperature_bias, s.undertone_family),
  depth: depthFromDepthFamily(s.depth_family),
  coordinatingNeutralPalette: s.palette,
}));

export function getSkinToneById(id: string): SkinTone | undefined {
  return skinTones.find((s) => s.id === id);
}
