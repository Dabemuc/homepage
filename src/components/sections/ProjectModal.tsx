import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@/lib/api";
import { tagColor } from "@/lib/tagColor";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null;

  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex flex-col w-[90vw] max-w-2xl h-[75vh] p-0 gap-0 overflow-hidden">
        {/* Header: title + links inline, pr-10 keeps clear of the close button */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 pr-12 border-b border-border/50 flex-shrink-0">
          <h2 className="text-xl font-semibold leading-snug text-foreground">
            {project.title}
          </h2>
          <div className="flex gap-2 flex-shrink-0">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Repository"
                className="text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Website"
                className="text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-6 py-3 border-b border-border/50 flex-shrink-0">
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

        {/* Description — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {project.description ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description.replace(/\\n/g, "\n")}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
