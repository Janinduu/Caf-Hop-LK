"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  activeCount: number;
  onClick: () => void;
}

export function FilterTrigger({ activeCount, onClick }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      aria-label="Open filters"
      className="relative inline-flex items-center justify-center gap-2 rounded-full glass hover:bg-card-hover transition-colors py-3 px-4 text-sm font-medium text-foreground min-w-[5.5rem]"
    >
      <SlidersHorizontal size={15} strokeWidth={1.75} className="text-primary" />
      <span>Filters</span>
      {activeCount > 0 && (
        <motion.span
          key={activeCount}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-background text-[10px] font-bold flex items-center justify-center shadow-sm"
        >
          {activeCount}
        </motion.span>
      )}
    </motion.button>
  );
}
