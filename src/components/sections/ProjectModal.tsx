import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Project } from "@/lib/api";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null;

  const tags: string[] = project.tags ? JSON.parse(project.tags) : [];

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {project.screenshot && (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={`/screenshots/${project.screenshot}`}
                  alt={project.title ?? "Project screenshot"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </a>
              )}
              {project.website_url && (
                <a
                  href={project.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {project.description && (
              <ReactMarkdown>{project.description}</ReactMarkdown>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
