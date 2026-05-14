"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  MapPin,
  MapPinOff,
  Moon,
  Sun,
  Sunrise,
  Sunset,
} from "lucide-react";
import { useTimeOfDay, type TimeOfDay } from "@/hooks/useTimeOfDay";
import type { LocationPermission } from "@/hooks/useNearestCity";

const ICONS: Record<TimeOfDay, typeof Sun> = {
  morning: Sunrise,
  midday: Sun,
  golden: Sunset,
  evening: Moon,
};

const LABELS: Record<TimeOfDay, string> = {
  morning: "Morning",
  midday: "Afternoon",
  golden: "Golden hour",
  evening: "Evening",
};

interface Props {
  city: string;
  permission: LocationPermission;
  onRequest: () => void;
}

export function LocationStatus({ city, permission, onRequest }: Props) {
  const tod = useTimeOfDay();
  if (!tod) return null;

  const Icon = ICONS[tod.timeOfDay];
  const showLocationChip =
    permission === "unknown" ||
    permission === "denied" ||
    permission === "requesting";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[11px] text-muted"
        title={`Local time in ${city} — ${tod.display}`}
      >
        <Icon size={11} strokeWidth={2} className="text-primary shrink-0" />
        <span className="truncate">
          {LABELS[tod.timeOfDay]} in {city}
          <span className="text-foreground/60"> · {tod.display}</span>
        </span>
      </motion.div>

      <AnimatePresence>
        {showLocationChip && (
          <LocationOptInChip permission={permission} onRequest={onRequest} />
        )}
      </AnimatePresence>
    </div>
  );
}

function LocationOptInChip({
  permission,
  onRequest,
}: {
  permission: LocationPermission;
  onRequest: () => void;
}) {
  const isLoading = permission === "requesting";
  const isDenied = permission === "denied";

  const label = isLoading
    ? "Locating…"
    : isDenied
    ? "Allow location"
    : "Use my location";

  const tooltip = isDenied
    ? "Location access was denied. Tap to try again — you'll need to allow it in the browser prompt."
    : "Show cafes near you in your district";

  return (
    <motion.button
      type="button"
      onClick={onRequest}
      disabled={isLoading}
      title={tooltip}
      initial={{ opacity: 0, y: -4, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
        isDenied
          ? "border-foreground/15 bg-card text-foreground/75 hover:text-foreground hover:border-foreground/30"
          : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/50"
      }`}
    >
      {isLoading ? (
        <Loader2
          size={11}
          strokeWidth={2.25}
          className="animate-spin shrink-0"
        />
      ) : isDenied ? (
        <MapPinOff size={11} strokeWidth={2} className="shrink-0" />
      ) : (
        <motion.span
          animate={{
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 1.8,
            repeat: 3,
            repeatDelay: 1.2,
            ease: "easeInOut",
          }}
          className="inline-flex shrink-0"
        >
          <MapPin size={11} strokeWidth={2} />
        </motion.span>
      )}
      <span>{label}</span>
    </motion.button>
  );
}
