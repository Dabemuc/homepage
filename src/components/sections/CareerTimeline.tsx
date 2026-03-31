import type { CareerSection } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  sections: CareerSection[];
};

function EntryCard({ entry }: { entry: CareerSection["entries"][number] }) {
  return (
    <>
      <div className="text-xs font-medium text-primary/80 mb-1.5 tracking-wide">
        {entry.timestamp}
      </div>
      <h4 className="font-semibold text-sm mb-2 text-foreground">{entry.title}</h4>
      {entry.description && (
        <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {entry.description.replace(/\\n/g, "\n")}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}

export default function CareerTimeline({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <div className="relative">
      {/* Desktop center gradient line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--brand) 15%, var(--border) 50%, var(--brand) 85%, transparent)",
          opacity: 0.4,
        }}
      />

      {sections.map((section) => {
        const entries = section.entries;

        return (
          <div key={section.id} className="group/section relative mb-20">

            {/* ── Desktop: alternating left/right ── */}
            <div className="hidden md:block space-y-8">
              {entries.map((entry, entryIndex) => {
                const isLeft = entryIndex % 2 === 0;
                return (
                  <div key={entry.id} className="relative">
                    <div className={`flex items-center gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                      <div className="flex-1">
                        <div className={`rounded-xl border border-border/70 bg-card p-5 shadow-sm group-hover/section:shadow-[0_0_18px_2px_var(--brand-glow)] group-hover/section:border-primary/20 transition-all duration-300 ${isLeft ? "ml-auto" : "mr-auto"} max-w-md`}>
                          <EntryCard entry={entry} />
                        </div>
                      </div>
                      <div className="relative flex-shrink-0 z-10">
                        <div
                          className="w-3 h-3 rounded-full border-2 border-background shadow-md group-hover/section:scale-125 transition-transform duration-200"
                          style={{ background: "var(--brand)" }}
                        />
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 scale-[2.5]"
                          style={{ background: "var(--brand-glow)" }}
                        />
                      </div>
                      <div className="flex-1" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Mobile: single continuous left line ── */}
            <div className="md:hidden relative space-y-5">
              {/* Line — fades only at top/bottom, cards are unaffected */}
              <div
                className="absolute left-[5px] top-0 bottom-0 w-0.5 pointer-events-none"
                style={{
                  background: "var(--border)",
                  maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                }}
              />
              {entries.map((entry) => (
                <div key={entry.id} className="relative pl-8">
                  {/* Dot above the line */}
                  <div
                    className="absolute left-0 top-3 w-3 h-3 rounded-full ring-2 ring-background z-10 shadow-sm"
                    style={{ background: "var(--brand)" }}
                  />
                  <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm group-hover/section:shadow-[0_0_18px_2px_var(--brand-glow)] group-hover/section:border-primary/20 transition-all duration-300">
                    <EntryCard entry={entry} />
                  </div>
                </div>
              ))}
            </div>

            {/* Section title badge at bottom */}
            <div className="flex justify-center mt-10">
              <div className="relative z-10 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm border border-primary/20 bg-gradient-to-r from-primary/10 via-brand-subtle to-primary/10 text-primary transition-shadow duration-200 group-hover/section:shadow-md group-hover/section:border-primary/40">
                {section.title}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
