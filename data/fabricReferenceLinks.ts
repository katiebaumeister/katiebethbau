/**
 * Fabric ↔ reference source links (runway + vintage).
 * Powers "show runway/vintage examples for this fabric".
 */

import type { FabricReferenceLink } from "@/lib/types";

export const fabricReferenceLinks: FabricReferenceLink[] = [
  {
    id: "FRL_001",
    fabric_id: "FAB004",
    reference_source_id: "REF_RUNWAY_001",
    relationship_type: "probable_use",
    confidence_score: 0.82,
    notes: "Useful shirting reference for crisp minimalist garments.",
  },
  {
    id: "FRL_002",
    fabric_id: "FAB045",
    reference_source_id: "REF_RUNWAY_002",
    relationship_type: "probable_use",
    confidence_score: 0.73,
    notes: "Good reference for fluid bias-cut slip behavior.",
  },
  {
    id: "FRL_003",
    fabric_id: "FAB030",
    reference_source_id: "REF_RUNWAY_003",
    relationship_type: "probable_use",
    confidence_score: 0.86,
    notes: "Summer tailoring reference.",
  },
  {
    id: "FRL_004",
    fabric_id: "FAB056",
    reference_source_id: "REF_RUNWAY_004",
    relationship_type: "similar_hand",
    confidence_score: 0.58,
    notes: "Demonstrates sculptural couture structure.",
  },
  {
    id: "FRL_005",
    fabric_id: "FAB055",
    reference_source_id: "REF_RUNWAY_007",
    relationship_type: "probable_use",
    confidence_score: 0.79,
    notes: "Strong evening velvet reference.",
  },
  {
    id: "FRL_006",
    fabric_id: "FAB013",
    reference_source_id: "REF_RUNWAY_010",
    relationship_type: "explicit_use",
    confidence_score: 0.88,
    notes: "Minimal denim workwear reference.",
  },
  {
    id: "FRL_007",
    fabric_id: "FAB016",
    reference_source_id: "REF_VINTAGE_001",
    relationship_type: "pattern_recommended",
    confidence_score: 0.91,
    notes: "Classic 1950s structured dress fabric.",
  },
  {
    id: "FRL_008",
    fabric_id: "FAB004",
    reference_source_id: "REF_VINTAGE_002",
    relationship_type: "pattern_recommended",
    confidence_score: 0.89,
    notes: "Good shirtwaist fabric mapping.",
  },
  {
    id: "FRL_012",
    fabric_id: "FAB006",
    reference_source_id: "REF_VINTAGE_008",
    relationship_type: "pattern_recommended",
    confidence_score: 0.93,
    notes: "Utility blouse pattern; cotton poplin or shirting.",
  },
  {
    id: "FRL_009",
    fabric_id: "FAB045",
    reference_source_id: "REF_VINTAGE_004",
    relationship_type: "pattern_recommended",
    confidence_score: 0.84,
    notes: "Useful for bias-cut evening logic.",
  },
  {
    id: "FRL_010",
    fabric_id: "FAB049",
    reference_source_id: "REF_VINTAGE_009",
    relationship_type: "pattern_recommended",
    confidence_score: 0.88,
    notes: "Strong 1950s party dress structure reference.",
  },
  {
    id: "FRL_011",
    fabric_id: "FAB064",
    reference_source_id: "REF_VINTAGE_010",
    relationship_type: "pattern_recommended",
    confidence_score: 0.86,
    notes: "Tailored blazer reference.",
  },
];
