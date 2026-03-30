import type { CareerSection } from "@/lib/api";
import ReactMarkdown from "react-markdown";

type Props = {
  sections: CareerSection[];
};

export default function CareerTimeline({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <div className="relative">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

      {sections.map((section) => (
        <div
          key={section.id}
          className="group/section relative mb-16 transition-opacity duration-300"
          style={{
            opacity: 1,
          }}
        >
          {/* Section title */}
          <div className="flex justify-center mb-8">
            <div className="relative z-10 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-md group-hover/section:shadow-lg transition-shadow">
              {section.title}
            </div>
          </div>

          {/* Entries */}
          <div className="space-y-8">
            {section.entries.map((entry, entryIndex) => {
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
                        className={`rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all duration-200 group-hover/section:border-primary/30 ${
                          isLeft ? "ml-auto" : "mr-auto"
                        } max-w-md`}
                      >
                        <div className="text-xs font-medium text-primary mb-1">
                          {entry.timestamp}
                        </div>
                        <h4 className="font-semibold mb-2">{entry.title}</h4>
                        {entry.description && (
                          <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{entry.description}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dot on center line */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm group-hover/section:scale-125 transition-transform duration-200" />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                  </div>

                  {/* Mobile: single column */}
                  <div className="md:hidden flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mt-1 flex-shrink-0" />
                      {entryIndex < section.entries.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="rounded-xl border bg-card p-4 shadow-sm mb-4 flex-1">
                      <div className="text-xs font-medium text-primary mb-1">
                        {entry.timestamp}
                      </div>
                      <h4 className="font-semibold mb-2">{entry.title}</h4>
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
              opacity: 0.4;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
