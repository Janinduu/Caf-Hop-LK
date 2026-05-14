"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import rawCafes from "@/data/cafes.json";
import type {
  Cafe,
  CafeStatus,
  CafeUserData,
  SortOption,
  StatusFilter,
  TagId,
} from "@/types/cafe";
import { loadCafes, resolveDistrictFromCity } from "@/lib/utils";
import { useUserCafeData } from "@/hooks/useLocalStorage";
import {
  computeBestRemoval,
  getDistrictCounts,
  useFilteredCafes,
  useTagCounts,
} from "@/hooks/useCafeFilters";
import { readUrlFilterState, useSyncUrlState } from "@/hooks/useUrlState";
import { SearchBar } from "@/components/SearchBar";
import { DistrictSelector } from "@/components/DistrictSelector";
import { StatsBar } from "@/components/StatsBar";
import { CafeGrid } from "@/components/CafeGrid";
import { CafeDetailModal } from "@/components/CafeDetailModal";
import { ActiveFilters } from "@/components/ActiveFilters";
import { Toast, type ToastData } from "@/components/Toast";
import { LocationStatus } from "@/components/TimeOfDayPill";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useNearestCity, type LocationPermission } from "@/hooks/useNearestCity";
import { FilterDrawer } from "@/components/FilterDrawer";
import { FilterTrigger } from "@/components/FilterTrigger";
import { LocationNotice } from "@/components/LocationNotice";
import { CinematicHero } from "@/components/CinematicHero";

const CAFES: Cafe[] = loadCafes(rawCafes as Parameters<typeof loadCafes>[0]);

