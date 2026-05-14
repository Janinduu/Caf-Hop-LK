"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Share2,
  X,
} from "lucide-react";
import type { Cafe, CafeUserData } from "@/types/cafe";
import { TagPill } from "./TagPill";

interface Props {
  cafe: Cafe | null;
  userData?: CafeUserData;
  position?: { current: number; total: number };
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onToggleFavorite: (id: string) => void;
  onSetVisited: (id: string) => void;
  onSetWantToVisit: (id: string) => void;
  onShared?: (kind: "shared" | "copied" | "failed", cafeName: string) => void;
}

export function CafeDetailModal({
  cafe,
  userData,
  position,
  onClose,
  onPrev,
  onNext,
  onToggleFavorite,
  onSetVisited,
  onSetWantToVisit,
  onShared,
}: Props) {
  const handleShare = async () => {
    if (!cafe) return;
    const text = `${cafe.name}\n📍 ${cafe.area} · ${cafe.district}${
      cafe.description ? `\n\n${cafe.description}` : ""
    }\n\nOpen in Maps: ${cafe.googleMapsUrl}`;
    const shareData: ShareData = {
      title: `${cafe.name} — CaféHop LK`,
      text,
      url: cafe.googleMapsUrl,
    };
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share(shareData);
        onShared?.("shared", cafe.name);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          onShared?.("failed", cafe.name);
        }
      }
      return;
    }
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(text);
        onShared?.("copied", cafe.name);
      } catch {
        onShared?.("failed", cafe.name);
      }
      return;
    }
    onShared?.("failed", cafe.name);
  };

  useEffect(() => {
    if (!cafe) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cafe, onClose]);

  const isFav = userData?.isFavorite ?? false;
  const isVisited = userData?.status === "visited";
  const wantsToVisit = userData?.status === "want-to-visit";

  return (
    <AnimatePresence>
      {cafe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/30 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key={cafe.id}
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="relative w-full sm:max-w-lg glass-strong bg-card-solid/95 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev/Next desktop side buttons */}
            {onPrev && (
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous cafe"
                className="hidden sm:flex absolute top-1/2 -left-14 -translate-y-1/2 w-10 h-10 rounded-full glass-strong items-center justify-center text-foreground hover:bg-card-hover transition-colors"
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
            )}
            {onNext && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Next cafe"
                className="hidden sm:flex absolute top-1/2 -right-14 -translate-y-1/2 w-10 h-10 rounded-full glass-strong items-center justify-center text-foreground hover:bg-card-hover transition-colors"
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            )}

            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this cafe"
                title="Share this cafe"
                className="w-9 h-9 rounded-full bg-foreground/8 hover:bg-foreground/15 text-foreground/70 hover:text-primary transition flex items-center justify-center group"
              >
                <Share2
                  size={15}
                  strokeWidth={2}
                  className="transition-transform group-hover:scale-110"
                />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full bg-foreground/8 hover:bg-foreground/15 text-foreground/70 hover:text-foreground transition flex items-center justify-center group"
              >
                <X
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:rotate-90"
                />
              </button>
            </div>

            <div className="p-6 sm:p-7 flex flex-col gap-5">
              <div className="pr-20">
                {position && position.total > 1 && (
                  <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">
                    {position.current} of {position.total}
                  </p>
                )}
                <h2 className="text-2xl font-semibold text-foreground leading-tight">
                  {cafe.name}
                </h2>
                <p className="text-sm text-muted mt-1.5 inline-flex items-center gap-1">
                  <MapPin size={13} strokeWidth={2} />
                  {cafe.area} · {cafe.district}
                </p>
              </div>

              {cafe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {cafe.tags.map((t) => (
                    <TagPill key={t} tag={t} />
                  ))}
                </div>
              )}

              {cafe.description && (
                <p className="text-sm text-foreground-soft leading-relaxed">
                  {cafe.description}
                </p>
              )}

              <motion.a
                whileTap={{ scale: 0.97 }}
                href={cafe.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground hover:bg-primary text-background font-medium text-sm py-3 transition-colors shadow-sm hover:shadow-lg hover:shadow-foreground/15"
              >
                <MapPin
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                Open in Google Maps
              </motion.a>

              <div className="border-t border-border pt-4">
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    Save this cafe
                  </p>
                  <p className="text-[11px] text-muted">
                    Tap to add or remove
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatusButton
                    active={isVisited}
                    onClick={() => onSetVisited(cafe.id)}
                    Icon={Check}
                    label="Visited"
                    activeLabel="Visited"
                    inactiveLabel="Mark visited"
                    activeClass="bg-visited/15 text-visited border-visited/50 ring-1 ring-visited/30"
                    inactiveAccent="hover:text-visited hover:border-visited/40"
                  />
                  <StatusButton
                    active={wantsToVisit}
                    onClick={() => onSetWantToVisit(cafe.id)}
                    Icon={BookmarkCheck}
                    label="Want to Visit"
                    activeLabel="On your list"
                    inactiveLabel="Want to visit"
                    activeClass="bg-want/15 text-want border-want/50 ring-1 ring-want/30"
                    inactiveAccent="hover:text-want hover:border-want/40"
                  />
                  <StatusButton
                    active={isFav}
                    onClick={() => onToggleFavorite(cafe.id)}
                    Icon={Heart}
                    label="Favorite"
                    activeLabel="Favorite"
                    inactiveLabel="Add favorite"
                    activeClass="bg-favorite/15 text-favorite border-favorite/50 ring-1 ring-favorite/30"
                    inactiveAccent="hover:text-favorite hover:border-favorite/40"
                    fillWhenActive
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusButton({
  active,
  onClick,
  Icon,
  activeLabel,
  inactiveLabel,
  activeClass,
  inactiveAccent,
  fillWhenActive,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Heart;
  label: string;
  activeLabel: string;
  inactiveLabel: string;
  activeClass: string;
  inactiveAccent: string;
  fillWhenActive?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.94 }}
      title={active ? "Tap to remove" : "Tap to add"}
      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 py-3 px-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
        active
          ? activeClass + " shadow-sm"
          : `bg-card-solid/60 border-dashed border-foreground/20 text-foreground/65 hover:bg-card-hover hover:border-solid hover:shadow-md hover:shadow-foreground/10 ${inactiveAccent}`
      }`}
    >
      <motion.span
        animate={active ? { scale: 1.15 } : { scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 380, damping: 16 }}
        className="inline-flex"
      >
        <Icon
          size={22}
          strokeWidth={active ? 2 : 1.75}
          className={active && fillWhenActive ? "fill-favorite" : ""}
        />
      </motion.span>
      <span className="text-[11px] leading-tight">
        {active ? activeLabel : inactiveLabel}
      </span>
      {active && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-current flex items-center justify-center">
          <Check size={10} strokeWidth={3} className="text-background" />
        </span>
      )}
    </motion.button>
  );
}
