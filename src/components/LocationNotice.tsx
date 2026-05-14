"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";

interface Props {
  district: string | null;
  matchCount: number;
  totalCount: number;
  onClose: () => void;
  onShowAll: () => void;
}

const AUTO_DISMISS_MS = 10_000;

export function LocationNotice({
  district,
  matchCount,
  totalCount,
  onClose,
  onShowAll,
}: Props) {
  useEffect(() => {
    if (!district) return;
    const id = window.setTimeout(onClose, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [district, onClose]);

  return (
    <AnimatePresence>
      {district && (
        <motion.div
          key={district}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          role="status"
          aria-live="polite"
          className="fixed top-3 left-3 z-[65] w-[calc(100vw-1.5rem)] sm:w-auto sm:max-w-sm"
        >
          <div className="glass-strong bg-card-solid/95 rounded-2xl shadow-2xl shadow-foreground/15 border border-foreground/10 p-4 flex items-start gap-3 relative overflow-hidden">
            {/* Progress bar — countdown indicator */}
            <motion.div
              key={`bar-${district}`}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
              style={{ transformOrigin: "left" }}
              className="absolute top-0 left-0 right-0 h-0.5 bg-primary/40"
            />

            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <MapPin size={18} strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-snug">
                Showing cafes near you
              </p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                We&apos;ve filtered to{" "}
                <strong className="text-foreground">{district}</strong> based on
                your location —{" "}
                <strong className="text-foreground">{matchCount}</strong>{" "}
                {matchCount === 1 ? "cafe" : "cafes"} found.
              </p>
              <button
                type="button"
                onClick={onShowAll}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-xs font-semibold hover:bg-primary transition-colors"
              >
                Show all {totalCount} cafes
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss"
              className="w-7 h-7 rounded-full text-muted hover:text-foreground hover:bg-foreground/8 transition flex items-center justify-center shrink-0 group"
            >
              <X
                size={14}
                strokeWidth={2}
                className="transition-transform group-hover:rotate-90"
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
