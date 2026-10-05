import { Fragment, useState } from "react";
import type { Intro } from "@/lib/api";
import { STATION, WRAP, LABEL, daysOnAir, stationPosition } from "@/lib/station";
import { useBuildSequence } from "@/lib/useBuildSequence";

type NavLink = { id: string; label: string };

type Props = {
  intro: Intro | null;
  station: { name: string; frequency: string };
  links: NavLink[];
  /** Terminal lines for the build animation; null until data has loaded */
  buildLog: string[] | null;
  /** Headline lines; null until data has loaded (the default holds the space invisibly, so nothing flashes) */
  headline: string[] | null;
};

// ── Scene geometry (viewBox 0 0 900 420, ground at y=420) ──
const MAST_X = 450;
const MAST_LEVELS = [420, 352.5, 285, 217.5, 150];
const halfWidth = (y: number) => 20 + ((y - 150) * 42) / 270;
const MAST_SEGMENTS = MAST_LEVELS.slice(0, -1).map((y0, i) => {
  const y1 = MAST_LEVELS[i + 1];
  const a = halfWidth(y0);
  const b = halfWidth(y1);
  return {
    legs: `M${MAST_X - a} ${y0} L${MAST_X - b} ${y1} M${MAST_X + a} ${y0} L${MAST_X + b} ${y1} M${MAST_X - b} ${y1} H${MAST_X + b}`,
    braces: `M${MAST_X - a} ${y0} L${MAST_X + b} ${y1} M${MAST_X + a} ${y0} L${MAST_X - b} ${y1}`,
  };
});
const zigzag = (x0: number, x1: number, yA: number, yB: number, step: number) => {
  let d = `M${x0} ${yA}`;
  for (let x = x0 + step, top = false; x <= x1; x += step, top = !top) d += ` L${x} ${top ? yA : yB}`;
  return d;
};
const towerBraces = (() => {
  let d = "M712 420";
  for (let y = 392, right = true; y >= 64; y -= 28, right = !right) d += ` L${right ? 740 : 712} ${y}`;
  return d;
})();

