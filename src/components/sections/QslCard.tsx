import { useState } from "react";
import type { Intro } from "@/lib/api";
import { STATION, LABEL } from "@/lib/station";

const pad = (n: number) => String(n).padStart(2, "0");

/** A radio QSL card "confirming contact" with the visitor; date/time are the moment of the visit. */
export default function QslCard({ intro }: { intro: Intro | null }) {
  const [now] = useState(() => new Date());
  const sinceYear = intro?.on_air_since?.slice(0, 4);

  const fields = [
    { label: "TO RADIO", value: "YOU" },
    { label: "DATE", value: `${now.getUTCFullYear()}.${pad(now.getUTCMonth() + 1)}.${pad(now.getUTCDate())}` },
    { label: "UTC", value: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}` },
    { label: "FREQ", value: STATION.frequency },
    { label: "MODE", value: "HTTPS" },
    { label: "RST", value: "599" },
  ];

  return (
    <div className="relative overflow-hidden w-full max-w-[600px] mx-auto -rotate-2 bg-tx-card border border-tx-ink shadow-[10px_10px_0_var(--color-tx-ink)] p-5 sm:p-7 flex flex-col gap-5">
      <div className={`${LABEL} flex justify-between items-start gap-4`}>
        <span className="font-bold">QSL · CONFIRMING OUR CONTACT</span>
        {/* Miniature of the hero station */}
        <svg viewBox="0 0 46 34" aria-hidden className="w-[46px] h-[34px] flex-shrink-0 fill-tx-ink">
          <rect x="4" y="18" width="38" height="12" />
          <rect x="11" y="10" width="24" height="9" />
          <rect x="21" y="0" width="3" height="11" />
          <rect x="19" y="0" width="7" height="7" className="fill-tx-signal" />
        </svg>
      </div>

      <div>
        <div className={`${LABEL} text-tx-muted`}>FROM STATION</div>
        <div className="font-display font-extrabold text-[clamp(56px,8vw,104px)] leading-[0.85] tracking-[-0.01em] uppercase break-words">
          {intro?.name ?? STATION.name}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-l border-tx-ink">
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

      <div className="flex flex-wrap justify-between items-end gap-4">
        <span className={`${LABEL} text-tx-muted`}>PSE QSL · TNX FOR TUNING IN</span>
        <span className="font-display font-light text-[30px] leading-none">73, {STATION.operator}</span>
      </div>

      <span
        aria-hidden
        className="absolute right-5 bottom-6 sm:bottom-auto sm:right-6 sm:top-24 rotate-12 border-[3px] border-tx-signal text-tx-signal font-display font-extrabold text-[22px] tracking-[0.06em] px-2.5 py-0.5 opacity-85"
      >
        RECEIVED
      </span>
    </div>
  );
}
