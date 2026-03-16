/**
 * All fabric ↔ reference links — runway, vintage, and museum.
 */

import type { FabricReferenceLink } from "@/lib/types";
import { fabricReferenceLinks } from "./fabricReferenceLinks";
import { museumFabricReferenceLinks } from "./fabricReferenceLinks.museum";

export const allFabricReferenceLinks: FabricReferenceLink[] = [
  ...fabricReferenceLinks,
  ...museumFabricReferenceLinks,
];
