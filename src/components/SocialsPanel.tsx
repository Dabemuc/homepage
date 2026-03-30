import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import * as Icons from "lucide-react";
import type { SocialLink } from "@/lib/api";

type Props = {
  socials: SocialLink[];
};

const STORAGE_KEY = "socials-panel-collapsed";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!IconComponent) return <span className={className}>•</span>;
  return <IconComponent className={className} />;
}

export default function SocialsPanel({ socials }: Props) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Mount guard - renders nothing until after first mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (socials.length === 0) return null;

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <div
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center transition-transform duration-300 ease-in-out ${
        collapsed ? "translate-x-[calc(100%-2rem)]" : "translate-x-0"
      }`}
    >
      {/* Handle / peek tab */}
      <button
        onClick={toggle}
        className="flex items-center justify-center w-8 h-16 bg-card border border-r-0 rounded-l-lg shadow-md hover:bg-accent transition-colors flex-shrink-0"
        aria-label={collapsed ? "Expand socials panel" : "Collapse socials panel"}
      >
        {collapsed ? (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Panel content */}
      <div className="bg-card border rounded-l-none rounded-xl shadow-lg p-3 space-y-2 min-w-[120px]">
        {socials.map((social) => (
          <a
            key={social.id}
            href={social.url ?? "#"}
            target={social.url?.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors group"
            title={social.label ?? social.platform ?? ""}
          >
            {social.icon && (
              <DynamicIcon
                name={social.icon}
                className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0"
              />
            )}
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {social.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
