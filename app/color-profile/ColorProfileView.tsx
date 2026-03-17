"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import {
  getResolvedRecommendations,
  getHairShadeByCode,
  getEyeShadeByCode,
} from "@/lib/colorProfileHelpers";
import { getHexForColorFamily } from "@/lib/colorFamilies";
import { skinTones } from "@/data/skinTones";
import { hairShades } from "@/data/hairShades";
import { eyeShades } from "@/data/eyeShades";

function ColorProfilePicker() {
  const router = useRouter();
  const [skinId, setSkinId] = useState<string | null>(null);
  const [hairCode, setHairCode] = useState<string | null>(null);
  const [eyeCode, setEyeCode] = useState<string | null>(null);

  const handleShow = () => {
    const shadeNumber = skinId ? skinTones.find((s) => s.id === skinId)?.shadeNumber : undefined;
    if (shadeNumber != null && hairCode && eyeCode) {
      const params = new URLSearchParams({
        skin: String(shadeNumber),
        hair: hairCode,
        eye: eyeCode,
      });
      router.push(`/color-profile?${params.toString()}`);
    }
  };

  const canShow = skinId && hairCode && eyeCode;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
      <p className="text-sm text-[var(--muted)] mb-6">
        Select skin, hair, and eye colors to see your combined color profile.
      </p>
      <div className="space-y-8">
        {/* Skin tone — same circle grid as Finder */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Skin tone
          </label>
          <p className="text-sm text-[var(--muted)] mb-3">
            Select the shade closest to your skin.
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => setSkinId(skinId === tone.id ? null : tone.id)}
                className="group flex flex-col items-center gap-0.5 min-w-0"
                title={tone.name}
                aria-pressed={skinId === tone.id}
              >
                <span
                  className="h-8 w-8 rounded-full border-2 transition shrink-0 ring-2 ring-transparent"
                  style={{
                    backgroundColor: tone.baseHex,
                    borderColor: skinId === tone.id ? "var(--foreground)" : "var(--border)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                />
                <span className="text-[10px] text-[var(--muted)] hidden sm:block text-center">
                  {tone.shadeNumber}
                </span>
                <span className="text-[9px] text-[var(--muted)] hidden sm:block max-w-full min-w-0 text-center break-words leading-tight" title={tone.name}>
                  {tone.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Hair color — color circles */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Hair color
          </label>
          <p className="text-sm text-[var(--muted)] mb-3">
            Select the shade closest to your hair.
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {hairShades.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHairCode(hairCode === h.code ? null : h.code)}
                className="group flex flex-col items-center gap-1"
                title={h.name}
                aria-pressed={hairCode === h.code}
              >
                <span
                  className="h-8 w-8 rounded-full border-2 transition shrink-0 ring-2 ring-transparent"
                  style={{
                    backgroundColor: h.default_hex,
                    borderColor: hairCode === h.code ? "var(--foreground)" : "var(--border)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                />
                <span className="text-[10px] text-[var(--muted)] hidden sm:block truncate max-w-full text-center">
                  {h.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Eye color — color circles */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Eye color
          </label>
          <p className="text-sm text-[var(--muted)] mb-3">
            Select the shade closest to your eyes.
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {eyeShades.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEyeCode(eyeCode === e.code ? null : e.code)}
                className="group flex flex-col items-center gap-1"
                title={e.name}
                aria-pressed={eyeCode === e.code}
              >
                <span
                  className="h-8 w-8 rounded-full border-2 transition shrink-0 ring-2 ring-transparent"
                  style={{
                    backgroundColor: e.default_hex,
                    borderColor: eyeCode === e.code ? "var(--foreground)" : "var(--border)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                />
                <span className="text-[10px] text-[var(--muted)] hidden sm:block truncate max-w-full text-center">
                  {e.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleShow}
          disabled={!canShow}
          className="rounded-full bg-[var(--foreground)] px-6 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Show my color profile
        </button>
      </div>
      <p className="mt-6 text-xs text-[var(--muted)]">
        Or start from <Link href="/finder" className="underline">Find fabric</Link> and pick skin, hair, and eye there.
      </p>
    </div>
  );
}

function ColorProfileViewInner() {
  const searchParams = useSearchParams();
  const skinParam = searchParams.get("skin");
  const hairParam = searchParams.get("hair");
  const eyeParam = searchParams.get("eye");

  const skinShadeNumber = skinParam ? parseInt(skinParam, 10) : undefined;
  const hairCode = hairParam ?? undefined;
  const eyeCode = eyeParam ?? undefined;

  const resolved = useMemo(() => {
    if (
      skinShadeNumber == null ||
      !Number.isFinite(skinShadeNumber) ||
      !hairCode ||
      !eyeCode
    ) {
      return null;
    }
    return getResolvedRecommendations(skinShadeNumber, hairCode, eyeCode);
  }, [skinShadeNumber, hairCode, eyeCode]);

  if (!resolved) {
    return (
      <ColorProfilePicker />
    );
  }

  const skinName = resolved.skin.name;
  const hairName = getHairShadeByCode(resolved.hairCode)?.name ?? resolved.hairCode;
  const eyeName = getEyeShadeByCode(resolved.eyeCode)?.name ?? resolved.eyeCode;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
          Your combination
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="h-10 w-10 rounded-full border-2 border-[var(--border)]"
              style={{ backgroundColor: resolved.skin.base_hex }}
            />
            <span className="text-sm font-medium text-[var(--foreground)]">{skinName}</span>
          </div>
          <span className="text-[var(--muted)]">+</span>
          <div className="flex items-center gap-2">
            <span
              className="h-8 w-8 rounded-full border border-[var(--border)]"
              style={{
                backgroundColor: getHairShadeByCode(resolved.hairCode)?.default_hex ?? "#9ca3af",
              }}
            />
            <span className="text-sm text-[var(--foreground)]">{hairName}</span>
          </div>
          <span className="text-[var(--muted)]">+</span>
          <div className="flex items-center gap-2">
            <span
              className="h-8 w-8 rounded-full border border-[var(--border)]"
              style={{
                backgroundColor: getEyeShadeByCode(resolved.eyeCode)?.default_hex ?? "#9ca3af",
              }}
            />
            <span className="text-sm text-[var(--foreground)]">{eyeName}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]">
            {resolved.temperature_summary.replace(/-/g, " ")}
          </span>
          <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]">
            {resolved.overall_contrast} contrast
          </span>
          {resolved.combined && (
            <span className="rounded-full bg-[var(--background)] px-3 py-1 text-xs text-[var(--muted)]">
              {resolved.combined.code}
            </span>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
          Top neutrals
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Neutrals that tend to work well with your coloring.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {resolved.top_neutrals.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--border)] p-3 min-w-[100px]"
            >
              <span
                className="h-12 w-12 rounded-full border border-[var(--border)]"
                style={{ backgroundColor: getHexForColorFamily(name) }}
              />
              <span className="text-xs text-center text-[var(--foreground)]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {resolved.accent_colors.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Accent colors
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Colors that can add interest without overwhelming.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {resolved.accent_colors.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--border)] p-3 min-w-[100px]"
              >
                <span
                  className="h-12 w-12 rounded-full border border-[var(--border)]"
                  style={{ backgroundColor: getHexForColorFamily(name) }}
                />
                <span className="text-xs text-center text-[var(--foreground)]">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
          Best metals
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Jewelry and hardware that tend to harmonize.
        </p>
        <ul className="mt-3 list-inside list-disc text-sm text-[var(--foreground)]">
          {resolved.best_metals.map((m) => (
            <li key={m}>{m.replace(/_/g, " ")}</li>
          ))}
        </ul>
      </section>

      {resolved.avoid_colors.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Colors to use with care
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            These can clash or wash out; use in small doses or avoid near the face.
          </p>
          <p className="mt-3 text-sm text-[var(--foreground)]">
            {resolved.avoid_colors.join(" · ")}
          </p>
        </section>
      )}

      {resolved.combined?.notes && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Notes
          </h2>
          <p className="mt-3 text-sm text-[var(--foreground)]">
            {resolved.combined.notes}
          </p>
        </section>
      )}

      {resolved.overrides.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Profile overrides
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Custom recommendations that apply to this combination.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
            {resolved.overrides.map((o) => (
              <li key={o.id} className="rounded-lg border border-[var(--border)] p-3">
                <span className="font-medium">{o.effect}</span> · {o.target_type}: {o.target_value}
                {o.reason && <span className="block mt-1 text-[var(--muted)]">{o.reason}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function ColorProfileView() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <ColorProfileViewInner />
    </Suspense>
  );
}
