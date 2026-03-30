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
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 right-0 z-40 p-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Link to="/admin" aria-label="Admin" className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-muted transition-colors">
          <Settings className="h-4 w-4" />
        </Link>
      </header>

      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-destructive text-center">
            <p className="font-semibold">Failed to load</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {data.config.intro_visible !== "false" && data.intro && (
            <IntroSection intro={data.intro} />
          )}

          {data.config.projects_visible !== "false" && data.projects.length > 0 && (
            <div className="border-t">
              <ProjectsSection projects={data.projects} />
            </div>
          )}

          {data.config.career_visible !== "false" && data.career.length > 0 && (
            <div className="border-t">
              <CareerSection sections={data.career} />
            </div>
          )}

          <SocialsPanel socials={data.socials} />
        </>
      )}

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}, Dabemuc
      </footer>
    </div>
  );
}
