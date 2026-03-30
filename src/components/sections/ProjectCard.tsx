import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/api";

type Props = {
  project: Project;
  onClick: () => void;
};

// Deterministic color per tag text — same tag always gets the same color
const TAG_PALETTES = [
  "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
  "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300",
  "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
];

function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) & 0xffff;
  }
  return TAG_PALETTES[h % TAG_PALETTES.length];
}

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
