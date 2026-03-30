import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FolderOpen, Briefcase, Share2 } from "lucide-react";

const sections = [
  {
    to: "/admin/intro",
    title: "Intro",
    description: "Edit your name, tagline, bio, and avatar",
    icon: User,
  },
  {
    to: "/admin/projects",
    title: "Projects",
    description: "Manage your portfolio projects",
    icon: FolderOpen,
  },
  {
    to: "/admin/career",
    title: "Career",
    description: "Edit your career timeline sections and entries",
    icon: Briefcase,
  },
  {
    to: "/admin/socials",
    title: "Socials",
    description: "Manage social links shown in the panel",
    icon: Share2,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ to, title, description, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
