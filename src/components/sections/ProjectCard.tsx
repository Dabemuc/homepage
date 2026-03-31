import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/api";
import { tagColor } from "@/lib/tagColor";

type Props = {
  project: Project;
  onClick: () => void;
};

export default function ProjectCard({ project, onClick }: Props) {
  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];

  return (
    <div
      className="group relative rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm hover:shadow-[0_0_20px_2px_var(--brand-glow)] hover:border-primary/25 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Screenshot */}
      <div className="aspect-video bg-muted overflow-hidden">
        {project.screenshot ? (
          <img
            src={`/screenshots/${project.screenshot}`}
            alt={project.title ?? "Project screenshot"}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm">
            No screenshot
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title row with links */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          <div className="flex gap-2 flex-shrink-0 mt-0.5">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground/50 hover:text-primary transition-colors duration-200"
                title="Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground/50 hover:text-primary transition-colors duration-200"
                title="Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {project.short_description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.short_description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${tagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
