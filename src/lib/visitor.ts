import { useEffect, useState } from "react";
import { registerVisit } from "@/lib/api";

// One registration per page load, shared across mounts so StrictMode's double effect doesn't count twice
let pending: Promise<number | null> | null = null;

/** The QSL number for this visit: every page load counts as a new visit, nothing is stored in the browser. */
export function useVisitorNumber(): number | null {
  const [number, setNumber] = useState<number | null>(null);

  useEffect(() => {
    pending ??= registerVisit().catch(() => null);
    let cancelled = false;
    pending.then((n) => {
      if (!cancelled) setNumber(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return number;
}
