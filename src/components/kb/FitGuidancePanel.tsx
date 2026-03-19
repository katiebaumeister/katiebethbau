"use client";

import type { KBFitResult } from "@/src/lib/kbLocalStore";

type FitGuidancePanelProps = {
  fit: KBFitResult;
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function FitGuidancePanel({ fit }: FitGuidancePanelProps) {
  const result = fit.result;

  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">Fit guidance</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Last generated: {formatDate(fit.updatedAt)} · Based on your current saved profile
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Baseline</h3>
          <p className="mt-2 text-sm text-[var(--foreground)]">{result.baseSize ?? "Custom baseline from profile measurements"}</p>
        </article>

        <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Confidence</h3>
          <p className="mt-2 text-sm text-[var(--foreground)] capitalize">{result.confidence ?? "medium"}</p>
          {result.confidenceNote ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{result.confidenceNote}</p>
          ) : null}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Recommended adjustments
        </h3>
        {result.adjustmentDetails?.length ? (
          <div className="mt-2 space-y-2">
            {result.adjustmentDetails.map((item, idx) => (
              <div key={`${item.adjustment}-${idx}`} className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
                <p className="text-sm font-medium text-[var(--foreground)]">{item.adjustment}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  <span className="font-medium text-[var(--foreground)]">Reason:</span> {item.reason}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  <span className="font-medium text-[var(--foreground)]">Sewing effect:</span> {item.sewingEffect}
                </p>
              </div>
            ))}
          </div>
        ) : result.adjustments?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]">
            {result.adjustments.map((adj, idx) => (
              <li key={`${adj}-${idx}`}>{adj}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">No major adjustments suggested right now.</p>
        )}
      </article>

      <article className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Watch-outs</h3>
        {result.warnings?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-700">
            {result.warnings.map((warn, idx) => (
              <li key={`${warn}-${idx}`}>{warn}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">No high-risk fit warnings detected.</p>
        )}
      </article>

      <article className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Fit notes</h3>
        {result.fitNotes?.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]">
            {result.fitNotes.map((note, idx) => (
              <li key={`${note}-${idx}`}>{note}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted)]">No additional notes.</p>
        )}
      </article>

      {result.fabricAdvice?.length ? (
        <article className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Fabric advice</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--foreground)]">
            {result.fabricAdvice.map((advice, idx) => (
              <li key={`${advice}-${idx}`}>{advice}</li>
            ))}
          </ul>
        </article>
      ) : null}
    </section>
  );
}

