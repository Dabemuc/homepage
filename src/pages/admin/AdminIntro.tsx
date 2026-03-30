import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminGetIntro, adminUpdateIntro } from "@/lib/api";

export default function AdminIntro() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    adminGetIntro(getToken)
      .then((data) => {
        if (data) {
          setForm({
            name: data.name ?? "",
            tagline: data.tagline ?? "",
            bio: data.bio ?? "",
            avatar_url: data.avatar_url ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [getToken]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateIntro(form, getToken);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Intro</h1>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Tagline</label>
          <Input
            value={form.tagline}
            onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
            placeholder="A short subtitle"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Bio</label>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A longer bio paragraph"
            rows={5}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Avatar URL</label>
          <Input
            value={form.avatar_url}
            onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
            placeholder="/screenshots/avatar.jpg or https://..."
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
