"use client";

import { skinTones } from "@/data/skinTones";
import type { SkinTone as SkinToneType } from "@/lib/types";

interface SkinToneSelectorProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function SkinToneSelector({ selectedId, onSelect }: SkinToneSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Skin tone
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Select the shade closest to your skin for the best color recommendations.
        </p>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
        {skinTones.map((tone) => (
          <SkinToneSwatch
            key={tone.id}
            tone={tone}
            selected={selectedId === tone.id}
            onSelect={() => onSelect(selectedId === tone.id ? null : tone.id)}
          />
        ))}
      </div>
      {selectedId && (
        <SelectedToneDescription tone={skinTones.find((t) => t.id === selectedId)} />
      )}
    </div>
  );
}

function SkinToneSwatch({
  tone,
  selected,
  onSelect,
}: {
  tone: SkinToneType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-center gap-1"
      title={`${tone.name} — ${tone.description}`}
      aria-pressed={selected}
    >
      <span
        className="h-8 w-8 rounded-full border-2 transition shrink-0 ring-2 ring-transparent"
        style={{
          backgroundColor: tone.baseHex,
          borderColor: selected ? "var(--foreground)" : "var(--border)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      />
      <span className="text-[10px] text-[var(--muted)] hidden sm:block truncate max-w-full">
        {tone.shadeNumber}
      </span>
    </button>
  );
}

function SelectedToneDescription({ tone }: { tone: SkinToneType | undefined }) {
  if (!tone) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
      <p className="font-medium text-[var(--foreground)]">{tone.name}</p>
      <p className="text-[var(--muted)] mt-0.5">{tone.description}</p>
      <p className="text-xs text-[var(--muted)] mt-2 capitalize">
        Undertone: {tone.undertone}
      </p>
    </div>
  );
}
