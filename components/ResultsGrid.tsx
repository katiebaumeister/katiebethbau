import type { FabricRecommendation } from "@/lib/types";
import FabricCard from "./FabricCard";

interface ResultsGridProps {
  recommendations: FabricRecommendation[];
}

export default function ResultsGrid({ recommendations }: ResultsGridProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
        <p className="text-[var(--muted)]">
          No recommendations yet. Adjust your filters and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--muted)]">
        {recommendations.length} fabric{recommendations.length !== 1 ? "s" : ""} matched your preferences.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, i) => (
          <FabricCard key={rec.fabric.id} recommendation={rec} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
