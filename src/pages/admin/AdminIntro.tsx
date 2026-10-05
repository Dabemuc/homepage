import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminGetIntro, adminUpdateIntro } from "@/lib/api";
import { DEFAULT_BUILD_LOG } from "@/lib/station";

export default function AdminIntro() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    bio: "",
    on_air_since: "",
    station_name: "",
    station_frequency: "",
    build_log: "",
  });

  useEffect(() => {
    adminGetIntro(getToken)
      .then((data) => {
        if (data) {
          setForm({
            name: data.name ?? "",
            tagline: data.tagline ?? "",
            bio: data.bio ?? "",
            on_air_since: data.on_air_since ?? "",
            station_name: data.station_name ?? "",
            station_frequency: data.station_frequency ?? "",
            build_log: data.build_log ?? "",
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
          <label className="text-sm font-medium mb-1 block">Name / Callsign</label>
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
          <p className="text-xs text-muted-foreground mt-1">Shown next to the headline at the top of the page</p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Bio</label>
          <Textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="A longer bio paragraph"
            rows={5}
          />
          <p className="text-xs text-muted-foreground mt-1">Shown in the operator profile</p>
        </div>
        <div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Station name</label>
              <Input
                value={form.station_name}
                onChange={(e) => setForm((f) => ({ ...f, station_name: e.target.value }))}
                placeholder="Station D"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Frequency (MHz)</label>
              <Input
                value={form.station_frequency}
                onChange={(e) => setForm((f) => ({ ...f, station_frequency: e.target.value }))}
                placeholder="147.300"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Top bar shows "{form.station_name || "Station D"} — {form.station_frequency || "147.300"} MHz"; the frequency also appears on the QSL card
          </p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Build log</label>
          <Textarea
            value={form.build_log}
            onChange={(e) => setForm((f) => ({ ...f, build_log: e.target.value }))}
            placeholder={DEFAULT_BUILD_LOG.join("\n")}
            rows={4}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Typed line by line into the hero terminal while the mast builds; ends with "DEPLOYED — ON AIR". Keep lines short (~28 characters). Empty uses the placeholder.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">On air since</label>
          <Input
            type="date"
            value={form.on_air_since}
            onChange={(e) => setForm((f) => ({ ...f, on_air_since: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground mt-1">Drives the "LIVE — DAY n" counter. Leave empty to hide it.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
