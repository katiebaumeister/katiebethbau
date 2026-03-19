"use client";

import { useMemo, useState } from "react";
import type { KBProfile, MeasurementMap } from "@/src/lib/kbLocalStore";
import type { StyleMeasurementRequirement } from "@/src/lib/measurementStatus";

type WizardStep = 1 | 2 | 3;

type MeasurementWizardProps = {
  profile: KBProfile;
  requirements: StyleMeasurementRequirement[];
  missingRequiredKeys: string[];
  missingOptionalKeys: string[];
  onSave: (updates: MeasurementMap) => void;
  onClose: () => void;
};

const zoneOrder = [
  "upper_body",
  "mid_body",
  "lower_body",
  "overall",
  "other",
] as const;

const zoneLabels: Record<string, string> = {
  upper_body: "Upper body",
  mid_body: "Waist and torso",
  lower_body: "Hip, seat, legs and rise",
  overall: "Lengths and overall",
  other: "Other",
};

function inferZone(key: string): string {
  if (/(bust|shoulder|arm|sleeve|neck|underbust|band)/i.test(key)) return "upper_body";
  if (/(waist|torso|back_waist)/i.test(key)) return "mid_body";
  if (/(hip|rise|inseam|outseam|thigh|knee|ankle|calf|seat|leg)/i.test(key)) return "lower_body";
  if (/(length|height|target)/i.test(key)) return "overall";
  return "other";
}

function helperForKey(key: string): string | null {
  if (/(rise)/i.test(key)) return "Important for lower-body balance and comfort.";
  if (/(waist_to_hip|hip)/i.test(key)) return "Helps place shaping and silhouette control correctly.";
  if (/(bust)/i.test(key)) return "Affects upper-body shaping and dart/cup distribution.";
  if (/(shoulder|armhole|bicep)/i.test(key)) return "Supports mobility and shoulder/sleeve fit.";
  if (/(length|inseam|outseam)/i.test(key)) return "Controls finished proportions and hem placement.";
  return null;
}

export default function MeasurementWizard({
  profile,
  requirements,
  missingRequiredKeys,
  missingOptionalKeys,
  onSave,
  onClose,
}: MeasurementWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [draft, setDraft] = useState<MeasurementMap>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const requiredItems = useMemo(
    () => requirements.filter((r) => missingRequiredKeys.includes(r.key)),
    [requirements, missingRequiredKeys]
  );
  const optionalItems = useMemo(
    () => requirements.filter((r) => missingOptionalKeys.includes(r.key)),
    [requirements, missingOptionalKeys]
  );

  const currentItems = step === 1 ? requiredItems : step === 2 ? optionalItems : [];

  const grouped = useMemo(() => {
    const groups = new Map<string, StyleMeasurementRequirement[]>();
    currentItems.forEach((item) => {
      const zone = item.body_zone || inferZone(item.key);
      const existing = groups.get(zone) ?? [];
      existing.push(item);
      groups.set(zone, existing);
    });
    return zoneOrder
      .map((zone) => ({ zone, items: groups.get(zone) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [currentItems]);

  const requiredMissingStill = useMemo(
    () =>
      requiredItems.filter((item) => {
        const value = draft[item.key];
        if (typeof value === "number") return !Number.isFinite(value);
        if (typeof value === "string") return value.trim().length === 0 || !Number.isFinite(Number(value));
        return true;
      }),
    [requiredItems, draft]
  );

  const canGoNextRequired = requiredMissingStill.length === 0;

  function updateDraft(key: string, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function normalizeToNumericMap(input: MeasurementMap): MeasurementMap {
    const result: MeasurementMap = {};
    Object.entries(input).forEach(([key, value]) => {
      if (typeof value === "number" && Number.isFinite(value)) {
        result[key] = value;
        return;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return;
        const parsed = Number(trimmed);
        if (Number.isFinite(parsed)) result[key] = parsed;
      }
    });
    return result;
  }

  function handleSave() {
    const updates = normalizeToNumericMap(draft);
    onSave(updates);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-medium text-[var(--foreground)]">Add measurements for this style</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Profile: {profile.name} · Step {step} of 3
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            Close
          </button>
        </div>

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--foreground)]">
                Ready to save your measurement updates. Required fields are complete.
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                You can reopen this wizard anytime to refine optional measurements.
              </p>
            </div>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted)]">
            No measurements needed in this step.
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group) => (
              <section key={group.zone} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <h4 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
                  {zoneLabels[group.zone] ?? "Measurements"}
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {group.items.map((item) => {
                    const value = draft[item.key];
                    const helper = helperForKey(item.key);
                    const showError =
                      step === 1 &&
                      item.required &&
                      touched[item.key] &&
                      (typeof value !== "string" || value.trim() === "" || !Number.isFinite(Number(value)));
                    return (
                      <label key={item.key} className="block rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">{item.label}</span>
                        <span className="ml-2 text-xs text-[var(--muted)]">{item.unit ?? profile.unit}</span>
                        <input
                          inputMode="decimal"
                          type="number"
                          step="any"
                          min="0"
                          value={typeof value === "string" ? value : ""}
                          onChange={(e) => updateDraft(item.key, e.target.value)}
                          className="mt-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
                        />
                        <p className="mt-1 text-xs text-[var(--muted)]">{item.description}</p>
                        {helper ? <p className="mt-1 text-[11px] text-[var(--muted)]">{helper}</p> : null}
                        {showError ? (
                          <p className="mt-1 text-[11px] text-rose-600">Please enter a valid number.</p>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev))}
            disabled={step === 1}
            className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => ((prev + 1) as WizardStep))}
              disabled={step === 1 && !canGoNextRequired}
              className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
            >
              Save measurements
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

