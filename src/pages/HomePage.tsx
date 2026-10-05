import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import BroadcastsSection from "@/components/sections/BroadcastsSection";
import LogSection from "@/components/sections/LogSection";
import OperatorSection from "@/components/sections/OperatorSection";
import RespondFooter from "@/components/sections/RespondFooter";
import { fetchHomepage } from "@/lib/api";
import type { HomepageData } from "@/lib/api";
import { STATION, WRAP, LABEL } from "@/lib/station";

export default function HomePage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchHomepage()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // The admin UI is dark; match the page canvas (overscroll areas) to this light design while mounted
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.backgroundColor;
    root.style.backgroundColor = "var(--color-tx-paper)";
    return () => {
      root.style.backgroundColor = prev;
    };
  }, []);

  const introVisible = data?.config.intro_visible !== "false";
  const intro = introVisible ? data?.intro ?? null : null;
  const showBroadcasts = !!data && data.config.projects_visible !== "false" && data.projects.length > 0;
  const showLog = !!data && data.config.career_visible !== "false" && data.career.length > 0;
  const showOperator = !!data && introVisible;

  const navLinks = [
    { id: "operator", label: "OPERATOR", show: showOperator },
    { id: "broadcasts", label: "BROADCASTS", show: showBroadcasts },
    { id: "log", label: "LOG", show: showLog },
    { id: "respond", label: "RESPOND", show: true },
  ].filter((l) => l.show);

  return (
    <div className="min-h-screen bg-tx-paper text-tx-ink font-station text-[13px] overflow-x-hidden">
      <header className={`${WRAP} ${LABEL} py-6 flex flex-wrap justify-between gap-5`}>
        <span className="uppercase">
          {STATION.name} — {STATION.frequency} MHZ
        </span>
        <nav className="flex flex-wrap gap-7">
          {navLinks.map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="text-tx-ink no-underline hover:text-tx-signal">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <Hero intro={intro} />

      {loading && (
        <div className={`${WRAP} ${LABEL} pb-24 text-tx-muted`}>
          <span className="motion-safe:animate-tx-blink">●</span> TUNING IN…
        </div>
      )}

      {error && (
        <div className={`${WRAP} pb-24 flex flex-col gap-2`}>
          <span className={`${LABEL} text-tx-signal font-bold`}>● NO SIGNAL</span>
          <span className="text-tx-muted">{error}</span>
        </div>
      )}

      {data && (
        <>
          {showOperator && <OperatorSection intro={intro} skills={data.skills ?? []} />}
          {showBroadcasts && <BroadcastsSection projects={data.projects} />}
          {showLog && <LogSection sections={data.career} />}
        </>
      )}

      <RespondFooter socials={data?.socials ?? []} name={data?.intro?.name ?? null} />
    </div>
  );
}
