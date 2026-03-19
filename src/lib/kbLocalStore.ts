export type UnitPreference = "in" | "cm";

export type MeasurementMap = Record<string, number | string | null>;

export type BodyFlags = {
  fullBust?: boolean;
  narrowShoulders?: boolean;
  broadShoulders?: boolean;
  longTorso?: boolean;
  shortTorso?: boolean;
  fullerHip?: boolean;
  swayBack?: boolean;
  forwardShoulder?: boolean;
};

export type KBProfile = {
  id: string;
  name: string;
  unit: UnitPreference;
  measurements: MeasurementMap;
  bodyFlags?: BodyFlags;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type SavedStyleRecord = {
  slug: string;
  savedAt: string;
};

export type RecentStyleRecord = {
  slug: string;
  viewedAt: string;
};

export type KBFitResult = {
  id: string;
  profileId: string;
  styleSlug: string;
  styleName?: string;
  createdAt: string;
  updatedAt: string;
  inputSnapshot: {
    measurements: Record<string, number | string | null>;
    bodyFlags?: Record<string, boolean | undefined>;
    unit: UnitPreference;
  };
  result: {
    baseSize?: string;
    fitNotes?: string[];
    adjustments?: string[];
    adjustmentDetails?: Array<{
      adjustment: string;
      reason: string;
      sewingEffect: string;
    }>;
    warnings?: string[];
    confidence?: "low" | "medium" | "high";
    confidenceNote?: string;
    fabricAdvice?: string[];
  };
};

const KEY_PROFILES = "kb_profiles";
const KEY_ACTIVE_PROFILE_ID = "kb_active_profile_id";
const KEY_SAVED_STYLES = "kb_saved_styles";
const KEY_RECENT_STYLES = "kb_recent_styles";
const KEY_FIT_RESULTS = "kb_fit_results";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch {
    return fallback;
  }
}

function readArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  const parsed = safeParse<unknown[]>(window.localStorage.getItem(key), []);
  return Array.isArray(parsed) ? (parsed as T[]) : [];
}

function writeArray<T>(key: string, value: T[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota and serialization errors in local-first mode.
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getProfiles(): KBProfile[] {
  const rows = readArray<KBProfile>(KEY_PROFILES);
  return rows
    .filter((p) => p && typeof p.id === "string" && typeof p.name === "string")
    .map((p) => ({
      ...p,
      unit: p.unit === "cm" ? "cm" : "in",
      measurements: p.measurements && typeof p.measurements === "object" ? p.measurements : {},
      createdAt: p.createdAt ?? nowIso(),
      updatedAt: p.updatedAt ?? nowIso(),
    }));
}

export function saveProfiles(profiles: KBProfile[]): void {
  writeArray(KEY_PROFILES, profiles);
}

export function getActiveProfileId(): string | null {
  if (!canUseStorage()) return null;
  const id = window.localStorage.getItem(KEY_ACTIVE_PROFILE_ID);
  return id && id.trim().length > 0 ? id : null;
}

export function setActiveProfileId(id: string | null): void {
  if (!canUseStorage()) return;
  if (!id) {
    window.localStorage.removeItem(KEY_ACTIVE_PROFILE_ID);
    return;
  }
  window.localStorage.setItem(KEY_ACTIVE_PROFILE_ID, id);
}

export function getActiveProfile(): KBProfile | null {
  const profiles = getProfiles();
  if (profiles.length === 0) return null;
  const activeId = getActiveProfileId();
  if (activeId) {
    const match = profiles.find((p) => p.id === activeId);
    if (match) return match;
  }
  const fallback = profiles[0];
  setActiveProfileId(fallback.id);
  return fallback;
}

export function upsertProfile(profile: Partial<KBProfile> & { id?: string; name: string }): KBProfile {
  const profiles = getProfiles();
  const existingIndex = profile.id ? profiles.findIndex((p) => p.id === profile.id) : -1;
  const timestamp = nowIso();

  const nextProfile: KBProfile = {
    id: profile.id ?? createId("prof"),
    name: profile.name,
    unit: profile.unit === "cm" ? "cm" : "in",
    measurements: profile.measurements ?? {},
    bodyFlags: profile.bodyFlags ?? {},
    notes: profile.notes ?? "",
    createdAt: existingIndex >= 0 ? profiles[existingIndex].createdAt : timestamp,
    updatedAt: timestamp,
  };

  if (existingIndex >= 0) {
    profiles[existingIndex] = nextProfile;
  } else {
    profiles.push(nextProfile);
  }

  saveProfiles(profiles);
  setActiveProfileId(nextProfile.id);
  return nextProfile;
}

export function deleteProfile(id: string): void {
  const profiles = getProfiles().filter((p) => p.id !== id);
  saveProfiles(profiles);
  const active = getActiveProfileId();
  if (active === id) {
    setActiveProfileId(profiles[0]?.id ?? null);
  }
}

export function getSavedStyles(): SavedStyleRecord[] {
  return readArray<SavedStyleRecord>(KEY_SAVED_STYLES).filter(
    (x) => x && typeof x.slug === "string" && typeof x.savedAt === "string"
  );
}

export function toggleSavedStyle(slug: string): SavedStyleRecord[] {
  const saved = getSavedStyles();
  const exists = saved.some((x) => x.slug === slug);
  const next = exists ? saved.filter((x) => x.slug !== slug) : [{ slug, savedAt: nowIso() }, ...saved];
  writeArray(KEY_SAVED_STYLES, next);
  return next;
}

export function getRecentStyles(): RecentStyleRecord[] {
  return readArray<RecentStyleRecord>(KEY_RECENT_STYLES).filter(
    (x) => x && typeof x.slug === "string" && typeof x.viewedAt === "string"
  );
}

export function pushRecentStyle(slug: string): RecentStyleRecord[] {
  const recent = getRecentStyles().filter((x) => x.slug !== slug);
  const next = [{ slug, viewedAt: nowIso() }, ...recent].slice(0, 24);
  writeArray(KEY_RECENT_STYLES, next);
  return next;
}

export function getFitResults(): KBFitResult[] {
  return readArray<KBFitResult>(KEY_FIT_RESULTS).filter(
    (x) => x && typeof x.id === "string" && typeof x.profileId === "string" && typeof x.styleSlug === "string"
  );
}

export function saveFitResults(results: KBFitResult[]): void {
  writeArray(KEY_FIT_RESULTS, results);
}

export function upsertFitResult(result: Omit<KBFitResult, "id" | "createdAt" | "updatedAt">): KBFitResult {
  const existing = getFitResults();
  const timestamp = nowIso();
  const index = existing.findIndex(
    (x) => x.profileId === result.profileId && x.styleSlug === result.styleSlug
  );
  const next: KBFitResult = {
    id: index >= 0 ? existing[index].id : createId("fit"),
    createdAt: index >= 0 ? existing[index].createdAt : timestamp,
    updatedAt: timestamp,
    ...result,
  };
  if (index >= 0) existing[index] = next;
  else existing.unshift(next);
  saveFitResults(existing);
  return next;
}

export function getFitResult(profileId: string, styleSlug: string): KBFitResult | null {
  return getFitResults().find((x) => x.profileId === profileId && x.styleSlug === styleSlug) ?? null;
}

