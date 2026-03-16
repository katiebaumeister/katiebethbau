/**
 * Hair shades — 36 entries for combined profile system.
 * Reusable reference data; attach fabrics, metals, prints, makeup, runway refs later.
 */

import type { HairShade } from "@/lib/types";

export const hairShades: HairShade[] = [
  { id: "hair-1", code: "platinum_ice", name: "Platinum Ice", family: "blonde", depth_level: 10, undertone_family: ["cool", "ash"], default_hex: "#EDE7DE", intensity: "bright", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-2", code: "champagne_blonde", name: "Champagne Blonde", family: "blonde", depth_level: 9, undertone_family: ["neutral", "golden"], default_hex: "#E7D6B8", intensity: "bright", recommended_metals: ["champagne_gold", "soft_gold"] },
  { id: "hair-3", code: "beige_blonde", name: "Beige Blonde", family: "blonde", depth_level: 8, undertone_family: ["neutral"], default_hex: "#DCC8A6", intensity: "medium", recommended_metals: ["champagne_gold", "silver"] },
  { id: "hair-4", code: "ash_blonde", name: "Ash Blonde", family: "blonde", depth_level: 8, undertone_family: ["cool", "ash"], default_hex: "#CFC0A0", intensity: "soft", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-5", code: "golden_blonde", name: "Golden Blonde", family: "blonde", depth_level: 8, undertone_family: ["warm", "golden"], default_hex: "#D8B26E", intensity: "bright", recommended_metals: ["yellow_gold", "soft_gold"] },
  { id: "hair-6", code: "honey_blonde", name: "Honey Blonde", family: "blonde", depth_level: 7, undertone_family: ["warm", "golden"], default_hex: "#C89A58", intensity: "bright", recommended_metals: ["yellow_gold", "bronze"] },
  { id: "hair-7", code: "strawberry_blonde", name: "Strawberry Blonde", family: "blonde", depth_level: 7, undertone_family: ["warm", "peach", "red"], default_hex: "#C98862", intensity: "bright", recommended_metals: ["rose_gold", "yellow_gold"] },
  { id: "hair-8", code: "dark_blonde", name: "Dark Blonde", family: "blonde", depth_level: 6, undertone_family: ["neutral"], default_hex: "#B08E5D", intensity: "medium", recommended_metals: ["champagne_gold", "soft_gold"] },

  { id: "hair-9", code: "mushroom_brown", name: "Mushroom Brown", family: "brown", depth_level: 6, undertone_family: ["cool", "ash"], default_hex: "#8E7A6B", intensity: "soft", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-10", code: "ash_light_brown", name: "Ash Light Brown", family: "brown", depth_level: 6, undertone_family: ["cool", "ash"], default_hex: "#8C725E", intensity: "soft", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-11", code: "neutral_light_brown", name: "Neutral Light Brown", family: "brown", depth_level: 6, undertone_family: ["neutral"], default_hex: "#8B6A4E", intensity: "medium", recommended_metals: ["champagne_gold", "silver"] },
  { id: "hair-12", code: "golden_light_brown", name: "Golden Light Brown", family: "brown", depth_level: 6, undertone_family: ["warm", "golden"], default_hex: "#977148", intensity: "medium", recommended_metals: ["soft_gold", "yellow_gold"] },
  { id: "hair-13", code: "chestnut", name: "Chestnut", family: "brown", depth_level: 5, undertone_family: ["warm", "red"], default_hex: "#88573A", intensity: "medium", recommended_metals: ["bronze", "rose_gold"] },
  { id: "hair-14", code: "caramel_brown", name: "Caramel Brown", family: "brown", depth_level: 5, undertone_family: ["warm", "golden"], default_hex: "#9C6844", intensity: "bright", recommended_metals: ["yellow_gold", "bronze"] },
  { id: "hair-15", code: "neutral_medium_brown", name: "Neutral Medium Brown", family: "brown", depth_level: 5, undertone_family: ["neutral"], default_hex: "#6F4D36", intensity: "medium", recommended_metals: ["champagne_gold", "bronze"] },
  { id: "hair-16", code: "warm_medium_brown", name: "Warm Medium Brown", family: "brown", depth_level: 5, undertone_family: ["warm"], default_hex: "#754C31", intensity: "medium", recommended_metals: ["yellow_gold", "bronze"] },
  { id: "hair-17", code: "cool_medium_brown", name: "Cool Medium Brown", family: "brown", depth_level: 5, undertone_family: ["cool", "ash"], default_hex: "#665247", intensity: "soft", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-18", code: "cocoa_brown", name: "Cocoa Brown", family: "brown", depth_level: 4, undertone_family: ["neutral"], default_hex: "#5C4033", intensity: "soft", recommended_metals: ["champagne_gold", "gunmetal"] },
  { id: "hair-19", code: "chocolate_brown", name: "Chocolate Brown", family: "brown", depth_level: 4, undertone_family: ["warm"], default_hex: "#5B3A29", intensity: "deep", recommended_metals: ["bronze", "yellow_gold"] },
  { id: "hair-20", code: "espresso_brown", name: "Espresso Brown", family: "brown", depth_level: 3, undertone_family: ["neutral"], default_hex: "#3E2B24", intensity: "deep", recommended_metals: ["gunmetal", "bronze"] },

  { id: "hair-21", code: "soft_black", name: "Soft Black", family: "black", depth_level: 2, undertone_family: ["neutral"], default_hex: "#2B2322", intensity: "deep", recommended_metals: ["gunmetal", "silver"] },
  { id: "hair-22", code: "true_black", name: "True Black", family: "black", depth_level: 1, undertone_family: ["neutral"], default_hex: "#1C1715", intensity: "deep", recommended_metals: ["gunmetal", "silver"] },
  { id: "hair-23", code: "blue_black", name: "Blue Black", family: "black", depth_level: 1, undertone_family: ["cool"], default_hex: "#191B21", intensity: "deep", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-24", code: "warm_black", name: "Warm Black", family: "black", depth_level: 1, undertone_family: ["warm"], default_hex: "#241915", intensity: "deep", recommended_metals: ["bronze", "yellow_gold"] },

  { id: "hair-25", code: "copper_red", name: "Copper Red", family: "red", depth_level: 6, undertone_family: ["warm", "red"], default_hex: "#A25735", intensity: "bright", recommended_metals: ["rose_gold", "bronze"] },
  { id: "hair-26", code: "ginger_red", name: "Ginger Red", family: "red", depth_level: 7, undertone_family: ["warm", "red", "peach"], default_hex: "#B86A3B", intensity: "bright", recommended_metals: ["rose_gold", "yellow_gold"] },
  { id: "hair-27", code: "light_auburn", name: "Light Auburn", family: "auburn", depth_level: 6, undertone_family: ["warm", "red"], default_hex: "#8A4D35", intensity: "medium", recommended_metals: ["rose_gold", "bronze"] },
  { id: "hair-28", code: "classic_auburn", name: "Classic Auburn", family: "auburn", depth_level: 5, undertone_family: ["warm", "red"], default_hex: "#7A3F2C", intensity: "medium", recommended_metals: ["rose_gold", "bronze"] },
  { id: "hair-29", code: "deep_auburn", name: "Deep Auburn", family: "auburn", depth_level: 4, undertone_family: ["warm", "red"], default_hex: "#5E2D22", intensity: "deep", recommended_metals: ["rose_gold", "bronze"] },
  { id: "hair-30", code: "mahogany_red", name: "Mahogany Red", family: "red", depth_level: 4, undertone_family: ["warm", "red"], default_hex: "#5A2F27", intensity: "deep", recommended_metals: ["rose_gold", "oxidized_bronze"] },

  { id: "hair-31", code: "silver_gray", name: "Silver Gray", family: "gray", depth_level: 9, undertone_family: ["cool"], default_hex: "#B9B7B1", intensity: "bright", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-32", code: "cool_gray", name: "Cool Gray", family: "gray", depth_level: 7, undertone_family: ["cool", "ash"], default_hex: "#8D8A84", intensity: "soft", recommended_metals: ["silver", "gunmetal"] },
  { id: "hair-33", code: "salt_pepper", name: "Salt and Pepper", family: "gray", depth_level: 5, undertone_family: ["neutral"], default_hex: "#6E6862", intensity: "medium", recommended_metals: ["silver", "champagne_gold"] },
  { id: "hair-34", code: "warm_gray", name: "Warm Gray", family: "gray", depth_level: 6, undertone_family: ["warm"], default_hex: "#8B7D73", intensity: "soft", recommended_metals: ["champagne_gold", "bronze"] },
  { id: "hair-35", code: "white_hair", name: "White Hair", family: "white", depth_level: 10, undertone_family: ["cool", "neutral"], default_hex: "#F3EFE6", intensity: "bright", recommended_metals: ["silver", "champagne_gold"] },
  { id: "hair-36", code: "cream_white", name: "Cream White", family: "white", depth_level: 10, undertone_family: ["warm"], default_hex: "#EEE4D1", intensity: "bright", recommended_metals: ["champagne_gold", "soft_gold"] },
];

export function getHairShadeByCode(code: string): HairShade | undefined {
  return hairShades.find((h) => h.code === code);
}

export function getHairShadeById(id: string): HairShade | undefined {
  return hairShades.find((h) => h.id === id);
}
