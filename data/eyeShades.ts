/**
 * Eye shades — 24 entries for combined profile system.
 * Reusable reference data; attach fabrics, metals, prints, makeup, runway refs later.
 */

import type { EyeShade } from "@/lib/types";

export const eyeShades: EyeShade[] = [
  { id: "eye-1", code: "icy_blue", name: "Icy Blue", family: "blue", undertone_family: ["cool"], intensity: "bright", default_hex: "#AFC7D9", pattern: "solid" },
  { id: "eye-2", code: "gray_blue", name: "Gray Blue", family: "blue", undertone_family: ["cool", "ash"], intensity: "soft", default_hex: "#8BA0B3", pattern: "ringed" },
  { id: "eye-3", code: "soft_blue", name: "Soft Blue", family: "blue", undertone_family: ["cool"], intensity: "soft", default_hex: "#7E9DB5", pattern: "solid" },
  { id: "eye-4", code: "deep_blue", name: "Deep Blue", family: "blue", undertone_family: ["cool"], intensity: "deep", default_hex: "#36556E", pattern: "solid" },
  { id: "eye-5", code: "blue_green", name: "Blue Green", family: "mixed", undertone_family: ["cool", "neutral"], intensity: "medium", default_hex: "#5D8376", pattern: "mixed" },

  { id: "eye-6", code: "soft_green", name: "Soft Green", family: "green", undertone_family: ["neutral"], intensity: "soft", default_hex: "#78916C", pattern: "solid" },
  { id: "eye-7", code: "olive_green", name: "Olive Green", family: "green", undertone_family: ["olive", "warm"], intensity: "medium", default_hex: "#6C7345", pattern: "mixed" },
  { id: "eye-8", code: "bright_green", name: "Bright Green", family: "green", undertone_family: ["neutral"], intensity: "bright", default_hex: "#6E9153", pattern: "solid" },
  { id: "eye-9", code: "forest_green", name: "Forest Green", family: "green", undertone_family: ["neutral", "cool"], intensity: "deep", default_hex: "#425842", pattern: "ringed" },

  { id: "eye-10", code: "gold_hazel", name: "Gold Hazel", family: "hazel", undertone_family: ["warm", "golden"], intensity: "bright", default_hex: "#8D7A42", pattern: "flecked" },
  { id: "eye-11", code: "green_hazel", name: "Green Hazel", family: "hazel", undertone_family: ["olive", "neutral"], intensity: "medium", default_hex: "#7D7A4C", pattern: "flecked" },
  { id: "eye-12", code: "deep_hazel", name: "Deep Hazel", family: "hazel", undertone_family: ["warm", "neutral"], intensity: "deep", default_hex: "#66563C", pattern: "mixed" },
  { id: "eye-13", code: "amber", name: "Amber", family: "amber", undertone_family: ["warm", "golden"], intensity: "bright", default_hex: "#A26A2C", pattern: "solid" },

  { id: "eye-14", code: "light_brown", name: "Light Brown", family: "brown", undertone_family: ["warm"], intensity: "medium", default_hex: "#8B5E34", pattern: "solid" },
  { id: "eye-15", code: "golden_brown", name: "Golden Brown", family: "brown", undertone_family: ["warm", "golden"], intensity: "bright", default_hex: "#7C5827", pattern: "flecked" },
  { id: "eye-16", code: "medium_brown", name: "Medium Brown", family: "brown", undertone_family: ["neutral"], intensity: "medium", default_hex: "#64452E", pattern: "solid" },
  { id: "eye-17", code: "deep_brown", name: "Deep Brown", family: "brown", undertone_family: ["neutral"], intensity: "deep", default_hex: "#3C2B21", pattern: "solid" },
  { id: "eye-18", code: "near_black_brown", name: "Near Black Brown", family: "brown", undertone_family: ["neutral"], intensity: "deep", default_hex: "#251A16", pattern: "solid" },

  { id: "eye-19", code: "cool_gray", name: "Cool Gray", family: "gray", undertone_family: ["cool", "ash"], intensity: "soft", default_hex: "#8D9190", pattern: "ringed" },
  { id: "eye-20", code: "storm_gray", name: "Storm Gray", family: "gray", undertone_family: ["cool"], intensity: "deep", default_hex: "#616B73", pattern: "ringed" },
  { id: "eye-21", code: "gray_green", name: "Gray Green", family: "mixed", undertone_family: ["cool", "olive"], intensity: "soft", default_hex: "#6D786C", pattern: "mixed" },
  { id: "eye-22", code: "central_hazel", name: "Central Hazel", family: "mixed", undertone_family: ["neutral", "golden"], intensity: "medium", default_hex: "#736847", pattern: "central_heterochromia" },
  { id: "eye-23", code: "gray_blue_green", name: "Gray Blue Green", family: "mixed", undertone_family: ["cool", "neutral"], intensity: "soft", default_hex: "#748991", pattern: "mixed" },
  { id: "eye-24", code: "warm_mixed_brown", name: "Warm Mixed Brown", family: "mixed", undertone_family: ["warm"], intensity: "deep", default_hex: "#5A4232", pattern: "flecked" },
];

export function getEyeShadeByCode(code: string): EyeShade | undefined {
  return eyeShades.find((e) => e.code === code);
}

export function getEyeShadeById(id: string): EyeShade | undefined {
  return eyeShades.find((e) => e.id === id);
}
