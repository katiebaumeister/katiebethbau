"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useKBProfiles } from "@/src/hooks/useKBProfiles";
import {
  getFitResult,
  getSavedStyles,
  pushRecentStyle,
  type KBFitResult,
  type KBProfile,
  type MeasurementMap,
  type UnitPreference,
  toggleSavedStyle,
  upsertFitResult,
} from "@/src/lib/kbLocalStore";
import {
  getMeasurementStatus,
  type StyleMeasurementRequirement,
} from "@/src/lib/measurementStatus";
import MeasurementWizard from "@/src/components/kb/MeasurementWizard";
import FitGuidancePanel from "@/src/components/kb/FitGuidancePanel";

interface StyleDetail {
  id: number;
  slug: string;
  style_name: string;
  short_description: string;
  silhouette_tags: string[];
  fabric_type_default: string;
  fit_intent: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  closure_type: string | null;
  category_code: string;
  category_name: string;
}

interface StyleMeasurement {
  code: string;
  label: string;
  body_zone: string;
  unit: string;
  description: string;
  required_boolean: boolean;
  priority_order: number;
  tolerance_note: string | null;
}

interface StyleFabric {
  code: string;
  name: string;
  fabric_family: string;
  stretch_type: string;
  drape_level: string;
  structure_level: string;
  weight_category?: string;
  supportiveness?: string;
  recommendation_strength: "ideal" | "good" | "possible" | "avoid";
  reason: string;
}

type ProfileDraft = {
  id?: string;
  name: string;
  unit: UnitPreference;
  notes: string;
};

