import type { FabricRecommendation } from "@/lib/types";

interface FabricCardProps {
  recommendation: FabricRecommendation;
  rank: number;
}

export default function FabricCard({ recommendation, rank }: FabricCardProps) {
  const { fabric, scoreBreakdown, matchReasons, bestColorFamily } = recommendation;
  const { total_score, skin_tone_score, climate_score, durability_score, comfort_score, explanation } = scoreBreakdown;

  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_0_rgb(0_0_0_/_.06)] transition hover:shadow-[0_4px_12px_-2px_rgb(0_0_0_/_.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-[var(--muted)]">
            #{rank} · {total_score}% match
          </span>
          <h3 className="mt-1 text-lg font-medium text-[var(--foreground)]">
            {fabric.name}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {fabric.category} · {fabric.fiberContent}
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span title="Skin tone / color fit">
          <span className="text-[var(--muted)]">Skin tone:</span>{" "}
          <span className="font-medium text-[var(--foreground)]">{skin_tone_score}%</span>
        </span>
        <span title="Climate fit">
          <span className="text-[var(--muted)]">Climate:</span>{" "}
          <span className="font-medium text-[var(--foreground)]">{climate_score}%</span>
        </span>
        <span title="Durability fit">
          <span className="text-[var(--muted)]">Durability:</span>{" "}
          <span className="font-medium text-[var(--foreground)]">{durability_score}%</span>
        </span>
        <span title="Comfort fit">
          <span className="text-[var(--muted)]">Comfort:</span>{" "}
          <span className="font-medium text-[var(--foreground)]">{comfort_score}%</span>
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Why it was chosen
          </p>
          <p className="mt-1.5 text-sm text-[var(--foreground)] leading-relaxed">
            {explanation}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Details
          </p>
          <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-sm text-[var(--foreground)]">
            {matchReasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Best color family
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--foreground)] capitalize">
            {bestColorFamily}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Weight & feel
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]">
            {fabric.structureLevel.replace(/-/g, " ")}, breathability {fabric.breathabilityScore}/5. {fabric.notes}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Ideal for
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]">
            {fabric.commonUses.join(", ")}
          </p>
        </div>

        <div className="pt-2 border-t border-[var(--border)] space-y-1">
          <p className="text-xs text-[var(--muted)]">
            Care: {fabric.careLevel}
          </p>
          {/* Future: plug in when data/API is ready */}
          {recommendation.estimatedYardage && (
            <p className="text-xs text-[var(--muted)]">Yardage: {recommendation.estimatedYardage}</p>
          )}
          {recommendation.stitchGuidance && recommendation.stitchGuidance.length > 0 && (
            <p className="text-xs text-[var(--muted)]">Stitches: {recommendation.stitchGuidance.join(", ")}</p>
          )}
          {recommendation.designerInspiration && recommendation.designerInspiration.length > 0 && (
            <p className="text-xs text-[var(--muted)]">Inspiration: {recommendation.designerInspiration.join(", ")}</p>
          )}
        </div>
      </div>
    </article>
  );
}
