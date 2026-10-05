import type { Intro } from "@/lib/api";

// Fixed copy for the "Last Transmission" homepage design (name/frequency are defaults, editable on the admin Intro page).
export const STATION = {
  name: "Station D",
  frequency: "147.300",
  qth: "Germany",
  operator: "Daniel",
  headline: ["This station", "is still building"],
};

/** Station name + frequency from the intro, falling back to the defaults above. */
export function stationOf(intro: Intro | null) {
  return {
    name: intro?.station_name?.trim() || STATION.name,
    frequency: intro?.station_frequency?.trim() || STATION.frequency,
  };
}

// Shared layout/typography classes
export const WRAP = "mx-auto w-full max-w-[1360px] px-4 md:px-10";
/** Roomier wrapper for the content sections (operator, broadcasts, log) */
export const SECTION_WRAP = "mx-auto w-full max-w-[1360px] px-6 md:px-16 xl:px-24";
export const LABEL = "text-[11px] tracking-[0.12em]";

/** "TX-004" style code for a project, counting up from the oldest (last) entry. */
export function txCode(n: number): string {
  return `TX-${String(n).padStart(3, "0")}`;
}

export function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/** Days elapsed since an ISO date (YYYY-MM-DD), or null if unset/invalid. */
export function daysOnAir(since: string | null | undefined): number | null {
  if (!since) return null;
  const start = Date.parse(since);
  if (Number.isNaN(start)) return null;
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}
