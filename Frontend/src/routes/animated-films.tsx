import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { type Movie, type Character } from "@/data/spiderverse";
import { newId, useCollection } from "@/lib/content-store";
import {
  AddButton,
  EditToolbar,
  ItemControls,
  RecordDialog,
  ResetButton,
  type Field,
} from "@/components/ContentEditor";

export const Route = createFileRoute("/animated-films")({
  head: () => ({
    meta: [
      { title: "The Animated Trilogy — The Amazing Web" },
      {
        name: "description",
        content:
          "Into the Spider-Verse, Across the Spider-Verse and Beyond the Spider-Verse: one animated continuity, and how each film's cast maps onto the Spider-People directory.",
      },
      { property: "og:title", content: "The Animated Spider-Verse Trilogy" },
      {
        property: "og:description",
        content:
          "Three animated films, one continuity, with every featured Spider-variant linked to its directory entry.",
      },
    ],
  }),
  component: AnimatedFilms,
});

const fields: Field[] = [
  { key: "title", label: "Title" },
  { key: "year", label: "Year", type: "number" },
  { key: "continuity", label: "Continuity" },
  { key: "watchOrder", label: "Watch order", type: "number" },
  { key: "summary", label: "Summary", type: "textarea" },
  {
    key: "characters",
    label: "Characters",
    type: "list",
    hint: "Directory ids, comma separated (e.g. miles-morales, gwen-stacy).",
  },
];

function AnimatedFilms() {
  const store = useCollection<Movie>("movies");
  const charStore = useCollection<Character>("characters");
  const [editing, setEditing] = useState<Movie | null>(null);
  const [open, setOpen] = useState(false);

  const animated = store.items
    .filter((m) => m.type === "animated")
    .sort((a, b) => a.watchOrder - b.watchOrder);

  return (
    <>
      <PageHeader
        eyebrow="Animated continuity"
        title="THE ANIMATED TRILOGY"
        intro="A single animated storyline running across three films. Each entry lists the Spider-People it introduces, linked back to their directory pages."
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-14 sm:px-6">
        <EditToolbar>
          <AddButton
            label="Add film"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
          {store.hasChanges && <ResetButton onClick={store.resetAll} />}
        </EditToolbar>

        {animated.map((film, i) => (
          <article key={film.id} className="ink-panel relative rounded-lg p-6">
            <ItemControls
              className="absolute right-5 top-5"
              label={film.title}
              onEdit={() => {
                setEditing(film);
                setOpen(true);
              }}
              onDelete={() => store.remove(film.id)}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-3 pr-20">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent">
                  Film {String(i + 1).padStart(2, "0")} · {film.year}
                </p>
                <h2 className="mt-2 text-4xl leading-none">{film.title.toUpperCase()}</h2>
              </div>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {film.continuity}
              </p>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {film.summary}
            </p>

            {film.characters.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {film.characters.map((id) => {
                  const character = charStore.items.find((c) => c.id === id);
                  if (!character) return null;
                  return (
                    <Link
                      key={id}
                      to="/directory/$characterId"
                      params={{ characterId: id }}
                      className="rounded-full border border-border px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-foreground/85 transition-colors hover:border-accent hover:text-accent"
                    >
                      {character.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>

      <RecordDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.title}` : "Add animated film"}
        description="Saved in this browser only."
        fields={fields}
        initial={editing ?? undefined}
        onSave={(values) => {
          if (editing) store.update(editing.id, values as Partial<Movie>);
          else
            store.create({
              id: newId("film"),
              type: "animated",
              cast: [],
              ...(values as Omit<Movie, "id" | "type" | "cast">),
            });
        }}
      />
    </>
  );
}
