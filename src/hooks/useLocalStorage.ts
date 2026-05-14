"use client";

import { useCallback, useEffect, useState } from "react";
import type { CafeStatus, CafeUserData, UserCafeData } from "@/types/cafe";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";

const EMPTY: UserCafeData = {};

export function useUserCafeData() {
  const [data, setData] = useState<UserCafeData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as UserCafeData);
    } catch {
      // ignore parse / access errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota / access errors
    }
  }, [data, hydrated]);

  const updateEntry = useCallback(
    (cafeId: string, patch: Partial<Omit<CafeUserData, "updatedAt">>) => {
      setData((prev) => {
        const existing: CafeUserData = prev[cafeId] ?? {
          status: null,
          isFavorite: false,
          updatedAt: new Date().toISOString(),
        };
        const next: CafeUserData = {
          ...existing,
          ...patch,
          updatedAt: new Date().toISOString(),
        };
        if (!next.isFavorite && next.status === null) {
          const { [cafeId]: _removed, ...rest } = prev;
          void _removed;
          return rest;
        }
        return { ...prev, [cafeId]: next };
      });
    },
    [],
  );

  const setEntryDirect = useCallback(
    (cafeId: string, entry: CafeUserData | null) => {
      setData((prev) => {
        if (entry === null) {
          const { [cafeId]: _removed, ...rest } = prev;
          void _removed;
          return rest;
        }
        return { ...prev, [cafeId]: entry };
      });
    },
    [],
  );

  const toggleFavorite = useCallback(
    (cafeId: string) => {
      const current = data[cafeId]?.isFavorite ?? false;
      updateEntry(cafeId, { isFavorite: !current });
    },
    [data, updateEntry],
  );

  const setStatus = useCallback(
    (cafeId: string, status: CafeStatus) => {
      const current = data[cafeId]?.status ?? null;
      const next = current === status ? null : status;
      updateEntry(cafeId, { status: next });
    },
    [data, updateEntry],
  );

  return { data, hydrated, toggleFavorite, setStatus, setEntryDirect };
}
