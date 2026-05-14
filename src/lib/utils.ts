import type { Cafe } from "@/types/cafe";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface RawCafe {
  name: string;
  district: string;
  area: string;
  tags: Cafe["tags"];
  description: string;
  googleMapsUrl: string;
}

export function loadCafes(raw: RawCafe[]): Cafe[] {
  const seen = new Map<string, number>();
  return raw.map((r) => {
    const base = slugify(r.name);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    return { id, ...r };
  });
}

/**
 * Given a city name from geolocation, resolve which dataset district it belongs to.
 * Returns null if no plausible district matches (e.g. "Kandy" when we have no Kandy cafes).
 */
export function resolveDistrictFromCity(
  city: string,
  cafes: Cafe[],
): string | null {
  const lower = city.toLowerCase().trim();
  if (!lower || lower === "sri lanka") return null;

  // 1) City name IS a district we have
  const directDistrict = cafes.find(
    (c) => c.district.toLowerCase() === lower,
  );
  if (directDistrict) return directDistrict.district;

  // 2) City matches an area exactly (e.g. "Weligama" → district "Matara")
  const areaExact = cafes.find((c) => c.area.toLowerCase() === lower);
  if (areaExact) return areaExact.district;

  // 3) City is a substring of an area (or vice-versa) — e.g. "Galle Fort" / "Galle"
  const areaPartial = cafes.find((c) => {
    const a = c.area.toLowerCase();
    return a.includes(lower) || lower.includes(a);
  });
  if (areaPartial) return areaPartial.district;

  // 4) City contains a district name we have (e.g. "Colombo 03" → "Colombo")
  const containsDistrict = cafes.find((c) =>
    lower.includes(c.district.toLowerCase()),
  );
  if (containsDistrict) return containsDistrict.district;

  return null;
}
