import Link from "next/link";
import MeasurementEntryWizard from "@/components/fit/MeasurementEntryWizard";

export const metadata = {
  title: "New measurement profile — Fabric Finder",
  description: "Enter your measurements in quick or full tailor mode.",
};

export default function NewMeasurementPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight text-[var(--foreground)]">
            Fabric Finder
          </Link>
          <nav className="flex gap-6">
            <Link href="/measurements" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              My profiles
            </Link>
            <Link href="/garments" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              Garment fit
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link href="/measurements" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to profiles
          </Link>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-[var(--foreground)]">
            New measurement profile
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Enter traditional tailor measurements and optional body-shape notes. The system will derive
            ratios and suggest a body type; you can confirm or override before saving.
          </p>
        </div>

        <MeasurementEntryWizard />
      </main>
    </div>
  );
}
