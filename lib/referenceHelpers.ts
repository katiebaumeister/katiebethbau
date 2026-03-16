/**
 * Reference library helpers: resolve sources, observations, attributes,
 * and build grouped/card views for fabric detail pages.
 */

import type {
  ReferenceSource,
  ReferenceCardView,
  ReferenceCardKind,
  ConfidenceLabel,
} from "@/lib/types";
import { referenceSources } from "@/data/referenceSources";
import { allFabricReferenceLinks } from "@/data/fabricReferenceLinks.merged";
import { allReferenceMaterialObservations } from "@/data/referenceMaterialObservations.merged";
import { allReferenceAttributes } from "@/data/referenceAttributes.merged";
import { referencePatternLinks } from "@/data/referencePatternLinks";
import { getFabricById } from "@/lib/fabricHelpers";

export function getReferenceSourceById(id: string): ReferenceSource | undefined {
  return referenceSources.find((s) => s.id === id);
}

/** Map confidence score 0–1 to high | medium | low for UI */
export function getConfidenceLabel(score: number): ConfidenceLabel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

export function getPrimaryMaterialObservation(referenceSourceId: string) {
  return allReferenceMaterialObservations.find(
    (o) =>
      o.reference_source_id === referenceSourceId && o.is_primary_fabric
  );
}

export function getReferenceAttributes(referenceSourceId: string) {
  return allReferenceAttributes.filter(
    (a) => a.reference_source_id === referenceSourceId
  );
}

export function getPatternLink(referenceSourceId: string) {
  return referencePatternLinks.find(
    (p) => p.reference_source_id === referenceSourceId
  );
}

function sourceKind(source: ReferenceSource): ReferenceCardKind {
  if (source.source_type === "runway_look") return "runway";
  if (source.source_type === "vintage_pattern") return "vintage";
  if (source.source_type === "museum_garment") return "museum";
  return "runway"; // designer_collection, editorial, etc. treat as runway for display
}

/**
 * Build a single ReferenceCardView from a reference source and its fabric link.
 */
function buildCardView(
  source: ReferenceSource,
  confidenceScore: number,
  fabricId?: string
): ReferenceCardView {
  const observation = getPrimaryMaterialObservation(source.id);
  const patternLink = getPatternLink(source.id);
  const fabric = fabricId ? getFabricById(fabricId) : undefined;

  return {
    reference_id: source.id,
    title: source.title,
    kind: sourceKind(source),
    confidence_label: getConfidenceLabel(confidenceScore),
    primary_fabric_name: fabric?.name,
    material_label_raw: observation?.material_label_raw,
    summary: source.description ?? observation?.notes ?? "—",
    year: source.year,
    season: source.season,
    garment_type: source.garment_type,
    house_or_brand: source.house_or_brand,
    creator_name: source.creator_name,
    era_bucket: source.era_bucket,
    educational_value: source.educational_value,
    pattern_company: patternLink?.pattern_company,
    pattern_number: patternLink?.pattern_number,
    recommended_fabrics_raw: patternLink?.recommended_fabrics_raw,
    notions_raw: patternLink?.notions_raw,
    yardage_raw: patternLink?.yardage_raw,
    envelope_notes: patternLink?.envelope_notes,
  };
}

/**
 * All reference links for a fabric (runway, vintage, museum).
 */
export function getReferencesForFabric(fabricId: string): ReferenceCardView[] {
  const links = allFabricReferenceLinks.filter((l) => l.fabric_id === fabricId);
  const cards: ReferenceCardView[] = [];
  for (const link of links) {
    const source = getReferenceSourceById(link.reference_source_id);
    if (source) {
      cards.push(buildCardView(source, link.confidence_score, fabricId));
    }
  }
  return cards;
}

export function getRunwayReferencesForFabric(
  fabricId: string
): ReferenceCardView[] {
  return getReferencesForFabric(fabricId).filter((c) => c.kind === "runway");
}

export function getVintageReferencesForFabric(
  fabricId: string
): ReferenceCardView[] {
  return getReferencesForFabric(fabricId).filter((c) => c.kind === "vintage");
}

export function getMuseumReferencesForFabric(
  fabricId: string
): ReferenceCardView[] {
  return getReferencesForFabric(fabricId).filter((c) => c.kind === "museum");
}

export interface ReferencesForFabricGrouped {
  runway: ReferenceCardView[];
  vintage: ReferenceCardView[];
  museum: ReferenceCardView[];
}

export function getAllReferencesForFabricGrouped(
  fabricId: string
): ReferencesForFabricGrouped {
  const all = getReferencesForFabric(fabricId);
  return {
    runway: all.filter((c) => c.kind === "runway"),
    vintage: all.filter((c) => c.kind === "vintage"),
    museum: all.filter((c) => c.kind === "museum"),
  };
}
