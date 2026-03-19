import type { MeasurementMap } from "@/src/lib/kbLocalStore";

export type StyleMeasurementRequirement = {
  key: string;
  label: string;
  body_zone?: string;
  unit?: string;
  required: boolean;
  description?: string;
};

export type MeasurementStatusResult = {
  completeKeys: string[];
  missingRequiredKeys: string[];
  missingOptionalKeys: string[];
  completionPercent: number;
  canGenerateFit: boolean;
};

function hasValidNumericMeasurement(value: number | string | null | undefined): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return false;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed);
  }
  return false;
}

export function getMeasurementStatus(
  requirements: StyleMeasurementRequirement[],
  profileMeasurements: MeasurementMap | undefined
): MeasurementStatusResult {
  const measurements = profileMeasurements ?? {};
  const completeKeys: string[] = [];
  const missingRequiredKeys: string[] = [];
  const missingOptionalKeys: string[] = [];

  requirements.forEach((req) => {
    const exists = hasValidNumericMeasurement(measurements[req.key]);
    if (exists) {
      completeKeys.push(req.key);
      return;
    }
    if (req.required) missingRequiredKeys.push(req.key);
    else missingOptionalKeys.push(req.key);
  });

  const totalRequired = requirements.filter((r) => r.required).length;
  const completeRequired = requirements.filter(
    (r) => r.required && completeKeys.includes(r.key)
  ).length;
  const completionPercent =
    totalRequired === 0 ? 100 : Math.round((completeRequired / totalRequired) * 100);

  return {
    completeKeys,
    missingRequiredKeys,
    missingOptionalKeys,
    completionPercent,
    canGenerateFit: missingRequiredKeys.length === 0,
  };
}

