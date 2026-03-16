"use client";

import { useState } from "react";
import type {
  ClimateOption,
  DurabilityOption,
  ComfortOption,
  FinderFilters,
} from "@/lib/types";
import { getSkinToneById } from "@/data/skinTones";
import SkinToneSelector from "./SkinToneSelector";
import HairShadeSelector from "./HairShadeSelector";
import EyeShadeSelector from "./EyeShadeSelector";
import ColorProfileSummary from "./ColorProfileSummary";

const CLIMATE_OPTIONS: { value: ClimateOption; label: string }[] = [
  { value: "cold", label: "Cold" },
  { value: "temperate", label: "Temperate" },
  { value: "hot", label: "Hot" },
  { value: "humid", label: "Humid" },
  { value: "dry", label: "Dry" },
];

const DURABILITY_OPTIONS: { value: DurabilityOption; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const COMFORT_OPTIONS: { value: ComfortOption; label: string }[] = [
  { value: "soft-drapey", label: "Soft / Drapey" },
  { value: "breathable", label: "Breathable" },
  { value: "structured", label: "Structured" },
  { value: "low-maintenance", label: "Low maintenance" },
];

interface FilterPanelProps {
  initialFilters?: Partial<FinderFilters>;
  onSubmit: (filters: FinderFilters) => void;
}

export default function FilterPanel({ initialFilters = {}, onSubmit }: FilterPanelProps) {
  const [climate, setClimate] = useState<ClimateOption | null>(
    initialFilters.climate ?? null
  );
  const [skinToneId, setSkinToneId] = useState<string | null>(
    initialFilters.skinToneId ?? null
  );
  const [hairCode, setHairCode] = useState<string | null>(
    initialFilters.hairCode ?? null
  );
  const [eyeCode, setEyeCode] = useState<string | null>(
    initialFilters.eyeCode ?? null
  );
  const [durability, setDurability] = useState<DurabilityOption | null>(
    initialFilters.durability ?? null
  );
  const [comfort, setComfort] = useState<ComfortOption | null>(
    initialFilters.comfort ?? null
  );

  const skinShadeNumber = skinToneId ? getSkinToneById(skinToneId)?.shadeNumber : undefined;
  const showColorProfile =
    skinShadeNumber != null && hairCode && eyeCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      climate,
      skinToneId,
      hairCode: hairCode ?? null,
      eyeCode: eyeCode ?? null,
      durability,
      comfort,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <SkinToneSelector selectedId={skinToneId} onSelect={setSkinToneId} />

      <HairShadeSelector selectedCode={hairCode} onSelect={setHairCode} />
      <EyeShadeSelector selectedCode={eyeCode} onSelect={setEyeCode} />

      {showColorProfile && (
        <ColorProfileSummary
          skinShadeNumber={skinShadeNumber}
          hairCode={hairCode}
          eyeCode={eyeCode}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Climate
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Where you&apos;ll wear the garment most.
        </p>
        <div className="flex flex-wrap gap-2">
          {CLIMATE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={climate === opt.value}
              onSelect={() => setClimate(climate === opt.value ? null : opt.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Durability
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          How much wear and care you expect.
        </p>
        <div className="flex flex-wrap gap-2">
          {DURABILITY_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={durability === opt.value}
              onSelect={() =>
                setDurability(durability === opt.value ? null : opt.value)
              }
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Comfort & feel
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Preferred hand and behavior of the fabric.
        </p>
        <div className="flex flex-wrap gap-2">
          {COMFORT_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              selected={comfort === opt.value}
              onSelect={() => setComfort(comfort === opt.value ? null : opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto rounded-full bg-[var(--foreground)] px-8 py-3.5 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
        >
          Get recommendations
        </button>
      </div>
    </form>
  );
}

function Chip({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        selected
          ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--muted)]"
      }`}
    >
      {label}
    </button>
  );
}
