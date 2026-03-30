import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import {
  adminGetSocials,
  adminCreateSocial,
  adminUpdateSocial,
  adminDeleteSocial,
} from "@/lib/api";
import type { SocialLink } from "@/lib/api";

type SocialForm = {
  platform: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
};

const emptyForm: SocialForm = {
  platform: "",
  label: "",
  url: "",
  icon: "",
  visible: true,
};

export default function AdminSocials() {
  const { getToken } = useAuth();
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState<SocialForm>(emptyForm);

  useEffect(() => {
    adminGetSocials(getToken)
      .then(setSocials)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const data = { ...form, display_order: editingId !== null ? undefined : socials.length + 1 };
    if (editingId !== null) {
      const updated = await adminUpdateSocial(editingId, data, getToken);
      setSocials((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
    } else {
      const created = await adminCreateSocial(data, getToken);
      setSocials((prev) => [...prev, created]);
    }
    setEditingId(null);
    setShowNew(false);
    setForm(emptyForm);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this social link?")) return;
    await adminDeleteSocial(id, getToken);
    setSocials((prev) => prev.filter((s) => s.id !== id));
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newList = [...socials];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    setSocials(newList);
    await Promise.all([
      adminUpdateSocial(newList[index - 1].id, { display_order: index - 1 }, getToken),
      adminUpdateSocial(newList[index].id, { display_order: index }, getToken),
    ]);
  };

  const moveDown = async (index: number) => {
    if (index === socials.length - 1) return;
    const newList = [...socials];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setSocials(newList);
    await Promise.all([
      adminUpdateSocial(newList[index].id, { display_order: index }, getToken),
      adminUpdateSocial(newList[index + 1].id, { display_order: index + 1 }, getToken),
    ]);
  };

  const toggleVisible = async (social: SocialLink) => {
    const updated = await adminUpdateSocial(social.id, { visible: !social.visible }, getToken);
    setSocials((prev) => prev.map((s) => (s.id === social.id ? updated : s)));
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Socials</h1>
        {!showNew && editingId === null && (
          <Button size="sm" onClick={() => { setShowNew(true); setForm(emptyForm); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Link
          </Button>
        )}
      </div>

      {(showNew || editingId !== null) && (
        <div className="border rounded-xl p-4 mb-6 space-y-4 bg-card">
          <h2 className="font-semibold">{editingId !== null ? "Edit Social Link" : "New Social Link"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Platform</label>
              <Input value={form.platform} onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))} placeholder="github" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Label</label>
              <Input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="GitHub" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">URL</label>
            <Input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Lucide Icon Name</label>
            <Input value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="Github, Linkedin, Mail, Twitter..." />
            <p className="text-xs text-muted-foreground mt-1">Use a PascalCase lucide-react icon name</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.visible} onCheckedChange={(v) => setForm((f) => ({ ...f, visible: v }))} />
            <label className="text-sm">Visible</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => { setEditingId(null); setShowNew(false); setForm(emptyForm); }}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {socials.map((social, index) => (
          <div key={social.id} className="border rounded-xl p-4 bg-card flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveUp(index)} disabled={index === 0}>
                <ChevronUp className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveDown(index)} disabled={index === socials.length - 1}>
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold">{social.label}</span>
                {social.icon && <Badge variant="outline" className="text-xs">{social.icon}</Badge>}
                {!social.visible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
              </div>
              <p className="text-sm text-muted-foreground truncate">{social.url}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Switch checked={!!social.visible} onCheckedChange={() => toggleVisible(social)} />
              <Button variant="ghost" size="icon" onClick={() => { setEditingId(social.id); setForm({ platform: social.platform ?? "", label: social.label ?? "", url: social.url ?? "", icon: social.icon ?? "", visible: !!social.visible }); setShowNew(false); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(social.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {socials.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No social links yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
