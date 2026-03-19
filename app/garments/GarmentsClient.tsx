"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import topButtonUp from "../../clothes/1buttonuptop.png";
import topCami from "../../clothes/1camitop.png";
import topHenley from "../../clothes/1henleytops.png";
import topHighNeckTank from "../../clothes/1highnecktanktop.png";
import topTshirtBlock from "../../clothes/1tshirtblocktop.png";
import bottomAline from "../../clothes/2alineskirt.png";
import bottomCasualLounge from "../../clothes/2casualloungepant.png";
import bottomCigarette from "../../clothes/2cigarettepant.png";
import bottomPleated from "../../clothes/2pleatedtrouserpant.png";
import bottomStraight from "../../clothes/2straightlegpant.png";
import bottomWide from "../../clothes/2widelegpant.png";
import mannequin from "../../clothes/me.png";

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

type RailItem = {
  id: string;
  label: string;
  src: StaticImageData;
  styleSlug: string;
};

const topsRail: RailItem[] = [
  { id: "1buttonuptop", label: "Button-Up Shirt", src: topButtonUp, styleSlug: "classic_button_up_shirt" },
  { id: "1camitop", label: "Cami Top", src: topCami, styleSlug: "cami_strap_top" },
  { id: "1henleytops", label: "Henley", src: topHenley, styleSlug: "henley_top" },
  { id: "1highnecktanktop", label: "High Neck Tank", src: topHighNeckTank, styleSlug: "high_neck_tank" },
  { id: "1tshirtblocktop", label: "T-Shirt Block", src: topTshirtBlock, styleSlug: "tshirt_block" },
];
const bottomsRail = [
  { id: "2cigarettepant", label: "Cigarette Pant", src: bottomCigarette, styleSlug: "cigarette_pant" },
  { id: "2straightlegpant", label: "Straight Leg", src: bottomStraight, styleSlug: "straight_leg_trouser" },
  { id: "2widelegpant", label: "Wide Leg", src: bottomWide, styleSlug: "wide_leg_trouser" },
  { id: "2pleatedtrouserpant", label: "Pleated Trouser", src: bottomPleated, styleSlug: "pleated_trouser" },
  { id: "2casualloungepant", label: "Casual Lounge", src: bottomCasualLounge, styleSlug: "elastic_waist_lounge_pant" },
  { id: "2alineskirt", label: "A-Line Skirt", src: bottomAline, styleSlug: "a_line_skirt" },
] satisfies RailItem[];

export default function GarmentsClient() {
  const [styles, setStyles] = useState<StyleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedStyleSlug, setSelectedStyleSlug] = useState<string | null>(null);

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
    let next = activeCategory === "all" ? styles : styles.filter((s) => s.category_code === activeCategory);
    if (selectedStyleSlug) {
      next = next.filter((s) => s.slug === selectedStyleSlug);
    }
    return next;
  }, [styles, activeCategory, selectedStyleSlug]);

  const styleBySlug = useMemo(() => {
    const map = new Map<string, StyleCard>();
    styles.forEach((s) => map.set(s.slug, s));
    return map;
  }, [styles]);

  const visibleTopsRail = useMemo(() => {
    return topsRail.filter((item) => {
      const style = styleBySlug.get(item.styleSlug);
      if (!style) return false;
      if (activeCategory !== "all" && style.category_code !== activeCategory) return false;
      return true;
    });
  }, [activeCategory, styleBySlug]);

  const visibleBottomsRail = useMemo(() => {
    return bottomsRail.filter((item) => {
      const style = styleBySlug.get(item.styleSlug);
      if (!style) return false;
      if (activeCategory !== "all" && style.category_code !== activeCategory) return false;
      return true;
    });
  }, [activeCategory, styleBySlug]);

  function handleChipSelect(categoryCode: string) {
    setActiveCategory(categoryCode);
    setSelectedStyleSlug(null);
  }

  function handleRailSelect(styleSlug: string) {
    setSelectedStyleSlug((prev) => (prev === styleSlug ? null : styleSlug));
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
              KB&apos;s Fashions
            </h1>
          </div>
          <Link
            href="/garments/closet"
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--foreground)]"
          >
            Your Closet
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.code}
              type="button"
              onClick={() => handleChipSelect(category.code)}
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

        <section className="mb-8 overflow-hidden rounded-2xl bg-[#f3bfd9]/45 p-2">
          <div className="relative h-[360px] w-full">
            <div className="absolute right-2 top-2 h-[340px] w-[220px]">
              <Image
                src={mannequin}
                alt="Mannequin"
                fill
                className="object-contain object-right-top"
                sizes="220px"
              />
            </div>
            <div className="absolute left-2 top-2 flex">
              {visibleTopsRail.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRailSelect(item.styleSlug)}
                  className={`relative h-[190px] w-[190px] shrink-0 transition-transform duration-200 hover:rotate-3 ${
                    idx > 0 ? "-ml-[120px]" : ""
                  } ${selectedStyleSlug === item.styleSlug ? "brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" : ""}`}
                  style={{
                    zIndex: idx + 1,
                    marginTop: `${idx % 3 === 0 ? 0 : idx % 3 === 1 ? 6 : -4}px`,
                  }}
                  title={item.label}
                >
                  <Image src={item.src} alt={item.label} fill className="object-contain object-left-top" sizes="190px" />
                </button>
              ))}
            </div>
            <div className="absolute left-2 top-[168px] flex">
              {visibleBottomsRail.map((item, idx) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRailSelect(item.styleSlug)}
                  className={`relative h-[210px] w-[190px] shrink-0 transition-transform duration-200 hover:rotate-3 ${
                    idx > 0 ? "-ml-[130px]" : ""
                  } ${selectedStyleSlug === item.styleSlug ? "brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" : ""}`}
                  style={{
                    zIndex: idx + 1,
                    marginTop: `${idx % 3 === 0 ? 0 : idx % 3 === 1 ? 8 : -6}px`,
                  }}
                  title={item.label}
                >
                  <Image src={item.src} alt={item.label} fill className="object-contain object-left-top" sizes="190px" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {selectedStyleSlug ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)]">
            <span>Focused on selected item. Showing one related card.</span>
            <button
              type="button"
              onClick={() => setSelectedStyleSlug(null)}
              className="rounded-md border border-[var(--border)] px-2 py-1 hover:border-[var(--foreground)]"
            >
              Clear selection
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            Loading styles...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            {error}
          </div>
        ) : !selectedStyleSlug ? null : filteredStyles.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No matching style found.
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

