"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getFitResults,
  getRecentStyles,
  getSavedStyles,
} from "@/src/lib/kbLocalStore";
import { useKBProfiles } from "@/src/hooks/useKBProfiles";
import { getMeasurementStatus, type StyleMeasurementRequirement } from "@/src/lib/measurementStatus";

interface StyleCard {
  id: number;
  slug: string;
  style_name: string;
  category_name: string;
  fit_intent: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
}

interface ApiMeasurement {
  code: string;
  label: string;
  body_zone?: string;
  unit?: string;
  required_boolean: boolean;
  description?: string;
}

type ReadinessMap = Record<string, { canGenerate: boolean; missingRequired: number }>;

function toRequirements(rows: ApiMeasurement[]): StyleMeasurementRequirement[] {
  return rows.map((m) => ({
    key: m.code,
    label: m.label,
    body_zone: m.body_zone,
    unit: m.unit,
    required: Boolean(m.required_boolean),
    description: m.description,
  }));
}

export default function ClosetClient() {
  const { activeProfile } = useKBProfiles();
  const [styles, setStyles] = useState<StyleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState<ReadinessMap>({});

  const saved = useMemo(() => getSavedStyles(), []);
  const recent = useMemo(() => getRecentStyles(), []);
  const fitResults = useMemo(() => getFitResults(), []);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const styleRes = await fetch("/api/styles", { cache: "no-store" });
        if (!styleRes.ok) throw new Error();
        const styleJson = (await styleRes.json()) as { styles: StyleCard[] };
        if (!active) return;
        setStyles(styleJson.styles ?? []);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const styleBySlug = useMemo(() => {
    const map = new Map<string, StyleCard>();
    styles.forEach((s) => map.set(s.slug, s));
    return map;
  }, [styles]);

  const focusSlugs = useMemo(() => {
    const set = new Set<string>();
    saved.forEach((s) => set.add(s.slug));
    recent.forEach((s) => set.add(s.slug));
    fitResults.forEach((s) => set.add(s.styleSlug));
    return Array.from(set);
  }, [saved, recent, fitResults]);

  useEffect(() => {
    let active = true;
    async function computeReadiness() {
      if (!activeProfile || focusSlugs.length === 0) return;
      const entries = await Promise.all(
        focusSlugs.map(async (slug) => {
          try {
            const res = await fetch(`/api/styles/${slug}/measurements`, { cache: "no-store" });
            if (!res.ok) return [slug, { canGenerate: false, missingRequired: 0 }] as const;
            const json = (await res.json()) as { measurements: ApiMeasurement[] };
            const requirements = toRequirements(json.measurements ?? []);
            const status = getMeasurementStatus(requirements, activeProfile.measurements);
            return [slug, { canGenerate: status.canGenerateFit, missingRequired: status.missingRequiredKeys.length }] as const;
          } catch {
            return [slug, { canGenerate: false, missingRequired: 0 }] as const;
          }
        })
      );
      if (!active) return;
      setReadiness(Object.fromEntries(entries));
    }
    computeReadiness();
    return () => {
      active = false;
    };
  }, [activeProfile, focusSlugs]);

  function renderBadges(slug: string) {
    const tags: string[] = [];
    if (saved.some((x) => x.slug === slug)) tags.push("Saved");
    if (recent.some((x) => x.slug === slug)) tags.push("Viewed recently");
    if (fitResults.some((x) => x.styleSlug === slug)) tags.push("Fit generated");
    const r = readiness[slug];
    if (r) {
      if (r.canGenerate) tags.push("Ready to generate");
      else if (r.missingRequired > 0) tags.push(`Missing ${r.missingRequired} measurements`);
    }
    if (!tags.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] text-[var(--foreground)]">
            {tag}
          </span>
        ))}
      </div>
    );
  }

  const continueStyle = useMemo(() => {
    const candidate = recent[0]?.slug ?? fitResults[0]?.styleSlug ?? saved[0]?.slug;
    return candidate ? styleBySlug.get(candidate) ?? null : null;
  }, [recent, fitResults, saved, styleBySlug]);

  const savedStyles = saved.map((s) => styleBySlug.get(s.slug)).filter((x): x is StyleCard => Boolean(x));
  const recentStyles = recent.map((s) => styleBySlug.get(s.slug)).filter((x): x is StyleCard => Boolean(x));
  const generatedStyles = fitResults
    .map((f) => styleBySlug.get(f.styleSlug))
    .filter((x): x is StyleCard => Boolean(x));

  const sections = [
    { title: "Saved styles", styles: savedStyles },
    { title: "Recently viewed", styles: recentStyles },
    { title: "Fit guidance generated", styles: generatedStyles },
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">Your Closet</h1>
            <p className="mt-2 text-[var(--muted)]">
              Continue where you left off with saved, recent, and fit-ready styles.
            </p>
          </div>
          <Link
            href="/garments"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
          >
            Back to KB&apos;s Fashions
          </Link>
        </div>

        {continueStyle ? (
          <section className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Continue where you left off</p>
            <Link href={`/garments/style/${continueStyle.slug}`} className="mt-2 block text-lg text-[var(--foreground)] hover:underline">
              {continueStyle.style_name}
            </Link>
            {renderBadges(continueStyle.slug)}
          </section>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            Loading your closet...
          </div>
        ) : (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                  {section.title}
                </h2>
                {section.styles.length === 0 ? (
                  <div className="mt-3 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-sm text-[var(--muted)]">
                    Nothing here yet.
                  </div>
                ) : (
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {section.styles.map((style) => (
                      <li key={`${section.title}-${style.slug}`}>
                        <Link
                          href={`/garments/style/${style.slug}`}
                          className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--foreground)]"
                        >
                          <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{style.category_name}</p>
                          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">{style.style_name}</p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {style.fit_intent.replace(/_/g, " ")} · {style.difficulty_level}
                          </p>
                          {renderBadges(style.slug)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

