export const metadata = {
  description: "Club Katie Beth community updates.",
};

export default function ClubKatieBethPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-light tracking-tight text-[var(--foreground)]">
          Club Katie Beth
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          <a
            href="https://www.instagram.com/katiebethbau/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--muted)] underline-offset-4 transition hover:text-[var(--foreground)] hover:decoration-[var(--foreground)]"
          >
            @katiebethbau
          </a>
        </p>
      </main>
    </div>
  );
}
