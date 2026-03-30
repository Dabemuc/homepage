import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import HomePage from "./pages/HomePage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIntro from "./pages/admin/AdminIntro";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminCareer from "./pages/admin/AdminCareer";
import AdminSocials from "./pages/admin/AdminSocials";
import { SignIn } from "@clerk/clerk-react";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route path="/admin" element={<AdminLayout />}>
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
