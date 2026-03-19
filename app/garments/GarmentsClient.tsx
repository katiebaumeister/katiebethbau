"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface StyleCard {
  id: number;
  slug: string;
  style_name: string;
  short_description: string;
  silhouette_tags: string[];
  fit_intent: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  closure_type: string | null;
  category_code: string;
  category_name: string;
}

export default function GarmentsClient() {
  const [styles, setStyles] = useState<StyleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    let active = true;
    async function loadStyles() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/styles", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load styles");
        const json = (await res.json()) as { styles: StyleCard[] };
        if (active) setStyles(json.styles ?? []);
      } catch {
        if (active) setError("Could not load Sewing Closet styles right now.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadStyles();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    styles.forEach((s) => map.set(s.category_code, s.category_name));
    return [{ code: "all", name: "All" }, ...Array.from(map, ([code, name]) => ({ code, name }))];
  }, [styles]);

  const filteredStyles = useMemo(() => {
    if (activeCategory === "all") return styles;
    return styles.filter((s) => s.category_code === activeCategory);
  }, [styles, activeCategory]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
            KB&apos;s Fashions
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Browse core sewing styles from the Sewing Closet catalog, then open any card to see
            required measurements and fit details.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.code}
              type="button"
              onClick={() => setActiveCategory(category.code)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                activeCategory === category.code
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--foreground)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            Loading styles...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            {error}
          </div>
        ) : filteredStyles.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No styles found in this category yet.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {filteredStyles.map((style) => (
              <li key={style.id}>
                <Link
                  href={`/garments/style/${style.slug}`}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--foreground)]"
                >
                  <p className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                    {style.category_name}
                  </p>
                  <span className="mt-1 block font-medium text-[var(--foreground)]">{style.style_name}</span>
                  <p className="mt-2 text-sm text-[var(--muted)]">{style.short_description}</p>
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    {style.fit_intent.replace(/_/g, " ")} · {style.difficulty_level}
                    {style.closure_type ? ` · ${style.closure_type.replace(/_/g, " ")}` : ""}
                  </p>
                  {style.silhouette_tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {style.silhouette_tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] text-[var(--foreground)]"
                        >
                          {tag.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="mt-16 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          © Katie Beth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

