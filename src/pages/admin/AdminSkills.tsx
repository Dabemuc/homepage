import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import {
  adminGetSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
} from "@/lib/api";
import type { Skill } from "@/lib/api";
import { persistOrder, swapped } from "@/lib/reorder";

type SkillForm = {
  label: string;
  value: string;
  visible: boolean;
};

const emptyForm: SkillForm = {
  label: "",
  value: "",
  visible: true,
};

function SkillFormFields({
  form, setForm, onSave, onCancel,
}: {
  form: SkillForm;
  setForm: React.Dispatch<React.SetStateAction<SkillForm>>;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Label (left column)</label>
          <Input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Systems" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Value (right column)</label>
          <Input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="Rust" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Shown uppercase in the operator profile. Use " · " to list several values.</p>
      <div className="flex items-center gap-2">
        <Switch checked={form.visible} onCheckedChange={(v) => setForm((f) => ({ ...f, visible: v }))} />
        <label className="text-sm">Visible</label>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave}>Save</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </>
  );
}

export default function AdminSkills() {
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  useEffect(() => {
    adminGetSkills(getToken)
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (editingId !== null) {
      const updated = await adminUpdateSkill(editingId, form, getToken);
      setSkills((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
    } else {
      const created = await adminCreateSkill({ ...form, display_order: skills.length }, getToken);
      await applyOrder([...skills, created]);
    }
    setEditingId(null);
    setShowNew(false);
    setForm(emptyForm);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this skill row?")) return;
    await adminDeleteSkill(id, getToken);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // Show the new order immediately, then persist it as 0..n-1 for the whole list
  const applyOrder = async (list: Skill[]) => {
    setSkills(list);
    setSkills(await persistOrder(list, (id, display_order) => adminUpdateSkill(id, { display_order }, getToken)));
  };

  const swap = (a: number, b: number) => applyOrder(swapped(skills, a, b));

  const toggleVisible = async (skill: Skill) => {
    const updated = await adminUpdateSkill(skill.id, { visible: !skill.visible }, getToken);
    setSkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)));
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Skills</h1>
        {!showNew && editingId === null && (
          <Button size="sm" onClick={() => { setShowNew(true); setForm(emptyForm); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Row
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6">The two-column grid in the operator profile section.</p>

      {showNew && (
        <div className="border rounded-xl p-4 mb-6 space-y-4 bg-card">
          <h2 className="font-semibold">New Skill Row</h2>
          <SkillFormFields form={form} setForm={setForm} onSave={save} onCancel={() => { setShowNew(false); setForm(emptyForm); }} />
        </div>
      )}

      <div className="space-y-3">
        {skills.map((skill, index) => {
          if (editingId === skill.id) {
            return (
              <div key={skill.id} className="border rounded-xl p-4 bg-card space-y-4">
                <h2 className="font-semibold">Edit Skill Row</h2>
                <SkillFormFields form={form} setForm={setForm} onSave={save} onCancel={() => { setEditingId(null); setForm(emptyForm); }} />
              </div>
            );
          }
          return (
            <div key={skill.id} className="border rounded-xl p-4 bg-card flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => swap(index - 1, index)} disabled={index === 0}>
                  <ChevronUp className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => swap(index, index + 1)} disabled={index === skills.length - 1}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-2 gap-4">
                <span className="font-semibold truncate">{skill.label}</span>
                <span className="text-muted-foreground truncate">{skill.value}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!skill.visible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
                <Switch checked={!!skill.visible} onCheckedChange={() => toggleVisible(skill)} />
                <Button variant="ghost" size="icon" onClick={() => { setForm({ label: skill.label ?? "", value: skill.value ?? "", visible: !!skill.visible }); setShowNew(false); setEditingId(skill.id); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(skill.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
        {skills.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No skill rows yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
