/**
 * All material observations — runway, vintage, and museum.
 */

import type { ReferenceMaterialObservation } from "@/lib/types";
import { referenceMaterialObservations } from "./referenceMaterialObservations";
import { museumReferenceMaterialObservations } from "./referenceMaterialObservations.museum";

export const allReferenceMaterialObservations: ReferenceMaterialObservation[] = [
  ...referenceMaterialObservations,
  ...museumReferenceMaterialObservations,
];
