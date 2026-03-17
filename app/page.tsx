import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <main>
        <Hero />
      </main>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          Fabric Finder — choose the right fabric for your project.
        </div>
      </footer>
    </div>
  );
}

