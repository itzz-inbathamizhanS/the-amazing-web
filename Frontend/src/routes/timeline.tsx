import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MultiverseStage } from "@/components/MultiverseStage";
import { PageHeader } from "@/components/SiteChrome";
import {
  type Character,
  type Earth,
  type TimelineEvent,
} from "@/data/spiderverse";
import { useCollection, newId } from "@/lib/content-store";
import { useIsAdmin } from "@/hooks/use-admin";
import { ItemControls, RecordDialog, ResetButton, type Field } from "@/components/ContentEditor";
import { SkeletonTimeline } from "@/components/ui/Skeletons";

const seedFields: Field[] = [
  { key: "title", label: "Title" },
  { key: "year", label: "Year", type: "number" },
  { key: "dateRange", label: "Date range" },
  { key: "summary", label: "Summary", type: "textarea" },
  { key: "issues", label: "Issues", type: "list" },
];

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Comics Timeline — The Amazing Web" },
      {
        name: "description",
        content:
          "The full branching timeline of Spider-Verse comics events, from the first bite to the multiverse crossovers, in an explorable 3D view or a plain list.",
      },
      { property: "og:title", content: "Comics Timeline — The Amazing Web" },
      {
        property: "og:description",
        content:
          "Explore Spider-Verse comics events as a branching 3D timeline, or read them as a straightforward chronological list.",
      },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const isAdmin = useIsAdmin();
  const [view, setView] = useState<"3d" | "list">("3d");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const earthStore = useCollection<Earth>("earths");
  const charStore = useCollection<Character>("characters");
  const emptyForm = {
    title: "",
    year: String(new Date().getFullYear()),
    dateRange: "",
    summary: "",
    branch: earthStore.items[0]?.id ?? "earth-616",
    issues: "",
  };
  const [form, setForm] = useState(emptyForm);
  const seedStore = useCollection<TimelineEvent>("timeline-events");
  const [editingSeed, setEditingSeed] = useState<TimelineEvent | null>(null);
  const [seedOpen, setSeedOpen] = useState(false);

  const ordered = [...seedStore.items].sort((a, b) => a.year - b.year);

  const closeForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const startEdit = (id: string) => {
    const ev = seedStore.items.find((m) => m.id === id);
    if (!ev) return;
    setForm({
      title: ev.title,
      year: String(ev.year),
      dateRange: ev.dateRange || "",
      summary: ev.summary || "",
      branch: ev.branch,
      issues: ev.issues ? ev.issues.join(", ") : "",
    });
    setEditingId(id);
    setView("list");
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const input = {
      title: form.title.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      dateRange: form.dateRange.trim(),
      summary: form.summary.trim(),
      branch: form.branch,
      issues: form.issues
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editingId) {
      seedStore.update(editingId, input);
    } else {
      seedStore.create({
        id: newId("event"),
        characters: [],
        ...input,
      } as TimelineEvent);
    }
    closeForm();
    setView("list");
  };

  const field =
    "w-full rounded-md border border-border bg-void/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none";

  return (
    <>
      <PageHeader
        eyebrow="Comics timeline"
        title="THE WHOLE AMAZING WEB"
        intro="Drag through the multiverse in 3D, or switch to the list view for the same events as plain text."
      />

      <div className="mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-3 px-4 py-8 sm:px-6">
        <div
          role="tablist"
          aria-label="Timeline view"
          className="inline-flex rounded-full border border-border p-1"
        >
          {(["3d", "list"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {v === "3d" ? "3D map" : "List view"}
            </button>
          ))}
        </div>

        {isAdmin && (
        <button
          type="button"
          onClick={() => (open ? closeForm() : setOpen(true))}
          className="rounded-full border border-accent/60 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10"
        >
          {open ? "Cancel" : "+ Add an entry"}
        </button>
        )}
        {seedStore.hasChanges && <ResetButton onClick={seedStore.resetAll} />}
      </div>

      {open && isAdmin && (
        <div className="mx-auto max-w-[110rem] px-4 pb-8 sm:px-6">
          <form
            onSubmit={submit}
            className="grid gap-4 rounded-xl border border-border bg-void/40 p-5 sm:grid-cols-2"
          >
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Title
              </span>
              <input
                className={field}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Spider-Geddon"
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Year
              </span>
              <input
                className={field}
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Date range (optional)
              </span>
              <input
                className={field}
                value={form.dateRange}
                onChange={(e) => setForm({ ...form, dateRange: e.target.value })}
                placeholder="2018–2019"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Earth / branch
              </span>
              <select
                className={field}
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                {earthStore.items.map((earth) => (
                  <option key={earth.id} value={earth.id}>
                    {earth.designation}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Issues (comma separated)
              </span>
              <input
                className={field}
                value={form.issues}
                onChange={(e) => setForm({ ...form, issues: e.target.value })}
                placeholder="Spider-Geddon #1, #2"
              />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
                Summary
              </span>
              <textarea
                className={`${field} min-h-24`}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="What happens, in your own words."
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-primary px-5 py-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground"
              >
                {editingId ? "Save changes" : "Save entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={closeForm}
                  className="ml-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
                >
                  Cancel edit
                </button>
              )}
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                Saved in this browser only · a shared database can come later
              </p>
            </div>
          </form>
        </div>
      )}

      {view === "3d" ? (
        <div className="px-2 pb-16 sm:px-4">
          <MultiverseStage
            mode="page"
            className="h-[88vh] min-h-[640px] w-full rounded-2xl border border-border"
          />
          <p className="mx-auto mt-3 max-w-[110rem] px-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:px-2">
            Click a branch to fly to it · hover a node for its title and year · click a node for the
            summary
          </p>
        </div>
      ) : !seedStore.hydrated ? (
        <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <SkeletonTimeline count={5} />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <ol className="relative border-l border-border pl-6">
            {ordered.map((e) => {
              const earth = earthStore.items.find(earth => earth.id === e.branch);
              const accent = e.crossover ? "#ffd9a0" : earth?.hex ?? "#ff3b5c";
              return (
                <li key={e.id} className="relative pb-10">
                  <span
                    aria-hidden
                    className="absolute -left-[1.9rem] top-1.5 size-3 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
                  />
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-accent">
                    {e.dateRange} · {earth?.designation ?? (e.crossover ? "Crossover" : e.branch)}
                  </p>
                  <h2 className="mt-1 text-3xl leading-none">{e.title}</h2>
                  {e.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
                  )}
                  {e.issues && e.issues.length > 0 && (
                    <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-muted-foreground">
                      {e.issues.join(" · ")}
                    </p>
                  )}
                  {e.characters && e.characters.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.characters.map((id) => {
                        const c = charStore.items.find(char => char.id === id);
                        if (!c) return null;
                        return (
                          <Link
                            key={id}
                            to="/directory/$characterId"
                            params={{ characterId: id }}
                            className="rounded border border-border px-2 py-0.5 text-xs text-foreground/80 hover:border-accent"
                          >
                            {c.alias}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  {isAdmin && (
                    <div className="mt-3 flex gap-4">
                      <button
                        type="button"
                        onClick={() => startEdit(e.id)}
                        className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingId === e.id) closeForm();
                          seedStore.remove(e.id);
                        }}
                        className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <RecordDialog
        open={seedOpen}
        onOpenChange={setSeedOpen}
        title={editingSeed ? `Edit ${editingSeed.title}` : "Edit event"}
        description="Saved in this browser only."
        fields={seedFields}
        initial={editingSeed ?? undefined}
        onSave={(values) => {
          if (editingSeed) seedStore.update(editingSeed.id, values as Partial<TimelineEvent>);
        }}
      />
    </>
  );
}

