/**
 * Pattern blocks — intended body base and ease assumptions per garment.
 */

import type { PatternBlock } from "@/lib/fitTypes";

export const patternBlocks: PatternBlock[] = [
  {
    id: "block-1",
    garment_example_id: "garment-1",
    block_name: "1950s day dress block",
    intended_body_base: "1950s proportions",
    size_system: "bust",
    base_bust: 34,
    base_waist: 26,
    base_hip: 36,
    base_shoulder_width: 14.5,
    base_back_waist_length: 15.5,
    base_front_waist_length: 16,
    standard_ease_bust: 2,
    standard_ease_waist: 1,
    standard_ease_hip: 3,
    vertical_assumption: "Moderate torso length; waist at natural placement.",
    shape_assumption: "Smaller waist-to-hip difference than modern RTW (hip-waist drop ~10 in.).",
    notes: "Period block; full skirt hides hip fit to a degree.",
  },
  {
    id: "block-2",
    garment_example_id: "garment-2",
    block_name: "1930s bias gown",
    intended_body_base: "1930s silhouette",
    base_bust: 32,
    base_waist: 25,
    base_hip: 35,
    base_back_waist_length: 16,
    base_front_waist_length: 16.5,
    standard_ease_bust: 2,
    standard_ease_waist: 0,
    standard_ease_hip: 2,
    vertical_assumption: "Long torso; narrow ribcage common in period blocks.",
    shape_assumption: "Bias cut accommodates some curve; minimal waist ease.",
    notes: "Bias stretch allows some forgiveness.",
  },
  {
    id: "block-3",
    garment_example_id: "garment-3",
    block_name: "Straight-leg pant block",
    intended_body_base: "Modern RTW grading",
    size_system: "waist/hip",
    base_bust: 0,
    base_waist: 28,
    base_hip: 38,
    base_back_waist_length: 16,
    base_front_waist_length: 15.5,
    base_rise_front: 10,
    base_rise_back: 14,
    standard_ease_waist: 1,
    standard_ease_hip: 2,
    vertical_assumption: "Average rise and inseam proportion.",
    shape_assumption: "Straighter hip-to-waist grading (hip-waist drop ~10 in. in block).",
    notes: "Full hip or prominent seat often need back length and seat projection adjustments.",
  },
  {
    id: "block-4",
    garment_example_id: "garment-4",
    block_name: "Empire dress block",
    intended_body_base: "Contemporary relaxed fit",
    base_bust: 35,
    base_waist: 28,
    base_hip: 38,
    base_front_waist_length: 14,
    standard_ease_bust: 3,
    standard_ease_waist: 4,
    standard_ease_hip: 4,
    vertical_assumption: "Empire seam under bust; shorter bodice section.",
    shape_assumption: "Full skirt from under bust; waist not fitted.",
    notes: "Long torso may need empire seam lowered slightly to avoid pull at bust apex.",
  },
  {
    id: "block-5",
    garment_example_id: "garment-5",
    block_name: "Tailored blazer block",
    intended_body_base: "Average shoulder and back",
    base_bust: 36,
    base_waist: 30,
    base_hip: 38,
    base_shoulder_width: 15,
    base_back_waist_length: 16,
    base_front_waist_length: 16.5,
    standard_ease_bust: 3,
    standard_ease_waist: 2,
    standard_ease_hip: 2,
    vertical_assumption: "Balanced front/back waist length.",
    shape_assumption: "Structured; shoulder and back width key.",
    notes: "Swayback or erect posture may need back length or shoulder adjustment.",
  },
];

export function getPatternBlockByGarmentId(garmentExampleId: string): PatternBlock | undefined {
  return patternBlocks.find((b) => b.garment_example_id === garmentExampleId);
}

export function getPatternBlockById(id: string): PatternBlock | undefined {
  return patternBlocks.find((b) => b.id === id);
}
