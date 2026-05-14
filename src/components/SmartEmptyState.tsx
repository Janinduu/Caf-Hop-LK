"use client";

import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { TAG_MAP } from "@/lib/constants";
import type { RemovalSuggestion } from "@/hooks/useCafeFilters";

const STATUS_LABELS: Record<string, string> = {
  favorites: "Favorites",
  visited: "Visited",
  "want-to-visit": "Want to Visit",
  "not-visited": "Not Visited",
};

interface Props {
  suggestion: RemovalSuggestion | null;
  onClearAll: () => void;
}

function labelFor(s: RemovalSuggestion): string {
  if (s.kind === "tag") return TAG_MAP[s.label as keyof typeof TAG_MAP]?.label ?? s.label;
  if (s.kind === "status") return STATUS_LABELS[s.label] ?? s.label;
  return s.label;
}

export function SmartEmptyState({ suggestion, onClearAll }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4 flex flex-col items-center gap-3"
    >
      <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-muted">
        <Sparkles size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-base font-semibold text-foreground">No cafes match</p>
        <p className="text-sm text-muted mt-1">
          Your current filters don&apos;t leave anything to show.
        </p>
      </div>
      {suggestion ? (
        <button
          type="button"
          onClick={suggestion.apply}
          className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-primary transition-colors mt-2"
        >
          <span>
            Remove{" "}
            <span className="underline decoration-background/50 underline-offset-2">
              {labelFor(suggestion)}
            </span>{" "}
            to see {suggestion.count} more
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-primary transition-colors mt-2"
        >
          <X size={14} strokeWidth={2} />
          Clear all filters
        </button>
      )}
    </motion.div>
  );
}
