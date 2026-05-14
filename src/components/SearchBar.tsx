"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange }, ref) => {
    return (
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors pointer-events-none">
          <Search size={16} strokeWidth={2} />
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by cafe name or area..."
          className="w-full glass rounded-full pl-11 pr-11 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors p-1 rounded-full hover:bg-foreground/5"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
