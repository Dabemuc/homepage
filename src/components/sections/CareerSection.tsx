import CareerTimeline from "./CareerTimeline";
import type { CareerSection as CareerSectionType } from "@/lib/api";

type Props = {
  sections: CareerSectionType[];
};

export default function CareerSection({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 text-center">Career</h2>

      <div className="relative">
        {/* Top fade with "More to come" */}
        <div className="relative mb-8">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none flex items-start justify-center pt-2">
            <span className="text-sm text-muted-foreground italic">More to come...</span>
          </div>
          <div className="pt-8">
            <CareerTimeline sections={sections} />
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
