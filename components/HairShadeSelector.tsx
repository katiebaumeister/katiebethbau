"use client";

import { hairShades } from "@/data/hairShades";
import type { HairShade } from "@/lib/types";

const FAMILY_LABELS: Record<string, string> = {
  blonde: "Blonde",
  brown: "Brown",
  black: "Black",
  red: "Red",
  auburn: "Auburn",
  gray: "Gray",
  white: "White",
};

interface HairShadeSelectorProps {
  selectedCode: string | null;
  onSelect: (code: string | null) => void;
}

export default function HairShadeSelector({ selectedCode, onSelect }: HairShadeSelectorProps) {
  const byFamily = hairShades.reduce<Record<string, HairShade[]>>((acc, h) => {
    (acc[h.family] = acc[h.family] ?? []).push(h);
    return acc;
  }, {});

  const families = Object.keys(byFamily).sort();

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Hair color
        </label>
        <p className="text-sm text-[var(--muted)] mb-2">
          Optional. With skin and eye, we&apos;ll show your combined color profile.
        </p>
      </div>
      <select
        value={selectedCode ?? ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)]"
      >
        <option value="">Select hair color…</option>
        {families.map((family) => (
          <optgroup key={family} label={FAMILY_LABELS[family] ?? family}>
            {byFamily[family].map((h) => (
              <option key={h.id} value={h.code}>
                {h.name}
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
                hairShades.find((h) => h.code === selectedCode)?.default_hex ?? "#9ca3af",
            }}
          />
          <span className="text-[var(--muted)]">
            {hairShades.find((h) => h.code === selectedCode)?.name}
          </span>
        </div>
      )}
    </div>
  );
}
