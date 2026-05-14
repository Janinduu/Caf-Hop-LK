"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, MapPin } from "lucide-react";

interface Props {
  districts: Array<{ name: string; count: number }>;
  selected: string;
  onChange: (district: string) => void;
  total: number;
}

interface Option {
  value: string;
  label: string;
  count: number;
}

export function DistrictSelector({
  districts,
  selected,
  onChange,
  total,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options: Option[] = useMemo(
    () => [
      { value: "all", label: "Across Sri Lanka", count: total },
      ...districts.map((d) => ({ value: d.name, label: d.name, count: d.count })),
    ],
    [districts, total],
  );

  const selectedOption =
    options.find((o) => o.value === selected) ?? options[0];

  // Reset highlight to current selection each time the dropdown opens
  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => o.value === selected);
    setHighlighted(idx < 0 ? 0 : idx);
  }, [open, options, selected]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(options.length - 1, i + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        setHighlighted(0);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        setHighlighted(options.length - 1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const o = options[highlighted];
        if (o) {
          onChange(o.value);
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, options, highlighted, onChange]);

  const handleSelect = (value: string) => {
    onChange(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="relative inline-block w-full sm:w-auto"
      style={{ isolation: "isolate" }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full sm:w-auto inline-flex items-center gap-2 rounded-full glass pl-4 pr-3 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 transition cursor-pointer hover:bg-card-hover sm:min-w-[14rem]"
      >
        <MapPin size={16} strokeWidth={1.75} className="text-primary shrink-0" />
        <span className="flex-1 text-left truncate">
          {selectedOption.label}{" "}
          <span className="text-muted">· {selectedOption.count}</span>
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`text-muted shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Filter by district"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[70] top-full mt-2 left-0 min-w-full sm:min-w-[16rem] bg-card-solid/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-foreground/15 border border-foreground/10 py-1.5 max-h-[60vh] overflow-y-auto"
          >
            {options.map((o, i) => {
              const isSelected = o.value === selected;
              const isHighlighted = i === highlighted;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => handleSelect(o.value)}
                  className={`mx-1.5 my-0.5 px-3 py-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer text-sm transition-colors ${
                    isHighlighted
                      ? "bg-foreground/10 text-foreground"
                      : "text-foreground-soft hover:bg-foreground/5"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 truncate">
                    {isSelected ? (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className="text-primary shrink-0"
                      />
                    ) : (
                      <span className="w-[14px] shrink-0" />
                    )}
                    <span
                      className={`truncate ${
                        isSelected ? "font-semibold text-foreground" : ""
                      }`}
                    >
                      {o.label}
                    </span>
                  </span>
                  <span
                    className={`text-xs shrink-0 ${
                      isSelected ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {o.count}
                  </span>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
