import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6">
      <p className="text-xs uppercase tracking-wider text-[var(--muted)]">404</p>
      <h1 className="mt-2 text-2xl font-light text-[var(--foreground)]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)] text-center max-w-sm">
        This page doesn’t exist or the fabric ID might be wrong.
      </p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-[var(--foreground)] px-6 py-2.5 text-sm font-medium text-[var(--background)] hover:opacity-90"
        >
          Home
        </Link>
        <Link
          href="/finder"
          className="rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--muted)]"
        >
          Find fabric
        </Link>
      </div>
    </div>
  );
}
