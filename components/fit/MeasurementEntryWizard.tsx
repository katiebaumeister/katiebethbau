"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  MeasurementEntryDraft,
  MeasurementEntryMode,
  MeasurementUnits,
  Posture,
  ShoulderSlope,
  ShoulderBalance,
  BustShape,
  SeatShape,
  AbdomenShape,
  LegBalance,
} from "@/lib/fitTypes";
import { draftToProfile, deriveMeasurementProfile, classifyBodyShape } from "@/lib/fitMath";
import { addStoredProfile } from "@/lib/measurementStorage";
import type { PrimaryShape } from "@/lib/fitTypes";

const STEPS = 6;

const UNITS_OPTIONS: { value: MeasurementUnits; label: string }[] = [
  { value: "in", label: "Inches" },
  { value: "cm", label: "Centimeters" },
];

const POSTURE_OPTIONS: { value: Posture; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "erect", label: "Erect" },
  { value: "stooped", label: "Stooped" },
  { value: "swayback", label: "Swayback" },
  { value: "kyphotic", label: "Kyphotic" },
];

const SHOULDER_SLOPE_OPTIONS: { value: ShoulderSlope; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "balanced", label: "Balanced" },
  { value: "sloped", label: "Sloped" },
];

const SHOULDER_BALANCE_OPTIONS: { value: ShoulderBalance; label: string }[] = [
  { value: "narrow", label: "Narrow" },
  { value: "average", label: "Average" },
  { value: "broad", label: "Broad" },
];

const BUST_SHAPE_OPTIONS: { value: BustShape; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "average", label: "Average" },
  { value: "full", label: "Full" },
  { value: "projected", label: "Projected" },
  { value: "full_upper", label: "Full upper" },
  { value: "full_lower", label: "Full lower" },
];

const SEAT_SHAPE_OPTIONS: { value: SeatShape; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "average", label: "Average" },
  { value: "prominent", label: "Prominent" },
];

const ABDOMEN_SHAPE_OPTIONS: { value: AbdomenShape; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "average", label: "Average" },
  { value: "full_low", label: "Full low" },
  { value: "full_high", label: "Full high" },
];

const LEG_BALANCE_OPTIONS: { value: LegBalance; label: string }[] = [
  { value: "short_torso_long_leg", label: "Short torso / long leg" },
  { value: "balanced", label: "Balanced" },
  { value: "long_torso_short_leg", label: "Long torso / short leg" },
];

const PRIMARY_SHAPES: PrimaryShape[] = [
  "hourglass",
  "top_hourglass",
  "bottom_hourglass",
  "pear",
  "spoon",
  "rectangle",
  "inverted_triangle",
  "apple",
  "oval",
  "diamond",
];

const defaultDraft: MeasurementEntryDraft = {
  mode: "quick",
  units: "in",
  profile_name: "Default Measurements",
};

function Input({
  label,
  value,
  onChange,
  unit,
  type = "number",
  step = 0.25,
  min,
  max,
}: {
  label: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  unit?: string;
  type?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)]">{label}</label>
      <div className="mt-1 flex rounded-md border border-[var(--border)] bg-[var(--background)]">
        <input
          type={type}
          step={step}
          min={min}
          max={max}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value ? parseFloat(e.target.value) : undefined;
            onChange(Number.isNaN(v) ? undefined : v);
          }}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)]"
        />
        {unit && (
          <span className="flex items-center pr-3 text-sm text-[var(--muted)]">{unit}</span>
        )}
      </div>
    </div>
  );
}

