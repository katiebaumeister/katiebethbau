/**
 * Client-side measurement profile storage (localStorage).
 * Use from browser only; no SSR.
 */

import type {
  MeasurementProfile,
  MeasurementProfileDerived,
  BodyShapeProfile,
} from "./fitTypes";

const STORAGE_KEY = "ff_measurement_profiles";

export interface StoredProfile {
  profile: MeasurementProfile;
  derived: MeasurementProfileDerived;
  bodyShape: BodyShapeProfile;
}

export function loadStoredProfiles(): StoredProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProfiles(profiles: StoredProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch {
    // ignore
  }
}

export function addStoredProfile(item: StoredProfile): void {
  const list = loadStoredProfiles();
  list.push(item);
  saveStoredProfiles(list);
}

export function getStoredProfileById(profileId: string): StoredProfile | undefined {
  return loadStoredProfiles().find((p) => p.profile.id === profileId);
}
