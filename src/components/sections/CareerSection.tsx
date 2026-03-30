import CareerTimeline from "./CareerTimeline";
import type { CareerSection as CareerSectionType } from "@/lib/api";

type Props = {
  sections: CareerSectionType[];
};

export default function CareerSection({ sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Career</h2>
        <div className="mt-2 h-px w-12 bg-gradient-to-r from-primary to-transparent rounded-full mx-auto md:mx-0" />
      </div>

      <div className="mb-6 text-center">
        <span className="text-xs text-muted-foreground/40 italic tracking-wider">More to come...</span>
      </div>

      <CareerTimeline sections={sections} />
    </section>
  );
}
