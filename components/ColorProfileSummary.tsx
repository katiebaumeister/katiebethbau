"use client";

import Link from "next/link";
import { getResolvedRecommendations } from "@/lib/colorProfileHelpers";
import { getHexForColorFamily } from "@/lib/colorFamilies";

interface ColorProfileSummaryProps {
  skinShadeNumber: number;
  hairCode: string;
  eyeCode: string;
}

export default function ColorProfileSummary({
  skinShadeNumber,
  hairCode,
  eyeCode,
}: ColorProfileSummaryProps) {
  const resolved = getResolvedRecommendations(skinShadeNumber, hairCode, eyeCode);
  if (!resolved) return null;

  const profileUrl = `/color-profile?skin=${skinShadeNumber}&hair=${encodeURIComponent(hairCode)}&eye=${encodeURIComponent(eyeCode)}`;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
        Your color profile
      </p>
      <p className="text-sm text-[var(--foreground)]">
        {resolved.temperature_summary.replace(/-/g, " ")} · {resolved.overall_contrast} contrast
      </p>
      {resolved.top_neutrals.length > 0 && (
        <div>
          <p className="text-xs text-[var(--muted)] mb-1.5">Top neutrals</p>
          <div className="flex flex-wrap gap-1.5">
            {resolved.top_neutrals.slice(0, 5).map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] pl-1 pr-2 py-0.5"
                title={name}
              >
                <span
                  className="h-4 w-4 rounded-full shrink-0"
                  style={{ backgroundColor: getHexForColorFamily(name) }}
                />
                <span className="text-xs text-[var(--foreground)] truncate max-w-[80px]">
                  {name}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
      {resolved.best_metals.length > 0 && (
        <p className="text-xs text-[var(--muted)]">
          Best metals: {resolved.best_metals.map((m) => m.replace(/_/g, " ")).join(", ")}
        </p>
      )}
      <Link
        href={profileUrl}
        className="inline-block text-xs font-medium text-[var(--foreground)] underline hover:no-underline"
      >
        View full color profile →
      </Link>
    </div>
  );
}
