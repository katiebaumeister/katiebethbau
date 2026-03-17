import Link from "next/link";
import { garmentExamples } from "@/data/garmentExamples";

export const metadata = {
  description: "Check fit for archival looks, patterns, and runway-inspired garments.",
};

export default function GarmentsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
            Garment fit
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Select a garment or pattern, then choose your measurement profile to see likely fit risks,
            balance observations, and adjustment suggestions. The system compares your measurements to
            the garment&apos;s intended proportions—never &quot;wrong&quot; body type, only &quot;this assumes X; you might consider Y.&quot;
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {garmentExamples.map((g) => (
            <li key={g.id}>
              <Link
                href={`/garments/${g.id}/fit`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--foreground)]"
              >
                <span className="font-medium text-[var(--foreground)]">{g.title}</span>
                <p className="mt-1 text-xs text-[var(--muted)] capitalize">
                  {g.source_type.replace(/_/g, " ")}
                  {g.era ? ` · ${g.era}` : ""}
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">{g.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          © Katie Beth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
