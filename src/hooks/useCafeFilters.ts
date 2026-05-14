"use client";

import { useMemo } from "react";
import type {
  Cafe,
  SortOption,
  StatusFilter,
  TagId,
  UserCafeData,
} from "@/types/cafe";

interface FilterArgs {
  cafes: Cafe[];
  district: string;
  search: string;
  tags: TagId[];
  status: StatusFilter;
  sort: SortOption;
  userData: UserCafeData;
}

function matchesStatus(
  cafeId: string,
  filter: StatusFilter,
  userData: UserCafeData,
): boolean {
  if (filter === "all") return true;
  const entry = userData[cafeId];
  if (filter === "favorites") return entry?.isFavorite === true;
  if (filter === "visited") return entry?.status === "visited";
  if (filter === "want-to-visit") return entry?.status === "want-to-visit";
  if (filter === "not-visited") return !entry || entry.status !== "visited";
  return true;
}

function filterCafes({
  cafes,
  district,
  search,
  tags,
  status,
  userData,
}: Omit<FilterArgs, "sort">): Cafe[] {
  const q = search.trim().toLowerCase();
  return cafes.filter((cafe) => {
    if (district !== "all" && cafe.district !== district) return false;
    if (q) {
      const hay = `${cafe.name} ${cafe.area}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (tags.length > 0 && !tags.some((t) => cafe.tags.includes(t))) {
      return false;
    }
    if (!matchesStatus(cafe.id, status, userData)) return false;
    return true;
  });
}

export function useFilteredCafes({
  cafes,
  district,
  search,
  tags,
  status,
  sort,
  userData,
}: FilterArgs): Cafe[] {
  return useMemo(() => {
    const filtered = filterCafes({ cafes, district, search, tags, status, userData });

    const sorted = [...filtered];
    if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "district") {
      sorted.sort((a, b) => {
        const d = a.district.localeCompare(b.district);
        return d !== 0 ? d : a.name.localeCompare(b.name);
      });
    } else if (sort === "recent") {
      sorted.sort((a, b) => {
        const ta = userData[a.id]?.updatedAt ?? "";
        const tb = userData[b.id]?.updatedAt ?? "";
        if (ta && tb) return tb.localeCompare(ta);
        if (ta) return -1;
        if (tb) return 1;
        return a.name.localeCompare(b.name);
      });
    }
    return sorted;
  }, [cafes, district, search, tags, status, sort, userData]);
}

export function getDistrictCounts(cafes: Cafe[]): Record<string, number> {
  return cafes.reduce<Record<string, number>>((acc, c) => {
    acc[c.district] = (acc[c.district] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * For each tag, how many cafes the filtered list would contain if that tag
 * were toggled (added if absent, removed if present). Search, district, and
 * status filters are kept as-is.
 */
export function useTagCounts({
  cafes,
  district,
  search,
  tags,
  status,
  userData,
}: Omit<FilterArgs, "sort">): Record<TagId, number> {
  return useMemo(() => {
    const allTagIds = new Set<TagId>();
    cafes.forEach((c) => c.tags.forEach((t) => allTagIds.add(t)));
    const result = {} as Record<TagId, number>;
    allTagIds.forEach((t) => {
      const next = tags.includes(t)
        ? tags.filter((x) => x !== t)
        : [...tags, t];
      result[t] = filterCafes({
        cafes,
        district,
        search,
        tags: next,
        status,
        userData,
      }).length;
    });
    return result;
  }, [cafes, district, search, tags, status, userData]);
}

/**
 * Suggests the single filter removal that yields the most additional cafes.
 * Returns null if no removable filter helps (i.e. removing nothing matters).
 */
export interface RemovalSuggestion {
  kind: "search" | "district" | "status" | "tag";
  label: string;
  count: number;
  apply: () => void;
}

export function computeBestRemoval({
  cafes,
  district,
  search,
  tags,
  status,
  userData,
  setters,
}: Omit<FilterArgs, "sort"> & {
  setters: {
    clearSearch: () => void;
    clearDistrict: () => void;
    clearStatus: () => void;
    removeTag: (t: TagId) => void;
  };
}): RemovalSuggestion | null {
  const trials: RemovalSuggestion[] = [];
  if (search.trim()) {
    const count = filterCafes({
      cafes,
      district,
      search: "",
      tags,
      status,
      userData,
    }).length;
    trials.push({
      kind: "search",
      label: `"${search.trim()}"`,
      count,
      apply: setters.clearSearch,
    });
  }
  if (district !== "all") {
    const count = filterCafes({
      cafes,
      district: "all",
      search,
      tags,
      status,
      userData,
    }).length;
    trials.push({
      kind: "district",
      label: district,
      count,
      apply: setters.clearDistrict,
    });
  }
  if (status !== "all") {
    const count = filterCafes({
      cafes,
      district,
      search,
      tags,
      status: "all",
      userData,
    }).length;
    trials.push({
      kind: "status",
      label: status,
      count,
      apply: setters.clearStatus,
    });
  }
  tags.forEach((t) => {
    const next = tags.filter((x) => x !== t);
    const count = filterCafes({
      cafes,
      district,
      search,
      tags: next,
      status,
      userData,
    }).length;
    trials.push({
      kind: "tag",
      label: t,
      count,
      apply: () => setters.removeTag(t),
    });
  });
  const positive = trials.filter((t) => t.count > 0);
  if (positive.length === 0) return null;
  positive.sort((a, b) => b.count - a.count);
  return positive[0];
}
