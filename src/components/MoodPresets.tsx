"use client";

import { motion } from "framer-motion";
import { MOOD_PRESETS } from "@/lib/constants";
import type { TagId } from "@/types/cafe";

interface Props {
  selectedTags: TagId[];
  onApply: (tags: TagId[]) => void;
}

function sameSet(a: TagId[], b: TagId[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((t) => setA.has(t));
}

export function MoodPresets({ selectedTags, onApply }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {MOOD_PRESETS.map((preset) => {
        const active = sameSet(selectedTags, preset.tags);
        const Icon = preset.Icon;
        return (
          <motion.button
            key={preset.id}
            type="button"
            onClick={() => onApply(active ? [] : preset.tags)}
            whileTap={{ scale: 0.93 }}
            className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors duration-200 ${
              active
                ? "bg-primary text-background border-primary shadow-sm shadow-primary/15"
                : "glass text-foreground hover:bg-card-hover"
            }`}
            title={`Applies: ${preset.tags.join(", ")}`}
          >
            <motion.span
              animate={active ? { rotate: 0, scale: 1.1 } : { rotate: 0, scale: 1 }}
              whileHover={{ rotate: -8, scale: 1.15 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
              className="inline-flex"
            >
              <Icon size={14} strokeWidth={1.75} />
            </motion.span>
            <span>{preset.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
