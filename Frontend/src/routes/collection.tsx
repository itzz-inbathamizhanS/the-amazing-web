import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { newId, useCollection } from "@/lib/content-store";
import { useIsAdmin } from "@/hooks/use-admin";
import {
  AddButton,
  EditToolbar,
  ItemControls,
  RecordDialog,
  ResetButton,
  type Field,
} from "@/components/ContentEditor";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "My Comics Collection — The Amazing Web" },
      {
        name: "description",
        content:
          "A personal library for logging owned Spider-Verse comics: issues, storylines and reading notes, kept alongside the multiverse map.",
      },
      { property: "og:title", content: "My Comics Collection" },
      {
        property: "og:description",
        content:
          "The personal shelf: log owned Spider-Verse issues and reading notes next to the branching timeline.",
      },
    ],
  }),
  component: Collection,
});

type Comic = {
  id: string;
  title: string;
  issue: string;
  year: number;
  storyline: string;
  status: string;
  notes: string;
};

const fields: Field[] = [
  { key: "title", label: "Title", placeholder: "The Amazing Spider-Man" },
  { key: "issue", label: "Issue", placeholder: "#300" },
  { key: "year", label: "Year", type: "number" },
  { key: "storyline", label: "Storyline", placeholder: "Spider-Verse (2014)" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "Owned", label: "Owned" },
      { value: "Read", label: "Read" },
      { value: "Wanted", label: "Still hunting" },
    ],
  },
  { key: "notes", label: "Notes", type: "textarea" },
];

function Collection() {
  const isAdmin = useIsAdmin();
  const store = useCollection<Comic>("collection", []);
  const [editing, setEditing] = useState<Comic | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Personal shelf"
        title="MY COMICS COLLECTION"
        intro="Your own library of Spider-Verse issues. Add what you own, what you've read and what you're still hunting for."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <EditToolbar>
          <AddButton
            label="Log a comic"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
          {store.hasChanges && <ResetButton onClick={store.resetAll} />}
        </EditToolbar>

        {store.hydrated && store.items.length === 0 && (
          <div className="ink-panel rounded-lg p-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent">
              Empty shelf
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {isAdmin
                ? "Nothing logged yet. Add your first issue — entries are saved in this browser, so they'll be waiting when you come back on this device."
                : "Nothing on the shelf yet. Check back soon."}
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {store.items.map((comic) => (
            <article key={comic.id} className="ink-panel relative rounded-lg p-6">
              <ItemControls
                className="absolute right-4 top-4"
                label={`${comic.title} ${comic.issue}`}
                onEdit={() => {
                  setEditing(comic);
                  setOpen(true);
                }}
                onDelete={() => store.remove(comic.id)}
              />
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                {comic.status || "Owned"}
              </p>
              <h2 className="mt-2 pr-20 text-2xl leading-none">{comic.title.toUpperCase()}</h2>
              <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">
                {[comic.issue, comic.year || null].filter(Boolean).join(" · ")}
              </p>
              {comic.storyline && (
                <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-foreground/70">
                  {comic.storyline}
                </p>
              )}
              {comic.notes && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{comic.notes}</p>
              )}
            </article>
          ))}
        </div>
      </div>

      <RecordDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.title}` : "Log a comic"}
        description="Saved in this browser only."
        fields={fields}
        initial={editing ?? { status: "Owned" }}
        onSave={(values) => {
          if (editing) store.update(editing.id, values as Partial<Comic>);
          else store.create({ id: newId("comic"), ...(values as Omit<Comic, "id">) });
        }}
      />
    </>
  );
}
