"use client";

import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "midday" | "golden" | "evening";

export interface TimeOfDayData {
  timeOfDay: TimeOfDay;
  display: string; // e.g. "8:42 AM"
  hour: number; // 24-hour, 0-23
}

function readSLTime(): TimeOfDayData {
  const now = new Date();
  // 12-hour formatted display, in Asia/Colombo
  const fmt12 = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const display = fmt12.format(now);

  // 24-hour for slot calculation
  const fmt24 = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Colombo",
    hour: "numeric",
    hour12: false,
  });
  const hour = parseInt(fmt24.format(now), 10);
  return { hour, display, timeOfDay: slotFor(hour) };
}

function slotFor(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 10) return "morning";
  if (hour >= 10 && hour < 16) return "midday";
  if (hour >= 16 && hour < 19) return "golden";
  return "evening";
}

export function useTimeOfDay(): TimeOfDayData | null {
  // null until hydration completes (avoids SSR mismatch)
  const [data, setData] = useState<TimeOfDayData | null>(null);

  useEffect(() => {
    const update = () => setData(readSLTime());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return data;
}
