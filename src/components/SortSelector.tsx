"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import type { SortOption } from "@/types/cafe";

interface Props {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

export function SortSelector({ value, onChange }: Props) {
  return (
    <label className="relative inline-flex items-center w-full sm:w-auto">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none z-10">
        <ArrowUpDown size={16} strokeWidth={1.75} />
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort"
        className="w-full sm:w-auto appearance-none glass rounded-full pl-10 pr-10 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition cursor-pointer hover:bg-card-hover"
      >
        <option value="name">Sort: Name A–Z</option>
        <option value="district">Sort: District</option>
        <option value="recent">Sort: Recent activity</option>
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
        <ChevronDown size={16} strokeWidth={1.75} />
      </span>
    </label>
  );
}
