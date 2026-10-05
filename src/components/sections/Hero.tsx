import type { Intro } from "@/lib/api";
import { STATION, WRAP, LABEL, daysOnAir } from "@/lib/station";

// Antenna legs: left edge x and rotation (degrees) around their top center
const LEGS = [
  { x: 190, r: 18 },
  { x: 300, r: -6 },
  { x: 430, r: 8 },
  { x: 540, r: -20 },
];

type Props = {
  intro: Intro | null;
};

export default function Hero({ intro }: Props) {
  const day = daysOnAir(intro?.on_air_since);

  return (
    <section className="pb-20 md:pb-28">
      {/* Sky + horizon; the station's legs reach 30 units below the horizon line */}
      <div className="bg-tx-haze border-b border-tx-rule pt-[clamp(48px,9vw,120px)]">
        <svg
          viewBox="0 0 760 470"
          aria-hidden
          className="relative mx-auto block w-[min(760px,calc(100%-32px))] fill-tx-ink"
          style={{ marginBottom: "calc(min(760px, 100vw - 32px) * -30 / 760)" }}
        >
          <rect x="140" y="150" width="480" height="150" />
          <rect x="230" y="60" width="300" height="100" />
          <rect x="330" y="0" width="8" height="70" />
          <rect x="600" y="190" width="160" height="34" />
          <rect x="20" y="180" width="140" height="26" />
          {LEGS.map(({ x, r }) => (
            <rect key={x} x={x} y="290" width="40" height="180" transform={`rotate(${r} ${x + 20} 290)`} />
          ))}
          <rect x="80" y="428" width="3" height="12" />
          <rect x="326" y="0" width="16" height="16" className="fill-tx-signal motion-safe:animate-tx-blink" />
        </svg>
      </div>

      <div className={`${WRAP} mt-[60px] flex flex-wrap justify-between items-end gap-8`}>
        <h1 className="m-0 font-display font-extrabold text-[clamp(52px,10vw,150px)] leading-[0.86] uppercase tracking-[-0.01em]">
          {STATION.headline[0]}
          <br />
          {STATION.headline[1]}
        </h1>
        <div className="max-w-[300px] flex flex-col gap-3 leading-[1.6]">
          <span className={`${LABEL} text-tx-signal font-bold`}>
            ● LIVE{day !== null && ` — DAY ${day.toLocaleString("en-US")}`}
          </span>
          {intro?.tagline && <span className="whitespace-pre-wrap">{intro.tagline}</span>}
        </div>
      </div>
    </section>
  );
}