export default function Home() {
  const timeData = useTimeOfDay();
  const {
    city: nearestCity,
    permission: locationPermission,
    request: requestLocation,
  } = useNearestCity();
  const prevLocPermissionRef = useRef<LocationPermission>("unknown");
  const autoAppliedDistrictRef = useRef(false);
  const [urlHydrated, setUrlHydrated] = useState(false);
  const [district, setDistrict] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagId[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("name");
  const [openCafe, setOpenCafe] = useState<Cafe | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const skipIntro = useCallback(() => {
    mainContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const toastIdRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // One-shot URL hydration on client mount — keeps server/client first render identical
  useEffect(() => {
    if (urlHydrated) return;
    const init = readUrlFilterState();
    if (init.search) setSearch(init.search);
    if (init.district !== "all") setDistrict(init.district);
    if (init.tags.length) setTags(init.tags);
    if (init.status !== "all") setStatus(init.status);
    if (init.sort !== "name") setSort(init.sort);
    setUrlHydrated(true);
  }, [urlHydrated]);

  useSyncUrlState({ state: { search, district, tags, status, sort }, ready: urlHydrated });

  const {
    data: userData,
    toggleFavorite,
    setStatus: setCafeStatus,
    setEntryDirect,
  } = useUserCafeData();

  const districtCounts = useMemo(() => getDistrictCounts(CAFES), []);
  const districts = useMemo(
    () =>
      Object.entries(districtCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    [districtCounts],
  );

  const filtered = useFilteredCafes({
    cafes: CAFES,
    district,
    search,
    tags,
    status,
    sort,
    userData,
  });

  const tagCounts = useTagCounts({
    cafes: CAFES,
    district,
    search,
    tags,
    status,
    userData,
  });

  const visitedCount = useMemo(
    () => Object.values(userData).filter((u) => u.status === "visited").length,
    [userData],
  );
  const favoriteCount = useMemo(
    () => Object.values(userData).filter((u) => u.isFavorite).length,
    [userData],
  );

  const showToast = useCallback((data: Omit<ToastData, "id">) => {
    toastIdRef.current += 1;
    setToast({ ...data, id: toastIdRef.current });
  }, []);

  const toggleTag = (t: TagId) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const captureUndo = (cafeId: string): CafeUserData | null =>
    userData[cafeId] ?? null;

  const handleQuickFavorite = (cafe: Cafe) => {
    const prev = captureUndo(cafe.id);
    const wasFav = prev?.isFavorite ?? false;
    toggleFavorite(cafe.id);
    showToast({
      message: wasFav
        ? `Removed ${cafe.name} from favorites`
        : `Added ${cafe.name} to favorites`,
      icon: wasFav ? "🤍" : "❤️",
      undo: () => setEntryDirect(cafe.id, prev),
    });
  };

  const handleSetStatus = (cafeId: string, target: CafeStatus) => {
    const cafe = CAFES.find((c) => c.id === cafeId);
    if (!cafe) return;
    const prev = captureUndo(cafeId);
    const wasSame = prev?.status === target;
    setCafeStatus(cafeId, target);
    const label =
      target === "visited"
        ? wasSame
          ? `Unmarked ${cafe.name} as visited`
          : `Marked ${cafe.name} as visited`
        : wasSame
        ? `Removed ${cafe.name} from want-to-visit`
        : `Added ${cafe.name} to want-to-visit`;
    const icon = target === "visited" ? "✅" : "🚩";
    showToast({
      message: label,
      icon,
      undo: () => setEntryDirect(cafeId, prev),
    });
  };

  const handleModalToggleFavorite = (cafeId: string) => {
    const cafe = CAFES.find((c) => c.id === cafeId);
    if (!cafe) return;
    handleQuickFavorite(cafe);
  };

  const clearAllFilters = () => {
    setSearch("");
    setDistrict("all");
    setTags([]);
    setStatus("all");
  };

  // Active filter count (everything except sort)
  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (district !== "all" ? 1 : 0) +
    (status !== "all" ? 1 : 0) +
    tags.length;

  const hasActiveFilters = activeFilterCount > 0;

  // Active count specifically for what lives in the drawer (mood/status/vibe)
  const drawerActiveCount =
    (status !== "all" ? 1 : 0) + tags.length;

  // Modal prev/next
  const openIndex = openCafe
    ? filtered.findIndex((c) => c.id === openCafe.id)
    : -1;
  const modalPosition = openIndex >= 0 && filtered.length > 1
    ? { current: openIndex + 1, total: filtered.length }
    : undefined;

  const goPrev = useCallback(() => {
    if (openIndex < 0 || filtered.length < 2) return;
    const next = (openIndex - 1 + filtered.length) % filtered.length;
    setOpenCafe(filtered[next]);
  }, [openIndex, filtered]);

  const goNext = useCallback(() => {
    if (openIndex < 0 || filtered.length < 2) return;
    const next = (openIndex + 1) % filtered.length;
    setOpenCafe(filtered[next]);
  }, [openIndex, filtered]);

  const handleModalFavoriteFromKey = useCallback(() => {
    if (!openCafe) return;
    handleQuickFavorite(openCafe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openCafe]);

  const removalSuggestion = useMemo(
    () =>
      filtered.length === 0
        ? computeBestRemoval({
            cafes: CAFES,
            district,
            search,
            tags,
            status,
            userData,
            setters: {
              clearSearch: () => setSearch(""),
              clearDistrict: () => setDistrict("all"),
              clearStatus: () => setStatus("all"),
              removeTag: (t) => toggleTag(t),
            },
          })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered.length, district, search, tags, status, userData],
  );

  useEffect(() => {
    if (district !== "all" && !districts.some((d) => d.name === district)) {
      setDistrict("all");
    }
  }, [district, districts]);

  // Auto-apply district based on user's location — one-shot per session, only on a
  // fresh location result, and only if the user hasn't already set a district.
  useEffect(() => {
    const prev = prevLocPermissionRef.current;
    prevLocPermissionRef.current = locationPermission;

    // Trigger only on the requesting → granted transition (= fresh geolocation result)
    if (prev !== "requesting" || locationPermission !== "granted") return;
    if (autoAppliedDistrictRef.current) return;
    if (district !== "all") return; // user already chose a district

    const resolved = resolveDistrictFromCity(nearestCity, CAFES);
    if (!resolved) return;
    if (!districts.some((d) => d.name === resolved)) return;

    autoAppliedDistrictRef.current = true;
    setDistrict(resolved);
    setLocationNotice(resolved);
  }, [
    locationPermission,
    nearestCity,
    district,
    districts,
    showToast,
  ]);

  // Dismiss the location notice if the user navigates away from that district
  useEffect(() => {
    if (locationNotice && district !== locationNotice) {
      setLocationNotice(null);
    }
  }, [district, locationNotice]);

  return (
    <main
      className="flex-1 w-full relative"
      data-time={timeData?.timeOfDay ?? "midday"}
    >
      <CinematicHero onSkip={skipIntro} />

      {/* Soft transition from dark cinematic hero into light app */}
      <div
        aria-hidden="true"
        className="relative h-12 -mt-12 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10"
      />

      <div
        ref={mainContentRef}
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 sm:pt-3 pb-8 flex flex-col gap-4 sm:gap-5 bg-background"
      >
        <header className="flex flex-col items-center text-center gap-1">
          <LocationStatus
            city={nearestCity}
            permission={locationPermission}
            onRequest={requestLocation}
          />
        </header>

        {/* Sticky filter bar */}
        <div className="sticky top-0 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-2 bg-background/85 backdrop-blur-md z-30 transition-colors">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <SearchBar
                  ref={searchInputRef}
                  value={search}
                  onChange={setSearch}
                />
              </div>
              <div className="flex items-center gap-2">
                <DistrictSelector
                  districts={districts}
                  selected={district}
                  onChange={setDistrict}
                  total={CAFES.length}
                />
                <FilterTrigger
                  activeCount={drawerActiveCount}
                  onClick={() => setFiltersOpen(true)}
                />
              </div>
            </div>
            {hasActiveFilters && (
              <ActiveFilters
                search={search}
                district={district}
                tags={tags}
                status={status}
                onClearSearch={() => setSearch("")}
                onClearDistrict={() => setDistrict("all")}
                onRemoveTag={(t) => toggleTag(t)}
                onClearStatus={() => setStatus("all")}
                onClearAll={clearAllFilters}
              />
            )}
          </div>
        </div>

        <StatsBar
          shown={filtered.length}
          total={CAFES.length}
          visited={visitedCount}
          favorites={favoriteCount}
        />

        <CafeGrid
          cafes={filtered}
          userData={userData}
          searchQuery={search}
          emptySuggestion={removalSuggestion}
          onClearAll={clearAllFilters}
          onOpen={setOpenCafe}
          onQuickFavorite={handleQuickFavorite}
        />
      </div>

      <FilterDrawer
        open={filtersOpen}
        resultCount={filtered.length}
        activeCount={drawerActiveCount}
        tags={tags}
        status={status}
        tagCounts={tagCounts}
        onClose={() => setFiltersOpen(false)}
        onApplyMood={setTags}
        onToggleTag={toggleTag}
        onClearTags={() => setTags([])}
        onChangeStatus={setStatus}
        onClearAll={() => {
          setTags([]);
          setStatus("all");
        }}
      />

      <CafeDetailModal
        cafe={openCafe}
        userData={openCafe ? userData[openCafe.id] : undefined}
        position={modalPosition}
        onClose={() => setOpenCafe(null)}
        onPrev={filtered.length > 1 ? goPrev : undefined}
        onNext={filtered.length > 1 ? goNext : undefined}
        onToggleFavorite={handleModalToggleFavorite}
        onSetVisited={(id) => handleSetStatus(id, "visited")}
        onSetWantToVisit={(id) => handleSetStatus(id, "want-to-visit")}
        onShared={(kind, cafeName) => {
          if (kind === "shared") {
            showToast({ message: `Shared ${cafeName}`, icon: "📤" });
          } else if (kind === "copied") {
            showToast({ message: `Copied ${cafeName} to clipboard`, icon: "📋" });
          } else {
            showToast({ message: `Couldn't share — try again`, icon: "⚠️" });
          }
        }}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <LocationNotice
        district={locationNotice}
        matchCount={
          locationNotice
            ? CAFES.filter((c) => c.district === locationNotice).length
            : 0
        }
        totalCount={CAFES.length}
        onClose={() => setLocationNotice(null)}
        onShowAll={() => {
          setDistrict("all");
          setLocationNotice(null);
        }}
      />
    </main>
  );
}
