import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ClerkProvider, SignIn } from "@clerk/clerk-react";
import HomePage from "./pages/HomePage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIntro from "./pages/admin/AdminIntro";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCareer from "./pages/admin/AdminCareer";
import AdminSocials from "./pages/admin/AdminSocials";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing VITE_CLERK_PUBLISHABLE_KEY — admin features will not work");
}

// ClerkProvider is intentionally scoped to admin/sign-in routes only.
// The public homepage has no auth dependency; wrapping everything caused
// Clerk's CDN script load failure to break the public page entirely.
function WithClerk({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY ?? "pk_test_placeholder"}>
      {children}
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in"
            element={
              <WithClerk>
                <div className="flex items-center justify-center min-h-screen">
                  <SignIn routing="path" path="/sign-in" />
                </div>
              </WithClerk>
            }
          />
          <Route
            path="/admin"
            element={
              <WithClerk>
                <AdminLayout />
              </WithClerk>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="intro" element={<AdminIntro />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="career" element={<AdminCareer />} />
            <Route path="socials" element={<AdminSocials />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
