import Link from "next/link";
import MeasurementProfileList from "@/components/fit/MeasurementProfileList";

export const metadata = {
  description: "Enter and manage your measurement profiles for fit recommendations on patterns and garments.",
};

export default function MeasurementsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-[var(--foreground)]">
            Measurement profiles
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Save your measurements and body-shape notes, then use them to get fit
            recommendations for historical patterns, archival looks, and runway-inspired garments.
          </p>
        </div>

        <div className="mb-8">
          <Link
            href="/measurements/new"
            className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
          >
            + New profile
          </Link>
        </div>

        <MeasurementProfileList />

        <div className="mt-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
            How it works
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[var(--foreground)]">
            <li>Enter measurements in quick or full tailor mode.</li>
            <li>The system derives ratios and suggests a body shape; you can confirm or override.</li>
            <li>When you open a garment or pattern, choose a profile to see fit risks and adjustment suggestions.</li>
            <li>Recommendations are technical and constructive: they compare your measurements to the garment&apos;s assumptions and suggest how to achieve the intended balance.</li>
          </ul>
        </div>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          <Link href="/garments" className="hover:text-[var(--foreground)] transition">
            Check fit for a garment or pattern
          </Link>
          {" · "}
          Fabric Finder
        </div>
      </footer>
    </div>
  );
}
