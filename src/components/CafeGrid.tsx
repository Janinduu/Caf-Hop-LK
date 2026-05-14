"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Cafe, UserCafeData } from "@/types/cafe";
import { CafeCard } from "./CafeCard";
import { SmartEmptyState } from "./SmartEmptyState";
import type { RemovalSuggestion } from "@/hooks/useCafeFilters";

interface Props {
  cafes: Cafe[];
  userData: UserCafeData;
  searchQuery: string;
  emptySuggestion: RemovalSuggestion | null;
  onClearAll: () => void;
  onOpen: (cafe: Cafe) => void;
  onQuickFavorite: (cafe: Cafe) => void;
}

export function CafeGrid({
  cafes,
  userData,
  searchQuery,
  emptySuggestion,
  onClearAll,
  onOpen,
  onQuickFavorite,
}: Props) {
  if (cafes.length === 0) {
    return (
      <SmartEmptyState
        suggestion={emptySuggestion}
        onClearAll={onClearAll}
      />
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <AnimatePresence mode="popLayout">
        {cafes.map((c, i) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.28,
              delay: Math.min(i * 0.02, 0.3),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="h-full"
          >
            <CafeCard
              cafe={c}
              userData={userData[c.id]}
              searchQuery={searchQuery}
              onOpen={onOpen}
              onQuickFavorite={onQuickFavorite}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
