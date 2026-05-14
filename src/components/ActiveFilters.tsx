"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { TAG_ICONS, TAG_MAP } from "@/lib/constants";
import type { StatusFilter, TagId } from "@/types/cafe";

const STATUS_LABELS: Record<Exclude<StatusFilter, "all">, string> = {
  favorites: "Favorites",
  visited: "Visited",
  "want-to-visit": "Want to Visit",
  "not-visited": "Not Visited",
};

interface Props {
  search: string;
  district: string;
  tags: TagId[];
  status: StatusFilter;
  onClearSearch: () => void;
  onClearDistrict: () => void;
  onRemoveTag: (t: TagId) => void;
  onClearStatus: () => void;
  onClearAll: () => void;
}

interface Chip {
  key: string;
  label: React.ReactNode;
  onRemove: () => void;
  color?: string;
}

export function ActiveFilters({
  search,
  district,
  tags,
  status,
  onClearSearch,
  onClearDistrict,
  onRemoveTag,
  onClearStatus,
  onClearAll,
}: Props) {
  const chips: Chip[] = [];

  if (search.trim()) {
    chips.push({
      key: `search-${search}`,
      label: (
        <span className="inline-flex items-center gap-1">
          <Search size={11} strokeWidth={2} />
          <span>&ldquo;{search.trim()}&rdquo;</span>
        </span>
      ),
      onRemove: onClearSearch,
    });
  }
  if (district !== "all") {
    chips.push({
      key: `district-${district}`,
      label: <span>{district}</span>,
      onRemove: onClearDistrict,
    });
  }
  if (status !== "all") {
    chips.push({
      key: `status-${status}`,
      label: <span>{STATUS_LABELS[status]}</span>,
      onRemove: onClearStatus,
    });
  }
  tags.forEach((t) => {
    const def = TAG_MAP[t];
    const Icon = TAG_ICONS[t];
    if (!def) return;
    chips.push({
      key: `tag-${t}`,
      label: (
        <span className="inline-flex items-center gap-1">
          {Icon && <Icon size={11} strokeWidth={2} />}
          <span>{def.label}</span>
        </span>
      ),
      onRemove: () => onRemoveTag(t),
      color: def.color,
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted font-semibold mr-1">
        Active
      </span>
      <AnimatePresence mode="popLayout">
        {chips.map((c) => (
          <motion.button
            key={c.key}
            layout
            type="button"
            onClick={c.onRemove}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            style={
              c.color
                ? { backgroundColor: c.color, color: "#fff" }
                : { backgroundColor: "var(--foreground)", color: "var(--background)" }
            }
            className="group inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium hover:opacity-85 transition-opacity"
          >
            {c.label}
            <X
              size={11}
              strokeWidth={2.5}
              className="transition-transform group-hover:rotate-90"
            />
          </motion.button>
        ))}
      </AnimatePresence>
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-foreground transition-colors ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
