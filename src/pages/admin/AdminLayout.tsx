import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Home, User, FolderOpen, Briefcase, Share2, Menu, X, Globe } from "lucide-react";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) return null;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map(({ to, label, icon: Icon, exact }) => {
        const isActive = exact
          ? location.pathname === to
          : location.pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onClick}
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
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 border-r flex-col flex-shrink-0">
        <div className="h-14 px-4 font-semibold text-lg border-b flex items-center">Admin</div>
        <nav className="flex-1 p-2 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 border-b px-4 flex items-center justify-between flex-shrink-0">
          {/* Left: burger on mobile */}
          <button
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            onClick={() => setMobileNavOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Center: "Admin" label on mobile */}
          <span className="md:hidden absolute left-1/2 -translate-x-1/2 font-semibold text-sm text-foreground pointer-events-none">
            Admin
          </span>
          <span className="hidden md:block" />

          {/* Right: back to site + user */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              aria-label="View site"
              title="View site"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Mobile dropdown nav */}
        {mobileNavOpen && (
          <nav className="md:hidden border-b bg-background px-3 py-2 space-y-1 flex-shrink-0">
            <NavLinks onClick={() => setMobileNavOpen(false)} />
          </nav>
        )}

        <div className="flex-1 p-6 overflow-auto min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
