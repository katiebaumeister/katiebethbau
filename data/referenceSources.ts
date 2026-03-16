/**
 * Reference sources — merged from runway, vintage, and museum seed data.
 */

import type { ReferenceSource } from "@/lib/types";
import { runwayReferenceSources } from "./referenceSources.runway";
import { vintageReferenceSources } from "./referenceSources.vintage";
import { museumReferenceSources } from "./referenceSources.museum";

export const referenceSources: ReferenceSource[] = [
  ...runwayReferenceSources,
  ...vintageReferenceSources,
  ...museumReferenceSources,
];

export { runwayReferenceSources, vintageReferenceSources, museumReferenceSources };
