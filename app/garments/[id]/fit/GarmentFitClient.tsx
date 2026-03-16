"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadStoredProfiles, getStoredProfileById } from "@/lib/measurementStorage";
import { assessGarmentFit } from "@/lib/fitAssessment";
import type { GarmentExample } from "@/lib/fitTypes";

interface GarmentFitClientProps {
  garment: GarmentExample;
}

export default function GarmentFitClient({ garment }: GarmentFitClientProps) {
  const [profiles, setProfiles] = useState(loadStoredProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfiles(loadStoredProfiles());
  }, []);

  const selected = selectedProfileId ? getStoredProfileById(selectedProfileId) : null;
  const result =
    selected && mounted
      ? assessGarmentFit(
          selected.profile.id,
          selected.profile,
          selected.derived,
          garment
        )
      : null;

  if (!mounted) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] border-dashed bg-[var(--surface)] p-8 text-center">
        <p className="text-[var(--muted)]">No measurement profiles saved.</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Enter your measurements first, then return here to see fit recommendations.
        </p>
        <Link
          href="/measurements/new"
          className="mt-4 inline-block text-sm font-medium text-[var(--foreground)] underline"
        >
          Create a measurement profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
          Choose measurement profile
        </h2>
        <select
          value={selectedProfileId ?? ""}
          onChange={(e) => setSelectedProfileId(e.target.value || null)}
          className="mt-3 w-full max-w-md rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
        >
          <option value="">Select a profile…</option>
          {profiles.map(({ profile, bodyShape }) => (
            <option key={profile.id} value={profile.id}>
              {profile.profile_name} · {bodyShape.primary_shape?.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </section>

      {result && (
        <>
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
              Fit assessment
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  result.assessment.fit_risk_level === "low"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : result.assessment.fit_risk_level === "moderate"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {result.assessment.fit_risk_level.replace(/_/g, " ")} fit risk
              </span>
            </div>
            {result.assessment.summary && (
              <p className="mt-3 text-sm text-[var(--foreground)]">
                {result.assessment.summary}
              </p>
            )}
            {(result.assessment.ratio_flags.length > 0 ||
              result.assessment.balance_flags.length > 0 ||
              result.assessment.silhouette_flags.length > 0) && (
              <div className="mt-3 text-xs text-[var(--muted)]">
                {result.assessment.ratio_flags.map((f) => (
                  <span key={f} className="mr-2 rounded bg-[var(--background)] px-1.5 py-0.5">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
                {result.assessment.balance_flags.map((f) => (
                  <span key={f} className="mr-2 rounded bg-[var(--background)] px-1.5 py-0.5">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
                {result.assessment.silhouette_flags.map((f) => (
                  <span key={f} className="mr-2 rounded bg-[var(--background)] px-1.5 py-0.5">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </section>

          {result.recommendations.length > 0 && (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Adjustment suggestions
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Technical, neutral, and constructive: these compare the garment&apos;s assumptions to your
                measurements and suggest how to achieve the intended balance.
              </p>
              <ul className="mt-4 space-y-4">
                {result.recommendations.map((rec) => (
                  <li
                    key={rec.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-[var(--foreground)]">{rec.title}</span>
                      {rec.requires_muslin && (
                        <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Muslin recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">{rec.rationale}</p>
                    <p className="mt-2 text-sm text-[var(--foreground)]">{rec.recommendation_text}</p>
                    {rec.severity && (
                      <p className="mt-1 text-xs capitalize text-[var(--muted)]">
                        {rec.recommendation_type.replace(/_/g, " ")} · {rec.body_region} · {rec.severity}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {result.recommendations.length === 0 && result.assessment.fit_risk_level === "low" && (
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm text-[var(--muted)]">
                Your measurements are close to this garment&apos;s assumptions. Minor adjustments may
                still improve fit; consider a muslin for critical areas if you&apos;re new to this pattern.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
