import { useState } from "react";
import type { Intro } from "@/lib/api";
import { STATION, LABEL, stationOf } from "@/lib/station";
import { useVisitorNumber } from "@/lib/visitor";

const pad = (n: number) => String(n).padStart(2, "0");

/** A radio QSL card "confirming contact" with the visitor; date/time are the moment of the visit. */
export default function QslCard({ intro }: { intro: Intro | null }) {
  const [now] = useState(() => new Date());
  const visitorNumber = useVisitorNumber();
  const sinceYear = intro?.on_air_since?.slice(0, 4);
  const station = stationOf(intro);

  const fields = [
    { label: "TO RADIO", value: "YOU" },
    { label: "DATE", value: `${now.getUTCFullYear()}.${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())}` },
    { label: "UTC", value: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}` },
    { label: "FREQ", value: station.frequency },
    { label: "MODE", value: "HTTPS" },
    { label: "RST", value: "599" },
  ];

  return (
    // Portrait on small screens; landscape (callsign left, log fields right) from lg, like a real postcard
    <div className="relative overflow-hidden w-full max-w-[600px] lg:max-w-[920px] mx-auto -rotate-2 bg-tx-card border border-tx-ink shadow-[10px_10px_0_var(--color-tx-ink)] p-5 sm:p-7 flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-x-10">
      <div className={`${LABEL} flex justify-between items-start gap-4 lg:col-span-2`}>
        <span className="flex flex-col gap-1">
          <span className="font-bold">
            QSL NO. {visitorNumber !== null ? String(visitorNumber).padStart(6, "0") : "------"}
          </span>
          <span className="text-tx-muted">CONFIRMING OUR CONTACT</span>
        </span>
        {/* Miniature of the hero station */}
        <svg viewBox="0 0 46 34" aria-hidden className="w-[46px] h-[34px] flex-shrink-0 fill-tx-ink">
          <rect x="4" y="18" width="38" height="12" />
          <rect x="11" y="10" width="24" height="9" />
          <rect x="21" y="0" width="3" height="11" />
          <rect x="19" y="0" width="7" height="7" className="fill-tx-signal" />
        </svg>
      </div>

      <div className="lg:col-start-1 lg:row-start-2 lg:self-end">
        <div className={`${LABEL} text-tx-muted`}>FROM STATION</div>
        <div className="font-display font-extrabold text-[clamp(56px,8vw,104px)] lg:text-[clamp(56px,6vw,92px)] leading-[0.85] tracking-[-0.01em] uppercase break-words">
          {intro?.name ?? station.name}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-l border-tx-ink lg:col-start-2 lg:row-start-2 lg:row-span-2 lg:self-center">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 px-2.5 py-2 border-r border-b border-tx-ink">
            <small className="text-[9px] tracking-[0.14em] text-tx-muted">{label}</small>
            <span className="font-bold">{value}</span>
          </div>
        ))}
        <div className="col-span-3 flex flex-col gap-1 px-2.5 py-2 border-r border-b border-tx-ink">
          <small className="text-[9px] tracking-[0.14em] text-tx-muted">QTH</small>
          <span className="font-bold uppercase">
            {STATION.qth}
            {sinceYear && ` — ON AIR SINCE ${sinceYear}`}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-end gap-4 lg:col-start-1 lg:row-start-3">
        <span className={`${LABEL} text-tx-muted`}>PSE QSL · TNX FOR TUNING IN</span>
        <span className="font-display font-light text-[30px] leading-none">73, {STATION.operator}</span>
      </div>

      <span
        aria-hidden
        className="absolute right-5 bottom-6 sm:bottom-auto sm:right-6 sm:top-24 lg:top-auto lg:bottom-7 lg:right-9 rotate-12 border-[3px] border-tx-signal text-tx-signal font-display font-extrabold text-[22px] tracking-[0.06em] px-2.5 py-0.5 opacity-85"
      >
        RECEIVED
      </span>
    </div>
  );
}
