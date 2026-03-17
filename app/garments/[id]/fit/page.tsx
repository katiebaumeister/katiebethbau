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
  if (!garment) return { description: "Garment not found." };
  return {
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
