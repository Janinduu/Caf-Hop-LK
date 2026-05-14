"use client";

import { useEffect, useRef } from "react";
import type {
  SortOption,
  StatusFilter,
  TagId,
} from "@/types/cafe";

const VALID_STATUS: StatusFilter[] = [
  "all",
  "favorites",
  "visited",
  "want-to-visit",
  "not-visited",
];
const VALID_SORT: SortOption[] = ["name", "district", "recent"];

export interface UrlFilterState {
  search: string;
  district: string;
  tags: TagId[];
  status: StatusFilter;
  sort: SortOption;
}

export function readUrlFilterState(): UrlFilterState {
  if (typeof window === "undefined") {
    return { search: "", district: "all", tags: [], status: "all", sort: "name" };
  }
  const params = new URLSearchParams(window.location.search);
  const rawStatus = params.get("s") as StatusFilter | null;
  const rawSort = params.get("sort") as SortOption | null;
  return {
    search: params.get("q") ?? "",
    district: params.get("d") ?? "all",
    tags: (params.get("t") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean) as TagId[],
    status: rawStatus && VALID_STATUS.includes(rawStatus) ? rawStatus : "all",
    sort: rawSort && VALID_SORT.includes(rawSort) ? rawSort : "name",
  };
}

interface SyncOptions {
  state: UrlFilterState;
  ready: boolean;
}

export function useSyncUrlState({ state, ready }: SyncOptions) {
  const lastQuery = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!ready) return;
    const params = new URLSearchParams();
    if (state.search.trim()) params.set("q", state.search.trim());
    if (state.district !== "all") params.set("d", state.district);
    if (state.tags.length > 0) params.set("t", state.tags.join(","));
    if (state.status !== "all") params.set("s", state.status);
    if (state.sort !== "name") params.set("sort", state.sort);
    const qs = params.toString();
    if (qs === lastQuery.current) return;
    lastQuery.current = qs;
    const url = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [ready, state.search, state.district, state.tags, state.status, state.sort]);
}
