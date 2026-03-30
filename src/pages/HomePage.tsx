import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import IntroSection from "@/components/sections/IntroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import CareerSection from "@/components/sections/CareerSection";
import SocialsPanel from "@/components/SocialsPanel";
import { fetchHomepage } from "@/lib/api";
import type { HomepageData } from "@/lib/api";

export default function HomePage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchHomepage()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% -5%, var(--brand-glow), transparent 70%)",
        }}
      />

      {/* Top bar */}
      <header className="fixed top-0 right-0 z-40 p-3 flex gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Link
          to="/admin"
          aria-label="Admin"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </header>

      {loading && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-destructive text-center">
            <p className="font-semibold">Failed to load</p>
            <p className="text-sm mt-1 text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <div className="relative z-10">
          {data.config.intro_visible !== "false" && data.intro && (
            <IntroSection intro={data.intro} />
          )}

          {data.config.projects_visible !== "false" && data.projects.length > 0 && (
            <div className="border-t border-border/60">
              <ProjectsSection projects={data.projects} />
            </div>
          )}

          {data.config.career_visible !== "false" && data.career.length > 0 && (
            <div className="border-t border-border/60">
              <CareerSection sections={data.career} />
            </div>
          )}

          <SocialsPanel socials={data.socials} />
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60 py-8 text-center text-sm text-muted-foreground/60">
        © {new Date().getFullYear()}, Dabemuc
      </footer>
    </div>
  );
}
