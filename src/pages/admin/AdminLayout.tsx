import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Separator } from "@/components/ui/separator";
import { Home, User, FolderOpen, Briefcase, Share2 } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Home, exact: true },
  { to: "/admin/intro", label: "Intro", icon: User },
  { to: "/admin/projects", label: "Projects", icon: FolderOpen },
  { to: "/admin/career", label: "Career", icon: Briefcase },
  { to: "/admin/socials", label: "Socials", icon: Share2 },
];

export default function AdminLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-56 border-r flex flex-col flex-shrink-0">
        <div className="h-14 px-4 font-semibold text-lg border-b flex items-center">Admin</div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4 flex items-center gap-2">
          <UserButton afterSignOutUrl="/" />
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            View site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b px-4 flex items-center justify-end flex-shrink-0" />

        <div className="flex-1 p-6 overflow-auto min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
