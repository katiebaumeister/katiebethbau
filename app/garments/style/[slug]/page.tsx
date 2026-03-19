"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface StyleDetail {
  id: number;
  slug: string;
  style_name: string;
  short_description: string;
  silhouette_tags: string[];
  fabric_type_default: string;
  fit_intent: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  closure_type: string | null;
  category_code: string;
  category_name: string;
}

interface StyleMeasurement {
  code: string;
  label: string;
  body_zone: string;
  unit: string;
  description: string;
  required_boolean: boolean;
  priority_order: number;
  tolerance_note: string | null;
}

export default function GarmentStyleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [style, setStyle] = useState<StyleDetail | null>(null);
  const [measurements, setMeasurements] = useState<StyleMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadStyleData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const [styleRes, measRes] = await Promise.all([
          fetch(`/api/styles/${slug}`, { cache: "no-store" }),
          fetch(`/api/styles/${slug}/measurements`, { cache: "no-store" }),
        ]);
        if (!styleRes.ok) throw new Error("Style lookup failed");
        if (!measRes.ok) throw new Error("Measurements lookup failed");
        const styleJson = (await styleRes.json()) as { style: StyleDetail };
        const measJson = (await measRes.json()) as { measurements: StyleMeasurement[] };
        if (!active) return;
        setStyle(styleJson.style);
        setMeasurements(measJson.measurements ?? []);
      } catch {
        if (active) setError("Could not load style details right now.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadStyleData();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-16 text-center text-[var(--muted)]">Loading style...</main>
      </div>
    );
  }

  if (error || !style) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-center text-[var(--muted)]">{error ?? "Style not found."}</p>
          <div className="mt-6 text-center">
            <Link
              href="/garments"
              className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--foreground)]"
            >
              Back to KB&apos;s Fashions
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link href="/garments" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to KB&apos;s Fashions
          </Link>
          <p className="mt-4 text-xs uppercase tracking-wide text-[var(--muted)]">{style.category_name}</p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-[var(--foreground)]">
            {style.style_name}
          </h1>
          <p className="mt-3 text-[var(--muted)]">{style.short_description}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Fit: {style.fit_intent.replace(/_/g, " ")} · Difficulty: {style.difficulty_level}
            {style.closure_type ? ` · Closure: ${style.closure_type.replace(/_/g, " ")}` : ""}
          </p>
        </div>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            Required measurements
          </h2>
          {measurements.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No measurements mapped yet for this style.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {measurements.map((m) => (
                <li key={m.code} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--foreground)]">{m.label}</span>
                    <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] uppercase text-[var(--muted)]">
                      {m.body_zone.replace(/_/g, " ")}
                    </span>
                    <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] uppercase text-[var(--muted)]">
                      {m.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{m.description}</p>
                  {m.tolerance_note ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">Note: {m.tolerance_note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

