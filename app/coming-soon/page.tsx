import Link from "next/link";

export const metadata = {
  description: "This feature is coming soon.",
};

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-light tracking-tight text-[var(--foreground)]">
          Coming Soon
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          This feature is on the way. Check back soon for updates.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
