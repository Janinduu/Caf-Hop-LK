"use client";

import { motion } from "framer-motion";
import { BookmarkCheck, Check, Heart, LayoutGrid, MinusCircle } from "lucide-react";
import type { StatusFilter as StatusFilterValue } from "@/types/cafe";

const OPTIONS: Array<{
  id: StatusFilterValue;
  label: string;
  icon: typeof Heart;
  activeClass: string;
}> = [
  {
    id: "all",
    label: "All",
    icon: LayoutGrid,
    activeClass: "bg-foreground text-background border-foreground",
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Heart,
    activeClass: "bg-favorite/12 text-favorite border-favorite/40",
  },
  {
    id: "visited",
    label: "Visited",
    icon: Check,
    activeClass: "bg-visited/12 text-visited border-visited/40",
  },
  {
    id: "want-to-visit",
    label: "Want to Visit",
    icon: BookmarkCheck,
    activeClass: "bg-want/12 text-want border-want/40",
  },
  {
    id: "not-visited",
    label: "Not Visited",
    icon: MinusCircle,
    activeClass: "bg-foreground/8 text-foreground border-foreground/30",
  },
];

interface Props {
  selected: StatusFilterValue;
  onChange: (v: StatusFilterValue) => void;
}

export function StatusFilterBar({ selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = selected === o.id;
        return (
          <motion.button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            whileTap={{ scale: 0.92 }}
            className={`group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors duration-200 ${
              active
                ? o.activeClass
                : "glass text-foreground-soft hover:bg-card-hover hover:text-foreground"
            }`}
          >
            <motion.span
              animate={active ? { scale: 1.1 } : { scale: 1 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="inline-flex"
            >
              <Icon
                size={14}
                strokeWidth={1.75}
                className={`shrink-0 ${
                  active && o.id === "favorites" ? "fill-favorite" : ""
                }`}
              />
            </motion.span>
            <span>{o.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
