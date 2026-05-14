"use client";

import { useCallback, useEffect, useState } from "react";

interface City {
  name: string;
  lat: number;
  lon: number;
}

// Cafe-relevant locations across Sri Lanka — keep in sync with destinations in cafes.json
const SL_LOCATIONS: City[] = [
  { name: "Colombo", lat: 6.9271, lon: 79.8612 },
  { name: "Mount Lavinia", lat: 6.8389, lon: 79.8653 },
  { name: "Nugegoda", lat: 6.8718, lon: 79.8893 },
  { name: "Negombo", lat: 7.2083, lon: 79.8358 },
  { name: "Galle", lat: 6.0535, lon: 80.221 },
  { name: "Galle Fort", lat: 6.0252, lon: 80.2168 },
  { name: "Unawatuna", lat: 6.0103, lon: 80.2491 },
  { name: "Hikkaduwa", lat: 6.1395, lon: 80.1006 },
  { name: "Ahangama", lat: 5.974, lon: 80.37 },
  { name: "Weligama", lat: 5.9748, lon: 80.429 },
  { name: "Mirissa", lat: 5.9483, lon: 80.4717 },
  { name: "Matara", lat: 5.9485, lon: 80.5354 },
  { name: "Dickwella", lat: 5.9716, lon: 80.6963 },
  { name: "Hiriketiya", lat: 5.9667, lon: 80.7167 },
  { name: "Kandy", lat: 7.2906, lon: 80.6337 },
  { name: "Nuwara Eliya", lat: 6.9497, lon: 80.7891 },
  { name: "Ella", lat: 6.8675, lon: 81.0466 },
  { name: "Dambulla", lat: 7.8731, lon: 80.6519 },
  { name: "Sigiriya", lat: 7.9568, lon: 80.76 },
];

// Loose bounding box for Sri Lanka
const SL_BOUNDS = {
  minLat: 5.8,
  maxLat: 10.0,
  minLon: 79.4,
  maxLon: 82.1,
};

const MAX_SNAP_DISTANCE_KM = 60;
const STORAGE_KEY = "cafehop-location-consent";
const CITY_CACHE_KEY = "cafehop-location-city";

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function isInSriLanka(lat: number, lon: number): boolean {
  return (
    lat >= SL_BOUNDS.minLat &&
    lat <= SL_BOUNDS.maxLat &&
    lon >= SL_BOUNDS.minLon &&
    lon <= SL_BOUNDS.maxLon
  );
}

function findNearest(lat: number, lon: number): string {
  if (!isInSriLanka(lat, lon)) return "Sri Lanka";
  let nearest = SL_LOCATIONS[0];
  let minDist = haversineKm(lat, lon, nearest.lat, nearest.lon);
  for (const loc of SL_LOCATIONS) {
    const d = haversineKm(lat, lon, loc.lat, loc.lon);
    if (d < minDist) {
      minDist = d;
      nearest = loc;
    }
  }
  if (minDist > MAX_SNAP_DISTANCE_KM) return "Sri Lanka";
  return nearest.name;
}

export type LocationPermission =
  | "unknown" // default before user interacts
  | "requesting"
  | "granted"
  | "denied"
  | "unsupported";

export interface NearestCityState {
  city: string;
  permission: LocationPermission;
  request: () => void;
}

export function useNearestCity(): NearestCityState {
  const [city, setCity] = useState<string>("Colombo");
  const [permission, setPermission] = useState<LocationPermission>("unknown");

  const request = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!navigator.geolocation) {
      setPermission("unsupported");
      return;
    }
    setPermission("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const found = findNearest(pos.coords.latitude, pos.coords.longitude);
        setCity(found);
        setPermission("granted");
        try {
          localStorage.setItem(STORAGE_KEY, "granted");
          localStorage.setItem(CITY_CACHE_KEY, found);
        } catch {
          // ignore quota errors
        }
      },
      () => {
        setPermission("denied");
        try {
          localStorage.setItem(STORAGE_KEY, "denied");
        } catch {
          // ignore
        }
      },
      { enableHighAccuracy: false, maximumAge: 10 * 60 * 1000, timeout: 6000 },
    );
  }, []);

  // On mount: if user previously granted, restore cached city and quietly re-fetch
  useEffect(() => {
    if (typeof window === "undefined") return;
    let saved: string | null = null;
    let cachedCity: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
      cachedCity = localStorage.getItem(CITY_CACHE_KEY);
    } catch {
      // ignore
    }
    if (saved === "granted") {
      if (cachedCity) setCity(cachedCity);
      setPermission("granted");
      request();
    } else if (saved === "denied") {
      setPermission("denied");
    }
  }, [request]);

  return { city, permission, request };
}
