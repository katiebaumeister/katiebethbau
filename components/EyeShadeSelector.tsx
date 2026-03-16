"use client";

import { eyeShades } from "@/data/eyeShades";
import type { EyeShade } from "@/lib/types";

const FAMILY_LABELS: Record<string, string> = {
  blue: "Blue",
  green: "Green",
  hazel: "Hazel",
  amber: "Amber",
  brown: "Brown",
  gray: "Gray",
  mixed: "Mixed",
};

interface EyeShadeSelectorProps {
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}

export default function EyeShadeSelector({ selectedCode, onSelect }: EyeShadeSelectorProps) {
  const byFamily = eyeShades.reduce<Record<string, EyeShade[]>>((acc, e) => {
    (acc[e.family] = acc[e.family] ?? []).push(e);
    return acc;
  }, {});

  const families = Object.keys(byFamily).sort();

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Eye color
        </label>
        <p className="text-sm text-[var(--muted)] mb-2">
          Optional. Combines with skin and hair for your full color profile.
        </p>
      </div>
      <select
        value={selectedCode ?? ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
      >
        <option value="">Select eye color…</option>
        {families.map((family) => (
          <optgroup key={family} label={FAMILY_LABELS[family] ?? family}>
            {byFamily[family].map((e) => (
              <option key={e.id} value={e.code}>
                {e.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedCode && (
        <div className="flex items-center gap-2 text-sm">
          <span
            className="h-5 w-5 rounded-full border border-[var(--border)] shrink-0"
            style={{
              backgroundColor:
                eyeShades.find((e) => e.code === selectedCode)?.default_hex ?? "#9ca3af",
            }}
          />
          <span className="text-[var(--muted)]">
            {eyeShades.find((e) => e.code === selectedCode)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
