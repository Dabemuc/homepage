import type { Intro } from "@/lib/api";

// Fixed copy for the "Last Transmission" homepage design (name/frequency/headline are defaults, editable on the admin Intro page).
export const STATION = {
  name: "Dabemuc/Portfolio",
  frequency: "147.300",
  qth: "Germany",
  operator: "Daniel",
  headline: ["Shipping", "beyond localhost"],
};

/** Station name + frequency from the intro, falling back to the defaults above. */
export function stationOf(intro: Intro | null) {
  return {
    name: intro?.station_name?.trim() || STATION.name,
    frequency: intro?.station_frequency?.trim() || STATION.frequency,
  };
}

/** Terminal lines for the hero build animation when the admin hasn't set any. */
export const DEFAULT_BUILD_LOG = [
  "$ cargo build --release",
  "Compiling antenna v0.3.1",
  "Compiling transmitter v1.4.7",
  "Finished release in 3.14s",
];

export function parseBuildLog(text: string | null | undefined): string[] {
  const lines = (text ?? "").split("\n").map((l) => l.trimEnd()).filter(Boolean);
  return lines.length > 0 ? lines : DEFAULT_BUILD_LOG;
}

/** Hero headline lines from the admin text (one line per row), falling back to the default. */
export function parseHeadline(text: string | null | undefined): string[] {
  const lines = (text ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 ? lines : STATION.headline;
}

/** Horizontal position (%) of each station on the tuner dial: evenly spaced, centered in equal slots. */
export function stationPosition(index: number, count: number): number {
  return ((index + 0.5) / count) * 100;
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
