"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { TAG_DEFINITIONS, TAG_ICONS } from "@/lib/constants";
import type { TagId } from "@/types/cafe";

interface Props {
  selected: TagId[];
  counts: Record<TagId, number>;
  onToggle: (tag: TagId) => void;
  onClear: () => void;
}

const MOBILE_VISIBLE_COUNT = 5;

export function TagFilter({ selected, counts, onToggle, onClear }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = TAG_DEFINITIONS.length - MOBILE_VISIBLE_COUNT;
  const activeHiddenCount = selected.filter(
    (id) =>
      TAG_DEFINITIONS.findIndex((t) => t.id === id) >= MOBILE_VISIBLE_COUNT,
  ).length;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {selected.length > 0 && (
        <motion.button
          type="button"
          onClick={onClear}
          whileTap={{ scale: 0.92 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="group inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-card-hover transition-colors"
        >
          <X
            size={12}
            strokeWidth={2}
            className="transition-transform group-hover:rotate-90"
          />
          <span>Clear ({selected.length})</span>
        </motion.button>
      )}

      {TAG_DEFINITIONS.map((t, i) => {
        const Icon = TAG_ICONS[t.id];
        const active = selected.includes(t.id);
        const hiddenOnMobile = i >= MOBILE_VISIBLE_COUNT && !expanded;
        const count = counts[t.id] ?? 0;
        const wouldBeEmpty = count === 0;
        const isDisabled = !active && wouldBeEmpty;

        const style = active
          ? {
              backgroundColor: t.color,
              color: "#fff",
              borderColor: t.color,
            }
          : isDisabled
          ? {
              backgroundColor: `${t.color}0a`,
              color: `${t.color}80`,
              borderColor: `${t.color}1a`,
            }
          : {
              backgroundColor: `${t.color}14`,
              color: t.color,
              borderColor: `${t.color}33`,
            };

        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            whileTap={{ scale: 0.92 }}
            disabled={isDisabled}
            title={
              active
                ? `Click to remove — ${count} cafes would remain`
                : wouldBeEmpty
                ? "No matches with this added"
                : `Click to add — ${count} cafes would match`
            }
            style={style}
            className={`group rounded-full px-3 py-1.5 text-xs font-medium border transition-colors duration-200 ${
              hiddenOnMobile ? "hidden sm:inline-flex" : "inline-flex"
            } items-center gap-1.5 ${
              isDisabled ? "cursor-not-allowed" : "hover:shadow-sm"
            } ${active ? "shadow-sm" : ""}`}
          >
            <motion.span
              animate={active ? { scale: 1.1, rotate: 0 } : { scale: 1, rotate: 0 }}
              whileHover={!active && !isDisabled ? { scale: 1.15, rotate: -6 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex"
            >
              <Icon size={14} strokeWidth={1.75} className="shrink-0" />
            </motion.span>
            <span>{t.label}</span>
            <span
              className="text-[10px] font-semibold"
              style={{ opacity: active ? 0.8 : 0.6 }}
            >
              {count}
            </span>
          </motion.button>
        );
      })}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="sm:hidden inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-card-hover transition-colors"
      >
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        <span>
          {expanded
            ? "Less"
            : `+${hiddenCount} more${
                activeHiddenCount > 0 ? ` (${activeHiddenCount} active)` : ""
              }`}
        </span>
      </button>
    </div>
  );
}
