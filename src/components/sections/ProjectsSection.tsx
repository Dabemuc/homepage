import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import type { Project } from "@/lib/api";

type Props = {
  projects: Project[];
};

export default function ProjectsSection({ projects }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Projects</h2>
        <div className="mt-2 h-px w-12 bg-gradient-to-r from-primary to-transparent rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
