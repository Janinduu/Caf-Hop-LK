"use client";

import { motion } from "framer-motion";
import { BookmarkCheck, Check, Heart, MapPin } from "lucide-react";
import type { Cafe, CafeUserData } from "@/types/cafe";
import { TagPill } from "./TagPill";
import { Highlight } from "./Highlight";

interface Props {
  cafe: Cafe;
  userData?: CafeUserData;
  searchQuery: string;
  onOpen: (cafe: Cafe) => void;
  onQuickFavorite: (cafe: Cafe) => void;
}

export function CafeCard({
  cafe,
  userData,
  searchQuery,
  onOpen,
  onQuickFavorite,
}: Props) {
  const isFav = userData?.isFavorite ?? false;
  const status = userData?.status;
  const displayedTags = cafe.tags.slice(0, 3);
  const extraTagCount = cafe.tags.length - displayedTags.length;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(cafe);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(cafe)}
      onKeyDown={onKeyDown}
      className="group relative h-full w-full text-left glass rounded-2xl p-5 cursor-pointer hover:bg-card-hover hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 hover:border-primary/25 transition-all duration-200 animate-fade-in flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      {/* Quick-favorite button — top-right corner, always visible on touch, fade on hover for desktop */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          onQuickFavorite(cafe);
        }}
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
          isFav
            ? "bg-favorite/15 text-favorite opacity-100"
            : "bg-foreground/5 text-foreground/50 opacity-0 sm:opacity-0 group-hover:opacity-100 hover:bg-foreground/10 hover:text-foreground active:scale-95"
        } max-sm:opacity-100`}
      >
        <Heart
          size={16}
          strokeWidth={2}
          className={isFav ? "fill-favorite animate-pulse-once" : ""}
        />
      </motion.button>

      {/* Header: title + non-favorite status badges */}
      <div className="flex items-start justify-between gap-2 min-h-[3.25rem] pr-10">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground-soft leading-snug line-clamp-2 group-hover:text-primary-hover transition-colors">
            <Highlight text={cafe.name} query={searchQuery} />
          </h3>
          <p className="text-xs text-muted mt-1 flex items-center gap-1">
            <MapPin size={11} strokeWidth={2} className="shrink-0" />
            <span className="truncate">
              <Highlight text={cafe.area} query={searchQuery} /> · {cafe.district}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 absolute right-3 top-14">
          {status === "visited" && (
            <span title="Visited" className="text-visited">
              <Check size={14} strokeWidth={2.5} />
            </span>
          )}
          {status === "want-to-visit" && (
            <span title="Want to visit" className="text-want">
              <BookmarkCheck size={14} strokeWidth={2.25} />
            </span>
          )}
        </div>
      </div>

      {/* Tags row */}
      <div className="mt-3 flex flex-nowrap gap-1 overflow-hidden h-6 items-center">
        {displayedTags.map((t) => (
          <TagPill key={t} tag={t} size="xs" />
        ))}
        {extraTagCount > 0 && (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] text-muted shrink-0">
            +{extraTagCount}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-foreground/75 line-clamp-3 leading-relaxed min-h-[3.9rem]">
        {cafe.description}
      </p>

      {/* Maps link */}
      <div className="mt-auto pt-3">
        <a
          href={cafe.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition group/link"
        >
          <MapPin
            size={12}
            strokeWidth={2}
            className="transition-transform group-hover/link:-translate-y-0.5"
          />
          Open in Google Maps
          <span className="transition-transform group-hover/link:translate-x-0.5">→</span>
        </a>
      </div>
    </div>
  );
}