function SelectOption<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)]">{label}</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function MeasurementEntryWizard() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<MeasurementEntryDraft>(defaultDraft);
  const [saved, setSaved] = useState(false);

  const update = (part: Partial<MeasurementEntryDraft>) => {
    setDraft((p) => ({ ...p, ...part }));
  };

  const handleSave = () => {
    const profileName = draft.profile_name || "My measurements";
    const id = `mp-${Date.now()}`;
    const profile = draftToProfile(draft, id, profileName);
    const derived = deriveMeasurementProfile(profile);
    const bodyShape = classifyBodyShape(profile, derived);
    if (draft.user_selected_shape) {
      bodyShape.primary_shape = draft.user_selected_shape as PrimaryShape;
      bodyShape.explanation.push("Primary shape overridden by user.");
    }
    addStoredProfile({ profile, derived, bodyShape });
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <h2 className="text-lg font-medium text-[var(--foreground)]">Profile saved</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Use it when checking fit for archival looks, patterns, or runway-inspired garments.
        </p>
        <Link
          href="/measurements"
          className="mt-6 inline-block text-sm font-medium text-[var(--foreground)] underline"
        >
          Back to my profiles
        </Link>
      </div>
    );
  }

  const unitLabel = draft.units === "in" ? "in" : "cm";

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-[var(--foreground)]">
          Step {step} of {STEPS}
        </h2>
        <div className="flex gap-1">
          {Array.from({ length: STEPS }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i + 1)}
              className={`h-2 w-2 rounded-full ${i + 1 === step ? "bg-[var(--foreground)]" : "bg-[var(--border)]"}`}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        {/* Step 1: Mode */}
        {step === 1 && (
          <>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Choose entry mode
            </h3>
            <div className="mt-4 flex gap-4">
              <button
                type="button"
                onClick={() => update({ mode: "quick" })}
                className={`flex-1 rounded-lg border p-4 text-left transition ${draft.mode === "quick" ? "border-[var(--foreground)] bg-[var(--background)]" : "border-[var(--border)]"}`}
              >
                <span className="font-medium text-[var(--foreground)]">Quick fit entry</span>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Height, bust, waist, hip, shoulder, inseam, and basic shape notes.
                </p>
              </button>
              <button
                type="button"
                onClick={() => update({ mode: "full" })}
                className={`flex-1 rounded-lg border p-4 text-left transition ${draft.mode === "full" ? "border-[var(--foreground)] bg-[var(--background)]" : "border-[var(--border)]"}`}
              >
                <span className="font-medium text-[var(--foreground)]">Full tailor measurements</span>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Full set of classic tailor/dressmaker measurements and fit notes.
                </p>
              </button>
            </div>
          </>
        )}

        {/* Step 2: Basics */}
        {step === 2 && (
          <>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Measurement basics
            </h3>
            <div className="mt-4 flex gap-2">
              {UNITS_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => update({ units: o.value })}
                  className={`rounded-md border px-3 py-1.5 text-sm ${draft.units === o.value ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]" : "border-[var(--border)]"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Height" value={draft.height_total} onChange={(v) => update({ height_total: v })} unit={unitLabel} />
              <Input label="Bust (full)" value={draft.bust_full} onChange={(v) => update({ bust_full: v })} unit={unitLabel} />
              <Input label="Waist" value={draft.waist} onChange={(v) => update({ waist: v })} unit={unitLabel} />
              <Input label="High hip" value={draft.high_hip} onChange={(v) => update({ high_hip: v })} unit={unitLabel} />
              <Input label="Full hip" value={draft.full_hip} onChange={(v) => update({ full_hip: v })} unit={unitLabel} />
              <Input label="Shoulder width" value={draft.shoulder_width} onChange={(v) => update({ shoulder_width: v })} unit={unitLabel} />
              <Input label="Inseam" value={draft.inseam} onChange={(v) => update({ inseam: v })} unit={unitLabel} />
            </div>
          </>
        )}

        {/* Step 3: Verticals (full only, or optional) */}
        {step === 3 && (
          <>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Vertical balance
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Optional. Helps the system suggest waistline and length adjustments.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Front waist length" value={draft.front_waist_length} onChange={(v) => update({ front_waist_length: v })} unit={unitLabel} />
              <Input label="Back waist length" value={draft.back_waist_length} onChange={(v) => update({ back_waist_length: v })} unit={unitLabel} />
              <Input label="Waist to floor" value={draft.waist_to_floor} onChange={(v) => update({ waist_to_floor: v })} unit={unitLabel} />
              <Input label="Crotch depth" value={draft.crotch_depth} onChange={(v) => update({ crotch_depth: v })} unit={unitLabel} />
              <Input label="Rise front" value={draft.rise_front} onChange={(v) => update({ rise_front: v })} unit={unitLabel} />
              <Input label="Rise back" value={draft.rise_back} onChange={(v) => update({ rise_back: v })} unit={unitLabel} />
            </div>
          </>
        )}

        {/* Step 4: Shape notes */}
        {step === 4 && (
          <>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Shape notes
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Optional. Improves adjustment suggestions; the system can also infer from measurements.
            </p>
            <div className="mt-6 space-y-4">
              <SelectOption label="Posture" options={POSTURE_OPTIONS} value={draft.posture} onChange={(v) => update({ posture: v as Posture })} />
              <SelectOption label="Shoulder slope" options={SHOULDER_SLOPE_OPTIONS} value={draft.shoulder_slope} onChange={(v) => update({ shoulder_slope: v as ShoulderSlope })} />
              <SelectOption label="Shoulder balance" options={SHOULDER_BALANCE_OPTIONS} value={draft.shoulder_balance} onChange={(v) => update({ shoulder_balance: v as ShoulderBalance })} />
              <SelectOption label="Bust shape" options={BUST_SHAPE_OPTIONS} value={draft.bust_shape} onChange={(v) => update({ bust_shape: v as BustShape })} />
              <SelectOption label="Seat shape" options={SEAT_SHAPE_OPTIONS} value={draft.seat_shape} onChange={(v) => update({ seat_shape: v as SeatShape })} />
              <SelectOption label="Abdomen shape" options={ABDOMEN_SHAPE_OPTIONS} value={draft.abdomen_shape} onChange={(v) => update({ abdomen_shape: v as AbdomenShape })} />
              <SelectOption label="Leg balance" options={LEG_BALANCE_OPTIONS} value={draft.leg_balance} onChange={(v) => update({ leg_balance: v as LegBalance })} />
            </div>
          </>
        )}

        {/* Step 5: Confirm derived shape */}
        {step === 5 && (() => {
          const id = "preview";
          const profile = draftToProfile({ ...draft, profile_name: draft.profile_name || "Preview" }, id, "Preview");
          const derived = deriveMeasurementProfile(profile);
          const bodyShape = classifyBodyShape(profile, derived);
          return (
            <>
              <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Body type preview
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Based on your measurements, the system suggests the following. You can confirm or override.
              </p>
              <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-sm">
                  <span className="text-[var(--muted)]">Primary shape: </span>
                  <span className="font-medium capitalize text-[var(--foreground)]">
                    {bodyShape.primary_shape?.replace(/_/g, " ") ?? "—"}
                  </span>
                </p>
                {bodyShape.secondary_shape && (
                  <p className="mt-1 text-sm">
                    <span className="text-[var(--muted)]">Secondary: </span>
                    <span className="capitalize text-[var(--foreground)]">
                      {bodyShape.secondary_shape.replace(/_/g, " ")}
                    </span>
                  </p>
                )}
                {bodyShape.explanation.length > 0 && (
                  <ul className="mt-3 list-inside list-disc text-xs text-[var(--muted)]">
                    {bodyShape.explanation.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-[var(--muted)]">
                    Override primary shape (optional)
                  </label>
                  <select
                    value={draft.user_selected_shape ?? ""}
                    onChange={(e) => update({ user_selected_shape: e.target.value || undefined })}
                    className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
                  >
                    <option value="">Use system suggestion</option>
                    {PRIMARY_SHAPES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          );
        })()}

        {/* Step 6: Save */}
        {step === 6 && (
          <>
            <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Save profile
            </h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Profile name
              </label>
              <input
                type="text"
                value={draft.profile_name ?? ""}
                onChange={(e) => update({ profile_name: e.target.value || "Default Measurements" })}
                placeholder="e.g. 1950s tailoring profile"
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Your measurements and derived shape will be stored in this browser. Use this profile when
              checking fit for historical patterns, archival looks, or runway-inspired garments.
            </p>
            <button
              type="button"
              onClick={handleSave}
              className="mt-6 w-full rounded-md bg-[var(--foreground)] py-3 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
            >
              Save profile
            </button>
          </>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="text-sm text-[var(--muted)] disabled:opacity-50 hover:text-[var(--foreground)]"
          >
            Back
          </button>
          {step < STEPS ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)]"
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
