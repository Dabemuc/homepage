import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import {
  adminGetCareer,
  adminCreateSection,
  adminUpdateSection,
  adminDeleteSection,
  adminCreateEntry,
  adminUpdateEntry,
  adminDeleteEntry,
} from "@/lib/api";
import type { CareerSection } from "@/lib/api";

type SectionForm = { title: string; visible: boolean };
type EntryForm = { timestamp: string; title: string; description: string };

const emptySectionForm: SectionForm = { title: "", visible: true };
const emptyEntryForm: EntryForm = { timestamp: "", title: "", description: "" };

export default function AdminCareer() {
  const { getToken } = useAuth();
  const [sections, setSections] = useState<CareerSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [showNewSection, setShowNewSection] = useState(false);
  const [sectionForm, setSectionForm] = useState<SectionForm>(emptySectionForm);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [showNewEntry, setShowNewEntry] = useState<number | null>(null); // section id
  const [entryForm, setEntryForm] = useState<EntryForm>(emptyEntryForm);

  const load = () =>
    adminGetCareer(getToken)
      .then(setSections)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const saveSection = async () => {
    const data = { ...sectionForm, display_order: sections.length + 1 };
    if (editingSectionId !== null) {
      const updated = await adminUpdateSection(editingSectionId, data, getToken);
      setSections((prev) => prev.map((s) => (s.id === editingSectionId ? { ...s, ...updated } : s)));
    } else {
      const created = await adminCreateSection(data, getToken) as CareerSection;
      setSections((prev) => [...prev, { ...created, entries: [] }]);
    }
    setEditingSectionId(null);
    setShowNewSection(false);
    setSectionForm(emptySectionForm);
  };

  const deleteSection = async (id: number) => {
    if (!confirm("Delete this section and all its entries?")) return;
    await adminDeleteSection(id, getToken);
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const saveEntry = async (sectionId: number) => {
    const entries = sections.find((s) => s.id === sectionId)?.entries ?? [];
    const data = { ...entryForm, section_id: sectionId, display_order: entries.length + 1 };
    if (editingEntryId !== null) {
      const updated = await adminUpdateEntry(editingEntryId, data, getToken);
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, entries: s.entries.map((e) => (e.id === editingEntryId ? updated : e)) }
            : s
        )
      );
    } else {
      const created = await adminCreateEntry(data, getToken);
      setSections((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, entries: [...s.entries, created] } : s))
      );
    }
    setEditingEntryId(null);
    setShowNewEntry(null);
    setEntryForm(emptyEntryForm);
  };

  const deleteEntry = async (sectionId: number, entryId: number) => {
    if (!confirm("Delete this entry?")) return;
    await adminDeleteEntry(entryId, getToken);
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) } : s
      )
    );
  };

  const toggleSectionVisible = async (section: CareerSection) => {
    const updated = await adminUpdateSection(section.id, { visible: !section.visible }, getToken);
    setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, ...updated } : s)));
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Career</h1>
        {!showNewSection && editingSectionId === null && (
          <Button size="sm" onClick={() => { setShowNewSection(true); setSectionForm(emptySectionForm); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Section
          </Button>
        )}
      </div>

      {(showNewSection || editingSectionId !== null) && (
        <div className="border rounded-xl p-4 mb-6 space-y-4 bg-card">
          <h2 className="font-semibold">{editingSectionId !== null ? "Edit Section" : "New Section"}</h2>
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input value={sectionForm.title} onChange={(e) => setSectionForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={sectionForm.visible} onCheckedChange={(v) => setSectionForm((f) => ({ ...f, visible: v }))} />
            <label className="text-sm">Visible</label>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveSection}>Save</Button>
            <Button variant="outline" onClick={() => { setEditingSectionId(null); setShowNewSection(false); setSectionForm(emptySectionForm); }}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-xl bg-card overflow-hidden">
            <div className="p-4 bg-muted/30 flex items-center gap-3">
              <span className="font-semibold flex-1">{section.title}</span>
              {!section.visible && <Badge variant="outline" className="text-xs">Hidden</Badge>}
              <Switch checked={!!section.visible} onCheckedChange={() => toggleSectionVisible(section)} />
              <Button variant="ghost" size="icon" onClick={() => { setEditingSectionId(section.id); setSectionForm({ title: section.title ?? "", visible: !!section.visible }); setShowNewSection(false); }}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteSection(section.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            {/* Entries */}
            <div className="p-4 space-y-3">
              {section.entries.map((entry, entryIndex) => {
                if (editingEntryId === entry.id) {
                  return (
                    <div key={entry.id} className="border rounded-lg p-3 space-y-3 bg-background">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block">Timestamp</label>
                          <Input value={entryForm.timestamp} onChange={(e) => setEntryForm((f) => ({ ...f, timestamp: e.target.value }))} placeholder="Oct 2023" />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block">Title</label>
                          <Input value={entryForm.title} onChange={(e) => setEntryForm((f) => ({ ...f, title: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Description (Markdown)</label>
                        <Textarea value={entryForm.description} onChange={(e) => setEntryForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEntry(section.id)}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingEntryId(null); setEntryForm(emptyEntryForm); }}>Cancel</Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg bg-background">
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={async () => {
                        if (entryIndex === 0) return;
                        const newEntries = [...section.entries];
                        [newEntries[entryIndex - 1], newEntries[entryIndex]] = [newEntries[entryIndex], newEntries[entryIndex - 1]];
                        setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, entries: newEntries } : s));
                        await Promise.all([
                          adminUpdateEntry(newEntries[entryIndex - 1].id, { display_order: entryIndex - 1 }, getToken),
                          adminUpdateEntry(newEntries[entryIndex].id, { display_order: entryIndex }, getToken),
                        ]);
                      }} disabled={entryIndex === 0}>
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={async () => {
                        if (entryIndex === section.entries.length - 1) return;
                        const newEntries = [...section.entries];
                        [newEntries[entryIndex], newEntries[entryIndex + 1]] = [newEntries[entryIndex + 1], newEntries[entryIndex]];
                        setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, entries: newEntries } : s));
                        await Promise.all([
                          adminUpdateEntry(newEntries[entryIndex].id, { display_order: entryIndex }, getToken),
                          adminUpdateEntry(newEntries[entryIndex + 1].id, { display_order: entryIndex + 1 }, getToken),
                        ]);
                      }} disabled={entryIndex === section.entries.length - 1}>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-primary">{entry.timestamp}</span>
                        <span className="font-medium text-sm">{entry.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{entry.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingEntryId(entry.id); setEntryForm({ timestamp: entry.timestamp ?? "", title: entry.title ?? "", description: entry.description ?? "" }); setShowNewEntry(null); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteEntry(section.id, entry.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {/* New entry form */}
              {showNewEntry === section.id ? (
                <div className="border rounded-lg p-3 space-y-3 bg-background">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Timestamp</label>
                      <Input value={entryForm.timestamp} onChange={(e) => setEntryForm((f) => ({ ...f, timestamp: e.target.value }))} placeholder="Oct 2023" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Title</label>
                      <Input value={entryForm.title} onChange={(e) => setEntryForm((f) => ({ ...f, title: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Description (Markdown)</label>
                    <Textarea value={entryForm.description} onChange={(e) => setEntryForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEntry(section.id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => { setShowNewEntry(null); setEntryForm(emptyEntryForm); }}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setShowNewEntry(section.id); setEntryForm(emptyEntryForm); setEditingEntryId(null); }}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
                </Button>
              )}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center text-muted-foreground py-8">No sections yet. Add one above.</div>
        )}
      </div>
    </div>
  );
}
