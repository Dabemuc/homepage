import CareerTimeline from "./CareerTimeline";
import type { CareerSection as CareerSectionType } from "@/lib/api";

type Props = {
  sections: CareerSectionType[];
};

export default function CareerSection({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Career</h2>
        <div className="mt-2 h-px w-12 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto" />
      </div>

      <div className="relative">
        {/* Top fade with "More to come" */}
        <div className="relative mb-8">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none flex items-start justify-center pt-1">
            <span className="text-xs text-muted-foreground/50 italic tracking-wider">More to come...</span>
          </div>
          <div className="pt-8">
            <CareerTimeline sections={sections} />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