export default function GarmentStyleDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    upsertProfile,
    deleteProfile,
  } = useKBProfiles();

  const [style, setStyle] = useState<StyleDetail | null>(null);
  const [measurements, setMeasurements] = useState<StyleMeasurement[]>([]);
  const [fabrics, setFabrics] = useState<StyleFabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    name: "",
    unit: "in",
    notes: "",
  });
  const [fitResult, setFitResult] = useState<KBFitResult | null>(null);
  const [generatingFit, setGeneratingFit] = useState(false);
  const [fitError, setFitError] = useState<string | null>(null);
  const [savedStyle, setSavedStyle] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadStyleData() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const [styleRes, measRes, fabricRes] = await Promise.all([
          fetch(`/api/styles/${slug}`, { cache: "no-store" }),
          fetch(`/api/styles/${slug}/measurements`, { cache: "no-store" }),
          fetch(`/api/styles/${slug}/fabrics`, { cache: "no-store" }),
        ]);
        if (!styleRes.ok) throw new Error("Style lookup failed");
        if (!measRes.ok) throw new Error("Measurements lookup failed");
        if (!fabricRes.ok) throw new Error("Fabrics lookup failed");
        const styleJson = (await styleRes.json()) as { style: StyleDetail };
        const measJson = (await measRes.json()) as { measurements: StyleMeasurement[] };
        const fabricJson = (await fabricRes.json()) as { fabrics: StyleFabric[] };
        if (!active) return;
        setStyle(styleJson.style);
        setMeasurements(measJson.measurements ?? []);
        setFabrics(fabricJson.fabrics ?? []);
        pushRecentStyle(slug);
        setSavedStyle(getSavedStyles().some((x) => x.slug === slug));
      } catch {
        if (active) setError("Could not load style details right now.");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadStyleData();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!activeProfileId || !slug) {
      setFitResult(null);
      return;
    }
    setFitResult(getFitResult(activeProfileId, slug));
  }, [activeProfileId, slug]);

  const requirements = useMemo<StyleMeasurementRequirement[]>(
    () =>
      measurements.map((m) => ({
        key: m.code,
        label: m.label,
        body_zone: m.body_zone,
        unit: m.unit,
        required: Boolean(m.required_boolean),
        description: m.description,
      })),
    [measurements]
  );

  const status = useMemo(
    () => getMeasurementStatus(requirements, activeProfile?.measurements),
    [requirements, activeProfile?.measurements]
  );

  const completeRequirements = useMemo(
    () => requirements.filter((r) => status.completeKeys.includes(r.key)),
    [requirements, status.completeKeys]
  );
  const missingRequiredRequirements = useMemo(
    () => requirements.filter((r) => status.missingRequiredKeys.includes(r.key)),
    [requirements, status.missingRequiredKeys]
  );
  const missingOptionalRequirements = useMemo(
    () => requirements.filter((r) => status.missingOptionalKeys.includes(r.key)),
    [requirements, status.missingOptionalKeys]
  );

  const fabricGroups = useMemo(
    () => ({
      best: fabrics.filter((f) => f.recommendation_strength === "ideal").slice(0, 6),
      works: fabrics
        .filter((f) => f.recommendation_strength === "good" || f.recommendation_strength === "possible")
        .slice(0, 6),
      caution: fabrics.filter((f) => f.recommendation_strength === "avoid").slice(0, 6),
    }),
    [fabrics]
  );

  const confidenceNote = useMemo(() => {
    if (!status.canGenerateFit) {
      return "Low confidence: complete required measurements first.";
    }
    if (missingOptionalRequirements.length === 0) {
      return "Higher confidence: all optional shaping measurements are present.";
    }
    return `Moderate confidence: add ${missingOptionalRequirements.length} optional measurement${
      missingOptionalRequirements.length === 1 ? "" : "s"
    } for stronger guidance.`;
  }, [status.canGenerateFit, missingOptionalRequirements.length]);

  function countValid(profile: KBProfile | null, keys: string[]): number {
    if (!profile) return 0;
    return keys.filter((key) => {
      const value = profile.measurements?.[key];
      if (typeof value === "number") return Number.isFinite(value);
      if (typeof value === "string") return value.trim().length > 0 && Number.isFinite(Number(value));
      return false;
    }).length;
  }

  const profileHealth = useMemo(() => {
    const upperKeys = ["shoulder_width", "bust_full", "bust_high", "underbust", "armhole_depth", "bicep_circumference"];
    const lowerKeys = ["waist_natural", "high_hip", "hip_full", "waist_to_hip", "rise_front", "rise_back", "inseam", "outseam"];
    const pantsKeys = ["waist_natural", "hip_full", "waist_to_hip", "rise_front", "rise_back", "inseam"];
    const skirtKeys = ["waist_natural", "hip_full", "waist_to_hip", "skirt_length_target"];
    const bodiceKeys = ["shoulder_width", "bust_full", "bust_high", "back_waist_length", "armhole_depth"];

    const upper = countValid(activeProfile, upperKeys);
    const lower = countValid(activeProfile, lowerKeys);
    const pants = countValid(activeProfile, pantsKeys);
    const skirts = countValid(activeProfile, skirtKeys);
    const bodice = countValid(activeProfile, bodiceKeys);

    return {
      totalSaved: activeProfile
        ? Object.values(activeProfile.measurements ?? {}).filter((v) => v !== null && v !== "").length
        : 0,
      upperPercent: Math.round((upper / upperKeys.length) * 100),
      lowerPercent: Math.round((lower / lowerKeys.length) * 100),
      pantsPercent: Math.round((pants / pantsKeys.length) * 100),
      skirtsPercent: Math.round((skirts / skirtKeys.length) * 100),
      bodicePercent: Math.round((bodice / bodiceKeys.length) * 100),
    };
  }, [activeProfile]);

  function beginCreateProfile() {
    setProfileDraft({ name: "", unit: "in", notes: "" });
    setEditorOpen(true);
  }

  function beginEditProfile(profile: KBProfile) {
    setProfileDraft({
      id: profile.id,
      name: profile.name,
      unit: profile.unit,
      notes: profile.notes ?? "",
    });
    setEditorOpen(true);
  }

  function saveProfileFromDraft() {
    if (!profileDraft.name.trim()) return;
    const baseMeasurements =
      profileDraft.id && profiles.find((p) => p.id === profileDraft.id)?.measurements
        ? profiles.find((p) => p.id === profileDraft.id)!.measurements
        : {};
    const baseFlags =
      profileDraft.id && profiles.find((p) => p.id === profileDraft.id)?.bodyFlags
        ? profiles.find((p) => p.id === profileDraft.id)!.bodyFlags
        : {};
    upsertProfile({
      id: profileDraft.id,
      name: profileDraft.name.trim(),
      unit: profileDraft.unit,
      notes: profileDraft.notes,
      measurements: baseMeasurements,
      bodyFlags: baseFlags,
    });
    setEditorOpen(false);
  }

  function mergeMeasurementsIntoActiveProfile(updates: MeasurementMap) {
    if (!activeProfile) return;
    upsertProfile({
      ...activeProfile,
      id: activeProfile.id,
      name: activeProfile.name,
      measurements: {
        ...(activeProfile.measurements ?? {}),
        ...updates,
      },
    });
    setWizardOpen(false);
  }

  function handleToggleSavedStyle() {
    if (!style) return;
    const next = toggleSavedStyle(style.slug);
    setSavedStyle(next.some((x) => x.slug === style.slug));
  }

  async function generateFitGuidance() {
    if (!style || !activeProfile) return;
    setGeneratingFit(true);
    setFitError(null);
    try {
      const res = await fetch(`/api/styles/${style.slug}/generate-fit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: activeProfile.id,
          userId: "local-user",
          measurements: activeProfile.measurements,
          bodyFlags: activeProfile.bodyFlags,
          unit: activeProfile.unit,
        }),
      });
      if (!res.ok) throw new Error("Fit generation failed");
      const payload = (await res.json()) as {
        style?: { name?: string };
        result?: {
          baseSize?: string;
          fitNotes?: string[];
          adjustments?: string[];
          warnings?: string[];
          confidence?: "low" | "medium" | "high";
          fabricAdvice?: string[];
        };
      };
      const saved = upsertFitResult({
        profileId: activeProfile.id,
        styleSlug: style.slug,
        styleName: style.style_name,
        inputSnapshot: {
          measurements: activeProfile.measurements ?? {},
          bodyFlags: activeProfile.bodyFlags,
          unit: activeProfile.unit,
        },
        result: {
          baseSize: payload.result?.baseSize ?? "Profile-calibrated baseline",
          fitNotes:
            payload.result?.fitNotes ?? [
              "Fit guidance generated from your current measurement profile.",
            ],
          adjustments:
            payload.result?.adjustments ?? [
              "Use this as a starting point and test in muslin before final cuts.",
            ],
          warnings: payload.result?.warnings ?? [],
          confidence: payload.result?.confidence ?? "medium",
          confidenceNote,
          adjustmentDetails: [
            {
              adjustment:
                payload.result?.adjustments?.[0] ??
                "Refine waist/hip shaping to match your measurement map.",
              reason:
                "Your selected style and profile measurements define where shaping pressure should be redistributed.",
              sewingEffect:
                "Improves seam balance and reduces drag or pooling in key fit zones.",
            },
            {
              adjustment:
                payload.result?.adjustments?.[1] ??
                "Validate vertical balance before final hems or waistline decisions.",
              reason:
                "Vertical proportions often shift perceived fit even when circumference measurements are correct.",
              sewingEffect:
                "Helps avoid waistline drift and keeps silhouette intent aligned with the pattern block.",
            },
          ],
          fabricAdvice: payload.result?.fabricAdvice ?? [],
        },
      });
      setFitResult(saved);
    } catch {
      setFitError("Could not generate guidance right now. Please try again.");
    } finally {
      setGeneratingFit(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-16 text-center text-[var(--muted)]">Loading style...</main>
      </div>
    );
  }

  if (error || !style) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-center text-[var(--muted)]">{error ?? "Style not found."}</p>
          <div className="mt-6 text-center">
            <Link
              href="/garments"
              className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--foreground)]"
            >
              Back to KB&apos;s Fashions
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <Link href="/garments" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
            ← Back to KB&apos;s Fashions
          </Link>
          <p className="mt-4 text-xs uppercase tracking-wide text-[var(--muted)]">{style.category_name}</p>
          <h1 className="mt-1 text-3xl font-light tracking-tight text-[var(--foreground)]">
            {style.style_name}
          </h1>
          <p className="mt-3 text-[var(--muted)]">{style.short_description}</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Fit: {style.fit_intent.replace(/_/g, " ")} · Difficulty: {style.difficulty_level}
            {style.closure_type ? ` · Closure: ${style.closure_type.replace(/_/g, " ")}` : ""}
          </p>
          <button
            type="button"
            onClick={handleToggleSavedStyle}
            className="mt-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--foreground)] hover:border-[var(--foreground)]"
          >
            {savedStyle ? "Saved style" : "Save style"}
          </button>
        </div>

        <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">Profile</h2>
          {activeProfile ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm text-[var(--foreground)]">
                  <span className="mr-2 text-[var(--muted)]">Use saved profile</span>
                  <select
                    value={activeProfileId ?? ""}
                    onChange={(e) => setActiveProfileId(e.target.value || null)}
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  >
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={beginCreateProfile}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] hover:border-[var(--foreground)]"
                >
                  New profile
                </button>
                <button
                  type="button"
                  onClick={() => beginEditProfile(activeProfile)}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] hover:border-[var(--foreground)]"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => deleteProfile(activeProfile.id)}
                  className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] hover:border-rose-500"
                >
                  Delete
                </button>
              </div>
              <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-sm text-[var(--muted)]">
                <p>
                  <span className="text-[var(--foreground)]">Unit:</span> {activeProfile.unit}
                </p>
                <p>
                  <span className="text-[var(--foreground)]">Saved measurements:</span>{" "}
                  {profileHealth.totalSaved}
                </p>
                <p>
                  <span className="text-[var(--foreground)]">Last updated:</span>{" "}
                  {new Date(activeProfile.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--muted)]">
                  <p className="font-medium uppercase tracking-wide">Measurement health</p>
                  <p className="mt-1">Upper body completeness: {profileHealth.upperPercent}%</p>
                  <p>Lower body completeness: {profileHealth.lowerPercent}%</p>
                </div>
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 text-xs text-[var(--muted)]">
                  <p className="font-medium uppercase tracking-wide">Pattern readiness</p>
                  <p className="mt-1">Pants readiness: {profileHealth.pantsPercent}%</p>
                  <p>Skirt readiness: {profileHealth.skirtsPercent}%</p>
                  <p>Bodice readiness: {profileHealth.bodicePercent}%</p>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-[var(--border)] bg-[var(--background)] p-4">
              <p className="text-sm text-[var(--muted)]">Create a profile to personalize fit guidance.</p>
              <button
                type="button"
                onClick={beginCreateProfile}
                className="mt-3 rounded-md bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)]"
              >
                Create profile to personalize fit
              </button>
            </div>
          )}
        </section>

        <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">Measurement readiness</h2>
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
              <div
                className="h-full bg-[var(--foreground)] transition-all"
                style={{ width: `${status.completionPercent}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {status.completionPercent}% required complete ·{" "}
              {completeRequirements.filter((r) => r.required).length}/
              {requirements.filter((r) => r.required).length} required measurements ready
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Ready</p>
              <p className="mt-1 text-lg text-[var(--foreground)]">{completeRequirements.length}</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Still needed</p>
              <p className="mt-1 text-lg text-[var(--foreground)]">{missingRequiredRequirements.length}</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Helpful optional</p>
              <p className="mt-1 text-lg text-[var(--foreground)]">{missingOptionalRequirements.length}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Ready</h3>
              <ul className="mt-2 space-y-1 text-xs text-[var(--foreground)]">
                {completeRequirements.length ? (
                  completeRequirements.map((m) => <li key={m.key}>• {m.label}</li>)
                ) : (
                  <li className="text-[var(--muted)]">No completed measurements yet.</li>
                )}
              </ul>
            </article>
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Still needed</h3>
              <ul className="mt-2 space-y-1 text-xs text-[var(--foreground)]">
                {missingRequiredRequirements.length ? (
                  missingRequiredRequirements.map((m) => <li key={m.key}>• {m.label}</li>)
                ) : (
                  <li className="text-[var(--muted)]">All required measurements complete.</li>
                )}
              </ul>
            </article>
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Helpful but optional
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-[var(--foreground)]">
                {missingOptionalRequirements.length ? (
                  missingOptionalRequirements.map((m) => <li key={m.key}>• {m.label}</li>)
                ) : (
                  <li className="text-[var(--muted)]">No optional gaps detected.</li>
                )}
              </ul>
            </article>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {!activeProfile ? (
              <button
                type="button"
                onClick={beginCreateProfile}
                className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
              >
                Create profile
              </button>
            ) : !status.canGenerateFit ? (
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)]"
              >
                Add missing measurements
              </button>
            ) : (
              <button
                type="button"
                onClick={generateFitGuidance}
                disabled={generatingFit}
                className="rounded-md bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] disabled:opacity-60"
              >
                {fitResult ? "Regenerate guidance" : "Generate fit guidance"}
              </button>
            )}
          </div>
          {!status.canGenerateFit ? (
            <p className="mt-2 text-xs text-[var(--muted)]">
              You&apos;re missing {missingRequiredRequirements.length} required measurement
              {missingRequiredRequirements.length === 1 ? "" : "s"} for this style.
            </p>
          ) : (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Required measurements complete. You can generate fit guidance now.
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">{confidenceNote}</p>
        </section>

        <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">Fabric guidance</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Best match</h3>
              {fabricGroups.best.length ? (
                <ul className="mt-2 space-y-2 text-xs">
                  {fabricGroups.best.map((fabric) => (
                    <li key={fabric.code}>
                      <p className="font-medium text-[var(--foreground)]">{fabric.name}</p>
                      <p className="text-[var(--muted)]">
                        {fabric.structure_level} · {fabric.drape_level} drape · {fabric.stretch_type}
                      </p>
                      <p className="text-[var(--muted)]">{fabric.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">No best-match fabrics listed yet.</p>
              )}
            </article>
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Also works</h3>
              {fabricGroups.works.length ? (
                <ul className="mt-2 space-y-2 text-xs">
                  {fabricGroups.works.map((fabric) => (
                    <li key={fabric.code}>
                      <p className="font-medium text-[var(--foreground)]">{fabric.name}</p>
                      <p className="text-[var(--muted)]">
                        {fabric.structure_level} · {fabric.drape_level} drape · {fabric.stretch_type}
                      </p>
                      <p className="text-[var(--muted)]">{fabric.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">No alternates listed yet.</p>
              )}
            </article>
            <article className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
              <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Use caution</h3>
              {fabricGroups.caution.length ? (
                <ul className="mt-2 space-y-2 text-xs">
                  {fabricGroups.caution.map((fabric) => (
                    <li key={fabric.code}>
                      <p className="font-medium text-[var(--foreground)]">{fabric.name}</p>
                      <p className="text-[var(--muted)]">
                        {fabric.structure_level} · {fabric.drape_level} drape · {fabric.stretch_type}
                      </p>
                      <p className="text-[var(--muted)]">{fabric.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--muted)]">No caution fabrics listed.</p>
              )}
            </article>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)]">Measurements map</h2>
          {measurements.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">No measurements mapped yet for this style.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {measurements.map((m) => (
                <li key={m.code} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--foreground)]">{m.label}</span>
                    <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] uppercase text-[var(--muted)]">
                      {m.body_zone.replace(/_/g, " ")}
                    </span>
                    <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[10px] uppercase text-[var(--muted)]">
                      {m.unit}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{m.description}</p>
                  {m.tolerance_note ? (
                    <p className="mt-1 text-xs text-[var(--muted)]">Note: {m.tolerance_note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {fitError ? (
          <p className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{fitError}</p>
        ) : null}

        {fitResult ? (
          <div className="mt-6">
            <FitGuidancePanel fit={fitResult} />
          </div>
        ) : null}
      </main>

      {wizardOpen && activeProfile ? (
        <MeasurementWizard
          profile={activeProfile}
          requirements={requirements}
          missingRequiredKeys={status.missingRequiredKeys}
          missingOptionalKeys={status.missingOptionalKeys}
          onSave={mergeMeasurementsIntoActiveProfile}
          onClose={() => setWizardOpen(false)}
        />
      ) : null}

      {editorOpen ? (
        <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              {profileDraft.id ? "Edit profile" : "Create profile"}
            </h3>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-sm text-[var(--foreground)]">Profile name</span>
                <input
                  value={profileDraft.name}
                  onChange={(e) => setProfileDraft((d) => ({ ...d, name: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  placeholder="e.g. Katie core fit"
                />
              </label>
              <label className="block">
                <span className="text-sm text-[var(--foreground)]">Unit</span>
                <select
                  value={profileDraft.unit}
                  onChange={(e) => setProfileDraft((d) => ({ ...d, unit: e.target.value as UnitPreference }))}
                  className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                >
                  <option value="in">inches</option>
                  <option value="cm">centimeters</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-[var(--foreground)]">Notes</span>
                <textarea
                  value={profileDraft.notes}
                  onChange={(e) => setProfileDraft((d) => ({ ...d, notes: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                  rows={3}
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="rounded-md border border-[var(--border)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProfileFromDraft}
                className="rounded-md bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)]"
              >
                Save profile
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

