import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight text-[var(--foreground)]">
            Fabric Finder
          </Link>
          <nav>
            <Link
              href="/finder"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              Find fabric
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Hero />

        {/* Inputs explanation */}
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-light tracking-tight text-[var(--foreground)]">
              How it works
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              We recommend fabrics based on four inputs. Right now, skin tone uses real
              data for color coordination; climate, durability, and comfort use
              placeholder logic until we add full datasets.
            </p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <InputCard
                title="Climate"
                description="Cold, temperate, hot, humid, or dry—so your fabric suits where you'll wear it."
              />
              <InputCard
                title="Skin tone"
                description="Our 30-shade system helps pick colors that flatter your undertone and depth."
              />
              <InputCard
                title="Durability"
                description="Low, medium, or high—match the fabric to how much wear and care you expect."
              />
              <InputCard
                title="Comfort"
                description="Soft and drapey, breathable, structured, or low-maintenance."
              />
            </ul>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                href="/finder"
                className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-8 py-3.5 text-sm font-medium text-[var(--background)] transition hover:opacity-90"
              >
                Find My Fabric
              </Link>
              <Link
                href="/measurements"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--muted)]"
              >
                Measurement profiles
              </Link>
              <Link
                href="/garments"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--muted)]"
              >
                Garment fit
              </Link>
              <Link
                href="/fabrics/FAB006"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--muted)]"
              >
                Example fabric detail
              </Link>
            </div>
          </div>
        </section>

        {/* Preview cards for future features */}
        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-light tracking-tight text-[var(--foreground)]">
              Coming next
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Fabric Finder will grow into a full sewing research platform with
              these features.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <PreviewCard
                title="Yardage estimates"
                description="Suggested yardage by garment type and size."
              />
              <PreviewCard
                title="Sewing guidance"
                description="Stitch types, seam finishes, and handling tips."
              />
              <PreviewCard
                title="Designer inspiration"
                description="Runway and historical examples in similar fabrics."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          Fabric Finder — choose the right fabric for your project.
        </div>
      </footer>
    </div>
  );
}

function InputCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <li className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-5">
      <h3 className="font-medium text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted)]">{description}</p>
    </li>
  );
}

function PreviewCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] border-dashed bg-[var(--surface)] p-5 opacity-90">
      <h3 className="font-medium text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted)]">{description}</p>
      <p className="mt-2 text-xs text-[var(--muted)]">Coming soon</p>
    </div>
  );
}
