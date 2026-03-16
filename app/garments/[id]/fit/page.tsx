import Link from "next/link";
import { notFound } from "next/navigation";
import { getGarmentExampleById } from "@/data/garmentExamples";
import GarmentFitClient from "./GarmentFitClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const garment = getGarmentExampleById(id);
  if (!garment) return { title: "Garment not found" };
  return {
    title: `Fit: ${garment.title} — Fabric Finder`,
    description: `Fit recommendations and adjustment suggestions for ${garment.title}.`,
  };
}

export default async function GarmentFitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const garment = getGarmentExampleById(id);
  if (!garment) notFound();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight text-[var(--foreground)]">
            Fabric Finder
          </Link>
          <nav className="flex gap-6">
            <Link href="/garments" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              Garments
            </Link>
            <Link href="/measurements" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition">
              My profiles
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <Link href="/garments" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to garments
          </Link>
          <h1 className="mt-2 text-2xl font-light tracking-tight text-[var(--foreground)]">
            {garment.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)] capitalize">
            {garment.source_type.replace(/_/g, " ")}
            {garment.era ? ` · ${garment.era}` : ""} · {garment.category}
          </p>
        </div>

        <GarmentFitClient garment={garment} />
      </main>
    </div>
  );
}
