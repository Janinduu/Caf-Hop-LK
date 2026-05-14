"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eraser, SlidersHorizontal, X } from "lucide-react";
import type { StatusFilter, TagId } from "@/types/cafe";
import { MoodPresets } from "./MoodPresets";
import { StatusFilterBar } from "./StatusFilter";
import { TagFilter } from "./TagFilter";

interface Props {
  open: boolean;
  resultCount: number;
  activeCount: number;
  tags: TagId[];
  status: StatusFilter;
  tagCounts: Record<TagId, number>;
  onClose: () => void;
  onApplyMood: (tags: TagId[]) => void;
  onToggleTag: (t: TagId) => void;
  onClearTags: () => void;
  onChangeStatus: (s: StatusFilter) => void;
  onClearAll: () => void;
}

export function FilterDrawer({
  open,
  resultCount,
  activeCount,
  tags,
  status,
  tagCounts,
  onClose,
  onApplyMood,
  onToggleTag,
  onClearTags,
  onChangeStatus,
  onClearAll,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-foreground/30 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel — bottom sheet on mobile, right drawer on desktop */}
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Filter cafes"
            initial={{
              y: "100%",
              x: 0,
            }}
            animate={{ y: 0, x: 0 }}
            exit={{
              y: "100%",
              x: 0,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed z-[60] bottom-0 left-0 right-0 sm:left-auto sm:top-0 sm:right-0 sm:bottom-0 sm:w-[420px] bg-card-solid border border-foreground/10 sm:border-l rounded-t-3xl sm:rounded-none flex flex-col max-h-[88vh] sm:max-h-none shadow-2xl shadow-foreground/20"
            style={{
              // On desktop, override the y animation with x for right-side slide
            }}
          >
            <DrawerHeader activeCount={activeCount} onClose={onClose} />

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 flex flex-col gap-6">
              <DrawerSection
                title="Mood"
                hint="Quick filter combos for the moment"
              >
                <MoodPresets selectedTags={tags} onApply={onApplyMood} />
              </DrawerSection>

              <DrawerSection
                title="Status"
                hint="What you've marked on each cafe"
              >
                <StatusFilterBar
                  selected={status}
                  onChange={onChangeStatus}
                />
              </DrawerSection>

              <DrawerSection
                title="Vibe & Purpose"
                hint="Pick any that match — results stack"
              >
                <TagFilter
                  selected={tags}
                  counts={tagCounts}
                  onToggle={onToggleTag}
                  onClear={onClearTags}
                />
              </DrawerSection>
            </div>

            <DrawerFooter
              resultCount={resultCount}
              activeCount={activeCount}
              onClearAll={onClearAll}
              onClose={onClose}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerHeader({
  activeCount,
  onClose,
}: {
  activeCount: number;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-border">
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded-full bg-foreground/8 flex items-center justify-center text-primary">
          <SlidersHorizontal size={16} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground leading-tight">
            Filters
          </h2>
          <p className="text-[11px] text-muted leading-tight mt-0.5">
            {activeCount === 0
              ? "Nothing applied yet"
              : `${activeCount} filter${activeCount > 1 ? "s" : ""} active`}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close filters"
        className="w-9 h-9 rounded-full bg-foreground/8 hover:bg-foreground/15 text-foreground/70 hover:text-foreground transition flex items-center justify-center group"
      >
        <X
          size={16}
          strokeWidth={2}
          className="transition-transform group-hover:rotate-90"
        />
      </button>
    </div>
  );
}

function DrawerSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {hint && <p className="text-[11px] text-muted mt-0.5">{hint}</p>}
      </div>
      <div className="-mx-0.5">{children}</div>
    </section>
  );
}

function DrawerFooter({
  resultCount,
  activeCount,
  onClearAll,
  onClose,
}: {
  resultCount: number;
  activeCount: number;
  onClearAll: () => void;
  onClose: () => void;
}) {
  return (
    <div className="px-5 sm:px-6 py-4 border-t border-border bg-card-solid/95 backdrop-blur flex items-center gap-3">
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
        >
          <Eraser size={13} strokeWidth={2} />
          Clear all
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background font-semibold text-sm py-3 hover:bg-primary transition-colors shadow-sm"
      >
        Show {resultCount} {resultCount === 1 ? "cafe" : "cafes"}
      </button>
    </div>
  );
}
