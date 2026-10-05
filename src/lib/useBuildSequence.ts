import { useEffect, useMemo, useState } from "react";

export type BuildState = {
  /** Lines typed so far (the last one may be partial) */
  typed: string[];
  /** 0–1 share of characters typed */
  progress: number;
  /** Build finished — the station is on air */
  live: boolean;
};

/**
 * Drives the hero "build" animation: types the log line by line, then flips to live.
 * `log` null means data isn't loaded yet (nothing starts); bump `run` to replay.
 */
export function useBuildSequence(log: string[] | null, run: number): BuildState {
  const total = useMemo(() => log?.reduce((n, line) => n + line.length, 0) ?? 0, [log]);
  const [count, setCount] = useState(0);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!log) return;
    setCount(0);
    setLive(false);

    if (total === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      setLive(true);
      return;
    }

    // Aim for ~2.6s of typing regardless of log length, with a short pause at each line end
    const perChar = Math.min(40, Math.max(12, 2600 / total));
    const lineEnds = new Set<number>();
    let acc = 0;
    for (const line of log) lineEnds.add((acc += line.length));

    let typed = 0;
    let timer: number;
    const tick = () => {
      typed += 1;
      setCount(typed);
      if (typed >= total) {
        timer = window.setTimeout(() => setLive(true), 500);
        return;
      }
      timer = window.setTimeout(tick, lineEnds.has(typed) ? 220 : perChar);
    };
    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
  }, [log, total, run]);

  const typed: string[] = [];
  if (log) {
    let remaining = count;
    for (const line of log) {
      if (remaining <= 0) break;
      typed.push(line.slice(0, remaining));
      remaining -= line.length;
    }
  }

  return { typed, progress: total ? count / total : live ? 1 : 0, live };
}
