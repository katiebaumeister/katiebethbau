"use client";

import type { ReferenceCardView, ConfidenceLabel } from "@/lib/types";

interface FabricReferencesPanelProps {
  runway: ReferenceCardView[];
  vintage: ReferenceCardView[];
  museum: ReferenceCardView[];
}

function ConfidenceBadge({ label }: { label: ConfidenceLabel }) {
  const styles: Record<ConfidenceLabel, string> = {
    high: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    low: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${styles[label]}`}
    >
      {label} confidence
    </span>
  );
}

function ReferenceCard({ card }: { card: ReferenceCardView }) {
  const isVintage = card.kind === "vintage";
  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--foreground)]/20">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-[var(--background)] flex items-center justify-center text-[var(--muted)] text-xs">
          Image
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-[var(--foreground)]">{card.title}</h3>
            <ConfidenceBadge label={card.confidence_label} />
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0 text-xs text-[var(--muted)]">
            {card.house_or_brand && (
              <span>{card.house_or_brand}</span>
            )}
            {card.year != null && (
              <span>{card.season ? `${card.season} ${card.year}` : card.year}</span>
            )}
            {card.garment_type && (
              <span className="capitalize">{card.garment_type}</span>
            )}
            {isVintage && card.pattern_company && (
              <span>
                {card.pattern_company}
                {card.pattern_number ? ` ${card.pattern_number}` : ""}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-[var(--foreground)] leading-snug">
            {card.summary}
          </p>
          {isVintage && (card.recommended_fabrics_raw?.length ?? 0) > 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              <span className="font-medium">Recommended fabrics:</span>{" "}
              {card.recommended_fabrics_raw!.join(", ")}
            </p>
          )}
          {isVintage && (card.yardage_raw?.length ?? 0) > 0 && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              <span className="font-medium">Yardage:</span>{" "}
              {card.yardage_raw!.join(" ")}
            </p>
          )}
          {card.educational_value && card.educational_value.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs text-[var(--muted)]">
              {card.educational_value.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

function Section({
  title,
  cards,
}: {
  title: string;
  cards: ReferenceCardView[];
}) {
  if (cards.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        {title}
      </h3>
      <ul className="mt-3 space-y-3">
        {cards.map((card) => (
          <li key={card.reference_id}>
            <ReferenceCard card={card} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FabricReferencesPanel({
  runway,
  vintage,
  museum,
}: FabricReferencesPanelProps) {
  const hasAny = runway.length > 0 || vintage.length > 0 || museum.length > 0;
  if (!hasAny) {
    return (
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
          Runway & reference library
        </h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          No runway, vintage pattern, or museum references are linked for this
          fabric yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
        Runway & reference library
      </h2>
      <div className="mt-6 space-y-8">
        <Section title="Runway" cards={runway} />
        <Section title="Vintage patterns" cards={vintage} />
        <Section title="Museum & archive" cards={museum} />
      </div>
    </section>
  );
}
