import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
          Sew smarter
        </p>
        <h1 className="text-4xl font-light tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
          Fabric Finder
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[var(--muted)] leading-relaxed">
          Choose the right fabric for your next project—by climate, skin tone,
          durability, and comfort. Start with a few preferences and get
          tailored recommendations.
        </p>
        <div className="mt-10">
          <Link
            href="/finder"
            className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-3.5 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
          >
            Find My Fabric
          </Link>
        </div>
      </div>
    </section>
  );
}
