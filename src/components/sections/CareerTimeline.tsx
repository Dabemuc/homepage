import type { CareerSection } from "@/lib/api";
import ReactMarkdown from "react-markdown";

type Props = {
  sections: CareerSection[];
};

export default function CareerTimeline({ sections }: Props) {
  if (sections.length === 0) return null;

  const reversedSections = sections.slice().reverse();

  return (
    <div className="relative">
      {/* Center gradient line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--brand) 15%, var(--border) 50%, var(--brand) 85%, transparent)",
          opacity: 0.4,
        }}
      />

      {reversedSections.map((section) => (
        <div
          key={section.id}
          className="group/section relative mb-20 transition-opacity duration-300"
        >
          {/* Section title badge */}
          <div className="flex justify-center mb-10">
            <div className="relative z-10 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase shadow-sm border border-primary/20 bg-gradient-to-r from-primary/10 via-brand-subtle to-primary/10 text-primary transition-shadow duration-200 group-hover/section:shadow-md group-hover/section:border-primary/40">
              {section.title}
            </div>
          </div>

          {/* Entries */}
          <div className="space-y-8">
            {section.entries.slice().reverse().map((entry, entryIndex) => {
              const isLeft = entryIndex % 2 === 0;

              return (
                <div key={entry.id} className="relative">
                  {/* Desktop: alternating layout */}
                  <div
                    className={`hidden md:flex items-center gap-8 ${
                      isLeft ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Content */}
                    <div className="flex-1">
                      <div
                        className={`rounded-xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-200 ${
                          isLeft ? "ml-auto" : "mr-auto"
                        } max-w-md`}
                      >
                        <div className="text-xs font-medium text-primary/80 mb-1.5 tracking-wide">
                          {entry.timestamp}
                        </div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">{entry.title}</h4>
                        {entry.description && (
                          <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{entry.description}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dot on center line */}
                    <div className="relative flex-shrink-0 z-10">
                      <div
                        className="w-3 h-3 rounded-full border-2 border-background shadow-md group-hover/section:scale-125 transition-transform duration-200"
                        style={{ background: "var(--brand)" }}
                      />
                      {/* Outer glow ring */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 scale-[2.5]"
                        style={{ background: "var(--brand-glow)" }}
                      />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                  </div>

                  {/* Mobile: single column */}
                  <div className="md:hidden flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-sm"
                        style={{ background: "var(--brand)" }}
                      />
                      {entryIndex < section.entries.length - 1 && (
                        <div
                          className="w-px flex-1 mt-1"
                          style={{ background: "var(--border)" }}
                        />
                      )}
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4 shadow-sm mb-4 flex-1">
                      <div className="text-xs font-medium text-primary/80 mb-1.5 tracking-wide">
                        {entry.timestamp}
                      </div>
                      <h4 className="font-semibold text-sm mb-2 text-foreground">{entry.title}</h4>
                      {entry.description && (
                        <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{entry.description}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dim overlay for other sections on hover */}
          <style>{`
            .group\\/section:has(~ .group\\/section:hover),
            .group\\/section:hover ~ .group\\/section {
              opacity: 0.35;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
