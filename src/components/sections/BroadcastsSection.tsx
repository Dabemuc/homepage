import { useState } from "react";
import ProjectModal from "./ProjectModal";
import type { Project } from "@/lib/api";
import { WRAP, LABEL, txCode, parseTags } from "@/lib/station";

type Props = {
  projects: Project[];
};

export default function BroadcastsSection({ projects }: Props) {
  const [selected, setSelected] = useState<{ project: Project; code: string } | null>(null);

  if (projects.length === 0) return null;

  return (
    <section id="broadcasts" className="bg-tx-ink text-tx-paper py-20 md:py-[110px]">
      <div className={`${WRAP} flex flex-col gap-12`}>
        <div className="flex flex-wrap justify-between items-baseline gap-4">
          <h2 className="m-0 font-display font-medium text-5xl md:text-[64px] leading-none uppercase">Broadcasts</h2>
          <span className={`${LABEL} text-tx-rule`}>
            {projects.length} {projects.length === 1 ? "SIGNAL" : "SIGNALS"} ON AIR
          </span>
        </div>

        <div className="flex flex-col">
          {projects.map((project, index) => {
            const code = txCode(projects.length - index);
            const tags = parseTags(project.tags).slice(0, 3);
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelected({ project, code })}
                className="group grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-6 py-8 border-t border-tx-line last:border-b text-left items-start cursor-pointer transition-colors hover:bg-white/[0.03] focus-visible:outline-2 focus-visible:outline-tx-signal"
              >
                <span className="text-tx-rule uppercase">
                  {code}
                  {tags.length > 0 && (
                    <>
                      <br />
                      {tags.join(" · ")}
                    </>
                  )}
                </span>
                <span className="font-display font-extrabold text-[40px] md:text-5xl leading-none uppercase break-words">
                  {project.title}
                </span>
                <span className="leading-[1.6] text-tx-dim">{project.short_description}</span>
                <span className="lg:justify-self-end text-tx-signal font-bold">
                  TUNE IN <span className="inline-block transition-transform group-hover:translate-x-1">▸</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={selected?.project ?? null}
        code={selected?.code ?? ""}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
