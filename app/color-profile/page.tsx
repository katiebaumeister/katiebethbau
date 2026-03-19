import Link from "next/link";
import ColorProfileView from "./ColorProfileView";

export const metadata = {
  description:
    "Your combined skin, hair, and eye color profile with neutrals, accents, metals, and styling notes.",
};

export default function ColorProfilePage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/finder"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Back to finder
          </Link>
          <h1 className="mt-2 text-3xl font-light tracking-tight text-[var(--foreground)]">
            Your color profile
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Combined skin, hair, and eye recommendations: neutrals, accent colors, metals, and notes.
          </p>
        </div>

        <ColorProfileView />
      </main>

      <footer className="mt-16 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          © Katie Beth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
