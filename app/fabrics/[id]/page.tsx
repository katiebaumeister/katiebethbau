import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getFabricById,
  getStitchProfileForFabric,
  getClimateProfileForFabric,
  getDesignerProfileForFabric,
  scoreFabricForClimate,
  type ClimateKey,
} from "@/lib/fabricHelpers";
import { getAllReferencesForFabricGrouped } from "@/lib/referenceHelpers";
import FabricReferencesPanel from "@/components/FabricReferencesPanel";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const fabric = getFabricById(id);
  if (!fabric) return { description: "Fabric not found." };
  return {
    description: `Climate fit, stitch methods, ideal garments, and designer references for ${fabric.name}.`,
  };
}

const CLIMATE_KEYS: { key: ClimateKey; label: string }[] = [
  { key: "hot", label: "Hot" },
  { key: "humid", label: "Humid" },
  { key: "temperate", label: "Temperate" },
  { key: "cool", label: "Cool" },
  { key: "cold", label: "Cold" },
  { key: "dry", label: "Dry" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FabricDetailPage({ params }: PageProps) {
  const { id } = await params;
  const fabric = getFabricById(id);
  if (!fabric) notFound();

  const stitchProfile = getStitchProfileForFabric(fabric);
  const climateProfile = getClimateProfileForFabric(fabric);
  const designerProfile = getDesignerProfileForFabric(fabric);
  const referencesGrouped = getAllReferencesForFabricGrouped(fabric.id);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {fabric.category} · {fabric.fiber_family}
          </p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-[var(--foreground)]">
            {fabric.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {fabric.construction} · {fabric.weight_class} · {fabric.drape_level} drape
            · {fabric.durability_level} durability
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Climate fit */}
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Climate fit
              </h2>
              {climateProfile ? (
                <>
                  <p className="mt-2 text-sm text-[var(--foreground)]">
                    {climateProfile.name}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-3">
                    {CLIMATE_KEYS.map(({ key, label }) => {
                      const score = scoreFabricForClimate(fabric, key);
                      return (
                        <li
                          key={key}
                          className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm"
                        >
                          <span className="text-[var(--muted)]">{label}:</span>{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {score}%
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {climateProfile.notes.length > 0 && (
                    <ul className="mt-3 list-disc list-inside space-y-0.5 text-sm text-[var(--muted)]">
                      {climateProfile.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  No climate profile linked.
                </p>
              )}
            </section>

            {/* Best stitch methods */}
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Best stitch methods
              </h2>
              {stitchProfile ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Seams</p>
                    <ul className="mt-1 list-disc list-inside text-sm text-[var(--foreground)]">
                      {stitchProfile.seam_recommendations.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Stitches</p>
                    <ul className="mt-1 list-disc list-inside text-sm text-[var(--foreground)]">
                      {stitchProfile.stitch_recommendations.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Needles</p>
                    <ul className="mt-1 list-disc list-inside text-sm text-[var(--foreground)]">
                      {stitchProfile.needle_recommendations.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Edge finishes</p>
                    <ul className="mt-1 list-disc list-inside text-sm text-[var(--foreground)]">
                      {stitchProfile.edge_finish_recommendations.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  {stitchProfile.pressing_notes?.length > 0 && (
                    <div>
                      <p className="text-xs text-[var(--muted)]">Pressing</p>
                      <ul className="mt-1 list-disc list-inside text-sm text-[var(--foreground)]">
                        {stitchProfile.pressing_notes.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stitchProfile.caution_notes && stitchProfile.caution_notes.length > 0 && (
                    <div>
                      <p className="text-xs text-[var(--muted)]">Caution</p>
                      <ul className="mt-1 list-disc list-inside text-sm text-amber-700 dark:text-amber-400">
                        {stitchProfile.caution_notes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  No stitch profile linked.
                </p>
              )}
            </section>

            {/* Ideal garments */}
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Ideal garments & uses
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {fabric.common_uses.map((use) => (
                  <li
                    key={use}
                    className="rounded-full bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                  >
                    {use}
                  </li>
                ))}
              </ul>
            </section>

            {/* Coordinating color families */}
            <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                Coordinating color families
              </h2>
              {fabric.recommended_color_families && fabric.recommended_color_families.length > 0 ? (
                <p className="mt-3 text-sm text-[var(--foreground)]">
                  {fabric.recommended_color_families.join(", ")}
                </p>
              ) : (
                <p className="mt-3 text-sm text-[var(--muted)]">
                  Use the Finder and select your skin tone for personalized color
                  recommendations.
                </p>
              )}
            </section>

            {/* Reference library: runway, vintage patterns, museum */}
            <FabricReferencesPanel
              runway={referencesGrouped.runway}
              vintage={referencesGrouped.vintage}
              museum={referencesGrouped.museum}
            />

            {/* Designer associations (profile-level) */}
            {designerProfile && (
              <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">
                  Designer associations
                </h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-[var(--muted)]">Historical designers</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      {designerProfile.historical_designers.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Runway & houses</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      {designerProfile.runway_or_house_associations.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted)]">Usage examples</p>
                    <p className="mt-1 text-sm text-[var(--foreground)]">
                      {designerProfile.usage_examples.join(", ")}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Fabric at a glance
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-[var(--muted)]">Construction</dt>
                  <dd className="font-medium text-[var(--foreground)] capitalize">
                    {fabric.construction}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Weight</dt>
                  <dd className="font-medium text-[var(--foreground)]">
                    {fabric.weight_class.replace(/-/g, " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Stretch</dt>
                  <dd className="font-medium text-[var(--foreground)] capitalize">
                    {fabric.stretch_level}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Drape</dt>
                  <dd className="font-medium text-[var(--foreground)] capitalize">
                    {fabric.drape_level}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--muted)]">Opacity</dt>
                  <dd className="font-medium text-[var(--foreground)]">
                    {fabric.opacity.replace(/-/g, " ")}
                  </dd>
                </div>
                {fabric.notes && (
                  <div>
                    <dt className="text-[var(--muted)]">Notes</dt>
                    <dd className="text-[var(--foreground)]">{fabric.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-16 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-[var(--muted)]">
          © Katie Beth. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
