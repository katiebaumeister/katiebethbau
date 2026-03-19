"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteProfile as deleteProfileInStore,
  getActiveProfileId as readActiveProfileId,
  getProfiles,
  setActiveProfileId as writeActiveProfileId,
  upsertProfile as upsertProfileInStore,
  type KBProfile,
} from "@/src/lib/kbLocalStore";

export function useKBProfiles() {
  const [profiles, setProfiles] = useState<KBProfile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const nextProfiles = getProfiles();
    setProfiles(nextProfiles);
    setActiveProfileIdState(readActiveProfileId());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setActiveProfileId = useCallback(
    (id: string | null) => {
      writeActiveProfileId(id);
      setActiveProfileIdState(id);
    },
    []
  );

  const upsertProfile = useCallback(
    (profile: Partial<KBProfile> & { id?: string; name: string }) => {
      const saved = upsertProfileInStore(profile);
      refresh();
      return saved;
    },
    [refresh]
  );

  const deleteProfile = useCallback(
    (id: string) => {
      deleteProfileInStore(id);
      refresh();
    },
    [refresh]
  );

  const activeProfile = useMemo(() => {
    if (!profiles.length) return null;
    if (!activeProfileId) return profiles[0] ?? null;
    return profiles.find((p) => p.id === activeProfileId) ?? profiles[0] ?? null;
  }, [profiles, activeProfileId]);

  return {
    profiles,
    activeProfile,
    activeProfileId: activeProfile?.id ?? null,
    setActiveProfileId,
    upsertProfile,
    deleteProfile,
    refresh,
  };
}

