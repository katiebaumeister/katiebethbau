/**
 * All reference attributes — runway, vintage, and museum.
 */

import type { ReferenceAttributes } from "@/lib/types";
import { referenceAttributes } from "./referenceAttributes";
import { museumReferenceAttributes } from "./referenceAttributes.museum";

export const allReferenceAttributes: ReferenceAttributes[] = [
  ...referenceAttributes,
  ...museumReferenceAttributes,
];
