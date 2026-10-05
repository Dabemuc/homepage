import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Markdown styled for the light "Last Transmission" surfaces
export default function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={cn(
        "leading-[1.6] [&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_ul]:mb-3 [&_ul]:list-['–_'] [&_ul]:pl-4 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1",
        "[&_:is(h1,h2,h3,h4)]:font-display [&_:is(h1,h2,h3,h4)]:font-extrabold [&_:is(h1,h2,h3,h4)]:uppercase [&_:is(h1,h2,h3,h4)]:text-2xl [&_:is(h1,h2,h3,h4)]:leading-none [&_:is(h1,h2,h3,h4)]:mt-6 [&_:is(h1,h2,h3,h4)]:mb-3 [&>:first-child]:mt-0",
        "[&_a]:underline [&_a:hover]:text-tx-signal [&_strong]:font-bold",
        "[&_code]:bg-tx-dim/60 [&_code]:px-1",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children.replace(/\\n/g, "\n")}</ReactMarkdown>
    </div>
  );
}
