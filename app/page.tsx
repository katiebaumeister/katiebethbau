import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative min-h-svh">
      <main className="absolute inset-0 flex items-center justify-center">
        <Hero />
      </main>

      <footer className="absolute inset-x-0 bottom-2 py-1">
        <div className="mx-auto max-w-4xl px-6 text-center text-xs text-[var(--muted)]">
          © Katie Beth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

