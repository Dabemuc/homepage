import { useEffect, useState } from "react";
import { registerVisit } from "@/lib/api";

const STORAGE_KEY = "qsl-visitor-number";

// Shared across mounts so StrictMode's double effect doesn't register two visits
let pending: Promise<number | null> | null = null;

function readStored(): number | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const n = stored ? parseInt(stored) : NaN;
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

/** The visitor's QSL number: assigned once per browser on the first visit, then reused. */
export function useVisitorNumber(): number | null {
  const [number, setNumber] = useState<number | null>(readStored);

  useEffect(() => {
    if (number !== null) return;
    pending ??= registerVisit()
      .then((n) => {
        if (n !== null) {
          try {
            localStorage.setItem(STORAGE_KEY, String(n));
          } catch {
            // Storage blocked (e.g. private mode) — show the number for this visit only
          }
        }
        return n;
      })
      .catch(() => null);
    let cancelled = false;
    pending.then((n) => {
      if (!cancelled) setNumber(n);
    });
    return () => {
      cancelled = true;
    };
  }, [number]);

  return number;
}
