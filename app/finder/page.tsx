"use client";

import { useState } from "react";
import Link from "next/link";
import FilterPanel from "@/components/FilterPanel";
import ResultsGrid from "@/components/ResultsGrid";
import { getRecommendations } from "@/lib/recommendFabric";
import type { FinderFilters, FabricRecommendation } from "@/lib/types";

export default function FinderPage() {
  const [recommendations, setRecommendations] = useState<FabricRecommendation[] | null>(null);

  const handleSubmit = (filters: FinderFilters) => {
    const results = getRecommendations(filters);
    setRecommendations(results);
    // Optional: scroll to results
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight text-[var(--foreground)]">
            Fabric Finder
          </Link>
          <nav>
            <Link
              href="/"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
            Find your fabric
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Set your preferences below. Skin tone drives color recommendations; other
            filters use placeholder scoring until we add full data.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_0_rgb(0_0_0_/_.06)]">
              <FilterPanel onSubmit={handleSubmit} />
            </div>
          </aside>

          <section id="results" className="min-h-[400px]">
            {recommendations === null ? (
              <div className="rounded-xl border border-[var(--border)] border-dashed bg-[var(--surface)] p-12 text-center">
                <p className="text-[var(--muted)]">
                  Select your preferences and click &quot;Get recommendations&quot; to see
                  matching fabrics.
                </p>
              </div>
            ) : (
              <ResultsGrid recommendations={recommendations} />
            )}
          </section>
        </div>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          Fabric Finder — choose the right fabric for your project.
        </div>
      </footer>
    </div>
  );
}
