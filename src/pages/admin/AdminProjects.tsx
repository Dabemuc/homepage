import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";
import {
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
} from "@/lib/api";
import type { Project } from "@/lib/api";

type ProjectForm = {
  title: string;
  short_description: string;
  description: string;
  screenshot: string;
  repo_url: string;
  website_url: string;
  tags: string;
  visible: boolean;
};

const emptyForm: ProjectForm = {
  title: "",
  short_description: "",
  description: "",
  screenshot: "",
  repo_url: "",
  website_url: "",
  tags: "[]",
  visible: true,
};

export default function AdminProjects() {
  const { getToken } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [tagInput, setTagInput] = useState("");

  const load = () =>
    adminGetProjects(getToken)
      .then(setProjects)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setShowNew(false);
    setForm({
      title: project.title ?? "",
      short_description: project.short_description ?? "",
      description: project.description ?? "",
      screenshot: project.screenshot ?? "",
      repo_url: project.repo_url ?? "",
      website_url: project.website_url ?? "",
      tags: project.tags ?? "[]",
      visible: project.visible ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowNew(false);
    setForm(emptyForm);
    setTagInput("");
  };

  const save = async () => {
    const data = { ...form, display_order: projects.length + 1 };
    if (editingId !== null) {
      const updated = await adminUpdateProject(editingId, data, getToken);
      setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
    } else {
      const created = await adminCreateProject(data, getToken);
      setProjects((prev) => [...prev, created]);
    }
    cancelEdit();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await adminDeleteProject(id, getToken);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newList = [...projects];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setProjects(newList);
    await Promise.all([
      adminUpdateProject(newList[index - 1].id, { display_order: index - 1 }, getToken),
      adminUpdateProject(newList[index].id, { display_order: index }, getToken),
    ]);
  };

  const moveDown = async (index: number) => {
    if (index === projects.length - 1) return;
    const newList = [...projects];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setProjects(newList);
    await Promise.all([
      adminUpdateProject(newList[index].id, { display_order: index }, getToken),
      adminUpdateProject(newList[index + 1].id, { display_order: index + 1 }, getToken),
    ]);
  };

  const toggleVisible = async (project: Project) => {
    const updated = await adminUpdateProject(project.id, { visible: !project.visible }, getToken);
    setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)));
  };

  const getTags = () => {
    try { return JSON.parse(form.tags) as string[]; } catch { return []; }
  };
  const addTag = () => {
    if (!tagInput.trim()) return;
    const tags = [...getTags(), tagInput.trim()];
    setForm((f) => ({ ...f, tags: JSON.stringify(tags) }));
    setTagInput("");
  };
  const removeTag = (tag: string) => {
    const tags = getTags().filter((t) => t !== tag);
    setForm((f) => ({ ...f, tags: JSON.stringify(tags) }));
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {!showNew && editingId === null && (
          <Button size="sm" onClick={() => { setShowNew(true); setForm(emptyForm); setTagInput(""); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Project
          </Button>
        )}
      </div>

      {(showNew || editingId !== null) && (
        <div className="border rounded-xl p-4 mb-6 space-y-4 bg-card">
          <h2 className="font-semibold">{editingId !== null ? "Edit Project" : "New Project"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Screenshot filename</label>
              <Input value={form.screenshot} onChange={(e) => setForm((f) => ({ ...f, screenshot: e.target.value }))} placeholder="myproject.png" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Short description</label>
            <Input value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description (Markdown)</label>
            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={6} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Repo URL</label>
              <Input value={form.repo_url} onChange={(e) => setForm((f) => ({ ...f, repo_url: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Website URL</label>
              <Input value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getTags().map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.visible} onCheckedChange={(v) => setForm((f) => ({ ...f, visible: v }))} />
            <label className="text-sm">Visible</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={project.id} className="border rounded-xl p-4 bg-card flex items-start gap-4">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(index)} disabled={index === 0}>
                <ChevronUp className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(index)} disabled={index === projects.length - 1}>
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{project.title}</span>
                {!project.visible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{project.short_description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Switch checked={!!project.visible} onCheckedChange={() => toggleVisible(project)} />
              <Button variant="ghost" size="icon" onClick={() => startEdit(project)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(project.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No projects yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
