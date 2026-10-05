import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Markdown from "@/components/Markdown";
import type { Project } from "@/lib/api";
import { LABEL, parseTags } from "@/lib/station";

type Props = {
  project: Project | null;
  code: string;
  onClose: () => void;
};

export default function ProjectModal({ project, code, onClose }: Props) {
  if (!project) return null;

  const tags = parseTags(project.tags);
  const links = [
    { href: project.repo_url, label: "REPO" },
    { href: project.website_url, label: "SITE" },
  ].filter((l): l is { href: string; label: string } => !!l.href);

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col w-[calc(100%-2rem)] max-w-3xl sm:max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden rounded-none ring-0 border border-tx-ink bg-tx-paper text-tx-ink font-station text-[13px] shadow-[10px_10px_0_var(--color-tx-ink)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 md:px-8 pt-6 pb-5 border-b border-tx-ink flex-shrink-0">
          <div className="flex flex-col gap-2 min-w-0">
            <span className={`${LABEL} text-tx-signal font-bold`}>● {code} — DECODED</span>
            <DialogTitle className="font-display font-extrabold text-4xl md:text-5xl leading-[0.9] uppercase break-words">
              {project.title}
            </DialogTitle>
          </div>
          <DialogClose className={`${LABEL} flex-shrink-0 cursor-pointer hover:text-tx-signal`}>CLOSE ✕</DialogClose>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {project.screenshot && (
            <img
              src={`/screenshots/${project.screenshot}`}
              alt={project.title ?? "Project screenshot"}
              className="block w-full aspect-video object-cover border-b border-tx-ink"
            />
          )}

          {(tags.length > 0 || links.length > 0) && (
            <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 px-5 md:px-8 py-4 border-b border-tx-rule">
              <span className="text-tx-muted uppercase">{tags.join(" · ")}</span>
              <span className="flex gap-5 font-bold">
                {links.map(({ href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-tx-ink hover:text-tx-signal">
                    {label} ↗
                  </a>
                ))}
              </span>
            </div>
          )}

          <div className="px-5 md:px-8 py-6">
            {project.description ? (
              <Markdown>{project.description}</Markdown>
            ) : (
              <p className="text-tx-muted">NO FURTHER DATA RECOVERED.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