// Terminal box in scene units, mirrored by the HTML overlay
const TERM = { x: 60, y: 270, w: 270, h: 150 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export default function Hero({ intro, station, links, buildLog, headline }: Props) {
  const [run, setRun] = useState(0);
  const { typed, progress, live } = useBuildSequence(buildLog, run);
  const day = daysOnAir(intro?.on_air_since);
  const bar = Math.round(progress * 10);

  return (
    <section className="pb-20 md:pb-28">
      <div className="bg-tx-haze pt-[clamp(32px,6vw,72px)] overflow-hidden">
        <div className="@container relative mx-auto w-[min(900px,calc(100%-32px))] aspect-[900/420]">
          <svg viewBox="0 0 900 420" aria-hidden className="absolute inset-0 w-full h-full overflow-visible">
            {/* Signal rings once on air */}
            {live && (
              <g fill="none" className="stroke-tx-signal" strokeWidth="4">
                {[0, 0.8, 1.6].map((delay) => (
                  <circle
                    key={delay}
                    cx={MAST_X}
                    cy="94"
                    r="130"
                    className="[transform-box:fill-box] origin-center motion-safe:animate-tx-ring motion-reduce:hidden"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </g>
            )}

            {/* Crane: stays on site, the next </> segment always swaying on the hook */}
            <g className="stroke-tx-ink" fill="none" strokeWidth="3">
              <path d="M712 420 V64 M740 420 V64" strokeWidth="4" />
              <path d={towerBraces} />
              <path d="M540 46 H760 M540 64 H872" strokeWidth="4" />
              <path d={zigzag(540, 740, 46, 64, 20)} />
              <path d="M560 46 L726 14 L872 64 M726 14 V46" strokeWidth="2" />
            </g>
            <rect x="828" y="64" width="44" height="36" className="fill-tx-ink" />
            <rect x="742" y="64" width="28" height="22" className="fill-tx-ink" />
            <rect x="570" y="64" width="20" height="7" className="fill-tx-ink" />
            <g className="origin-[580px_70px] motion-safe:animate-tx-sway">
              <line x1="580" y1="70" x2="580" y2="168" className="stroke-tx-ink" strokeWidth="2" />
              <rect x="550" y="168" width="60" height="44" className="fill-tx-ink" />
              <text x="580" y="197" textAnchor="middle" className="fill-tx-paper font-station font-bold" fontSize="18">
                {"</>"}
              </text>
            </g>

            {/* Mast, assembled bottom-up as the build progresses */}
            <g className="stroke-tx-ink" fill="none" strokeLinecap="square">
              {MAST_SEGMENTS.map((seg, i) => {
                const built = live || progress > i / MAST_SEGMENTS.length;
                return (
                  <g
                    key={i}
                    className="transition-[opacity,transform] duration-500 ease-out"
                    style={{ opacity: built ? 1 : 0, transform: built ? "none" : "translateY(-14px)" }}
                  >
                    <path d={seg.legs} strokeWidth="7" />
                    <path d={seg.braces} strokeWidth="4" />
                  </g>
                );
              })}
            </g>
            <g className="transition-opacity duration-500" style={{ opacity: live ? 1 : 0 }}>
              <rect x={MAST_X - 3} y="100" width="6" height="50" className="fill-tx-ink" />
              <rect x={MAST_X - 9} y="85" width="18" height="18" className="fill-tx-signal motion-safe:animate-tx-blink" />
            </g>

            {/* Power cable from the terminal to the mast */}
            <path d="M330 392 C362 392 368 414 392 414" fill="none" className="stroke-tx-ink" strokeWidth="3" />
          </svg>

          {/* Terminal "shed" — HTML so the text stays crisp; sized in container units to scale with the scene */}
          <div
            className="absolute flex flex-col bg-tx-ink text-tx-paper font-station text-[max(7px,1.3cqw)] leading-[1.55] overflow-hidden"
            style={{ left: pct(TERM.x, 900), top: pct(TERM.y, 420), width: pct(TERM.w, 900), height: pct(TERM.h, 420) }}
          >
            <div className="shrink-0 flex items-center gap-[0.6cqw] px-[1.1cqw] py-[0.5cqw] bg-tx-line text-tx-rule whitespace-nowrap">
              <span className="shrink-0 size-[max(4px,0.7cqw)] rounded-full bg-tx-signal" />
              <span className="shrink-0 size-[max(4px,0.7cqw)] rounded-full bg-tx-rule" />
              <span className="ml-[0.4cqw] min-w-0 truncate">build.log</span>
              {live && (
                <button
                  type="button"
                  onClick={() => setRun((r) => r + 1)}
                  className="ml-auto shrink-0 cursor-pointer text-tx-paper hover:text-tx-signal"
                >
                  ↻ REBUILD
                </button>
              )}
            </div>
            {/* Lines never shrink; when they don't fit, the oldest scroll out of view at the top like a real terminal */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end px-[1.1cqw] py-[0.8cqw]">
              {typed.map((line, i) => (
                <div key={i} className="shrink-0 whitespace-pre overflow-hidden text-ellipsis">
                  {line}
                  {!live && i === typed.length - 1 && <span className="motion-safe:animate-tx-blink">▍</span>}
                </div>
              ))}
              {typed.length === 0 && <span className="shrink-0 motion-safe:animate-tx-blink">▍</span>}
              {live ? (
                <div className="shrink-0 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-tx-signal motion-safe:animate-tx-blink">●</span> DEPLOYED — ON AIR
                </div>
              ) : (
                buildLog && (
                  <div className="shrink-0 text-tx-rule whitespace-pre">
                    [{"█".repeat(bar)}{"·".repeat(10 - bar)}] {Math.round(progress * 100)}%
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <HorizonDial frequency={station.frequency} links={links} />

      <div className={`${WRAP} mt-12 md:mt-16 flex flex-wrap justify-between items-end gap-8`}>
        <h1
          className={`m-0 font-display font-extrabold text-[clamp(52px,10vw,150px)] leading-[0.86] uppercase tracking-[-0.01em] ${
            headline ? "" : "invisible"
          }`}
        >
          {(headline ?? STATION.headline).map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h1>
        <div className="max-w-[300px] flex flex-col gap-3 leading-[1.6]">
          {live ? (
            <span className={`${LABEL} text-tx-signal font-bold`}>
              ● LIVE{day !== null && ` — DAY ${day.toLocaleString("en-US")}`}
            </span>
          ) : (
            <span className={`${LABEL} text-tx-muted font-bold`}>○ BUILDING…</span>
          )}
          {intro?.tagline && <span className="whitespace-pre-wrap">{intro.tagline}</span>}
        </div>
      </div>
    </section>
  );
}

/** The horizon line doubles as a tuner scale: frequency ticks, the sections as stations, needle on our frequency. */
function HorizonDial({ frequency, links }: { frequency: string; links: NavLink[] }) {
  const f = parseFloat(frequency);
  const center = Number.isFinite(f) ? f : parseFloat(STATION.frequency);
  // Work in 0.1 MHz units: ±3.3 MHz around our frequency, a tick every 0.2, a number every 1.0
  const lo = Math.round((center - 3.3) * 10);
  const hi = Math.round((center + 3.3) * 10);
  const ticks: { pos: number; major: boolean; label: number }[] = [];
  for (let u = lo; u <= hi; u++) {
    if (u % 2 !== 0) continue;
    ticks.push({ pos: ((u - lo) / (hi - lo)) * 100, major: u % 10 === 0, label: u / 10 });
  }

  return (
    <div id="hero-dial">
      <div className="h-[2px] bg-tx-ink" />
      <div className={WRAP}>
        <div className="relative h-11 md:h-12" aria-hidden>
          {ticks.map(({ pos, major, label }) => (
            <span key={pos} className="absolute top-0 -translate-x-1/2" style={{ left: `${pos}%` }}>
              <span className={`block mx-auto w-px bg-tx-muted ${major ? "h-4" : "h-2"}`} />
              {major && <span className="block mt-1 text-[10px] md:text-[11px] text-tx-muted">{label}</span>}
            </span>
          ))}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="block w-[3px] h-7 md:h-8 bg-tx-signal" />
            <span className="block w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-tx-signal" />
          </span>
        </div>
        {/* Desktop only — on mobile the burger menu is the navigation */}
        <nav aria-label="Stations" className="hidden md:block relative h-8 mt-2">
          {links.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              className="absolute top-0 -translate-x-1/2 font-display font-extrabold text-[17px] tracking-[0.02em] whitespace-nowrap text-tx-ink no-underline hover:text-tx-signal"
              style={{ left: `${stationPosition(i, links.length)}%` }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
