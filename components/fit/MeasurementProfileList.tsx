"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadStoredProfiles } from "@/lib/measurementStorage";

export default function MeasurementProfileList() {
  const [profiles, setProfiles] = useState<ReturnType<typeof loadStoredProfiles>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProfiles(loadStoredProfiles());
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border border-[var(--border)] border-dashed bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] border-dashed bg-[var(--surface)] p-8 text-center">
        <p className="text-[var(--muted)]">No measurement profiles yet.</p>
        <Link
          href="/measurements/new"
          className="mt-3 inline-block text-sm font-medium text-[var(--foreground)] underline"
        >
          Create your first profile
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {profiles.map(({ profile, derived, bodyShape }) => (
        <li key={profile.id}>
          <Link
            href={`/garments?profileId=${encodeURIComponent(profile.id)}`}
            className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--foreground)]"
          >
            <span className="font-medium text-[var(--foreground)]">{profile.profile_name}</span>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {bodyShape.primary_shape?.replace(/_/g, " ")} · {profile.units}
              {derived.derived_vertical_balance ? ` · ${derived.derived_vertical_balance.replace(/_/g, " ")}` : ""}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
