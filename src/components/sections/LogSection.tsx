import Markdown from "@/components/Markdown";
import type { CareerSection } from "@/lib/api";
import { SECTION_WRAP, LABEL } from "@/lib/station";

type Props = {
  sections: CareerSection[];
};

const ROW = "grid grid-cols-1 md:grid-cols-[140px_minmax(0,1.1fr)_minmax(0,1.6fr)] gap-1.5 md:gap-6";

export default function LogSection({ sections }: Props) {
  if (sections.length === 0) return null;

  const entryCount = sections.reduce((sum, s) => sum + s.entries.length, 0);

  return (
    <section id="log" className="py-20 md:py-[110px]">
      <div className={`${SECTION_WRAP} flex flex-col gap-14`}>
        <div className="flex flex-wrap justify-between items-baseline gap-4">
          <h2 className="m-0 font-display font-medium text-5xl md:text-[64px] leading-none uppercase">Station log</h2>
          <span className={`${LABEL} text-tx-muted`}>
            {sections.length} {sections.length === 1 ? "SESSION" : "SESSIONS"} · {entryCount} {entryCount === 1 ? "ENTRY" : "ENTRIES"}
          </span>
        </div>

        {sections.map((section, index) => {
          // Newest session is listed first, so number them counting down
          const num = String(sections.length - index).padStart(2, "0");
          return (
            <div key={section.id} className="flex flex-col border-t-2 border-tx-ink pt-5">
              <div className="flex flex-wrap justify-between items-baseline gap-3 mb-3">
                <h3 className="m-0 font-display font-extrabold text-[34px] md:text-[44px] leading-none uppercase">
                  {section.title}
                </h3>
                {section.active ? (
                  <span className={`${LABEL} text-tx-signal font-bold`}>
                    <span className="motion-safe:animate-tx-blink">●</span> SESSION {num} — ON AIR
                  </span>
                ) : (
                  <span className={`${LABEL} text-tx-muted`}>SESSION {num} — SIGNED OFF</span>
                )}
              </div>

              {section.entries.length > 0 && (
                <div className={`${ROW} hidden md:grid py-2.5 border-b border-tx-ink text-tx-muted ${LABEL}`}>
                  <span>DATE</span>
                  <span>ENTRY</span>
                  <span>REMARKS</span>
                </div>
              )}

              {section.entries.map((entry) => (
                <div key={entry.id} className={`${ROW} py-[18px] border-b border-tx-rule items-start`}>
                  <span className="text-tx-muted uppercase">{entry.timestamp}</span>
                  <span className="font-display font-medium text-[26px] leading-[1.05]">{entry.title}</span>
                  {entry.description ? <Markdown className="text-[#2A2C2E]">{entry.description}</Markdown> : <span />}
                </div>
              ))}
            </div>
          );
        })}

        <span className={`${LABEL} text-tx-muted text-center`}>— LOG CONTINUES —</span>
      </div>
    </section>
  );
}
