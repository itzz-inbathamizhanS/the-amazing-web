import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { type Actor, type Movie } from "@/data/spiderverse";
import { newId, useCollection } from "@/lib/content-store";
import {
  AddButton,
  EditToolbar,
  ItemControls,
  RecordDialog,
  ResetButton,
  type Field,
} from "@/components/ContentEditor";

export const Route = createFileRoute("/live-action")({
  head: () => ({
    meta: [
      { title: "Live-Action Movies & Actors — The Amazing Web" },
      {
        name: "description",
        content:
          "Every live-action Spider-Man continuity by actor — Raimi, Amazing, MCU — in watch order, and the crossover where all three met.",
      },
      { property: "og:title", content: "Live-Action Spider-Man Movies & Actors" },
      {
        property: "og:description",
        content:
          "Three screen continuities, three Peter Parkers, one watch order — plus how they connect to the wider Marvel movies.",
      },
    ],
  }),
  component: LiveAction,
});

const actorFields: Field[] = [
  { key: "name", label: "Actor name" },
  { key: "role", label: "Role" },
  { key: "era", label: "Era" },
  { key: "note", label: "Note", type: "textarea" },
  { key: "movies", label: "Films", type: "list", hint: "Film ids, comma separated." },
];

const filmFields: Field[] = [
  { key: "title", label: "Title" },
  { key: "year", label: "Year", type: "number" },
  { key: "continuity", label: "Continuity" },
  { key: "watchOrder", label: "Watch order", type: "number" },
  { key: "summary", label: "Summary", type: "textarea" },
];

function LiveAction() {
  const actorStore = useCollection<Actor>("actors");
  const filmStore = useCollection<Movie>("movies");

  const [editingActor, setEditingActor] = useState<Actor | null>(null);
  const [actorOpen, setActorOpen] = useState(false);
  const [editingFilm, setEditingFilm] = useState<Movie | null>(null);
  const [filmOpen, setFilmOpen] = useState(false);

  const liveAction = filmStore.items
    .filter((m) => m.type === "live-action")
    .sort((a, b) => a.watchOrder - b.watchOrder);

  const getFilm = (id: string) => filmStore.items.find((m) => m.id === id);

  return (
    <>
      <PageHeader
        eyebrow="Screen history"
        title="LIVE-ACTION MOVIES & ACTORS"
        intro="Three separate screen continuities, each with its own Peter Parker — and the film that finally let them share a frame."
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="text-4xl leading-none">THE THREE PETERS</h2>
        <div className="mt-5">
          <EditToolbar>
            <AddButton
              label="Add actor"
              onClick={() => {
                setEditingActor(null);
                setActorOpen(true);
              }}
            />
            {actorStore.hasChanges && <ResetButton onClick={actorStore.resetAll} />}
          </EditToolbar>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {actorStore.items.map((actor) => (
            <article key={actor.id} className="ink-panel relative rounded-lg p-6">
              <ItemControls
                className="absolute right-4 top-4"
                label={actor.name}
                onEdit={() => {
                  setEditingActor(actor);
                  setActorOpen(true);
                }}
                onDelete={() => actorStore.remove(actor.id)}
              />
              <h3 className="pr-20 text-2xl leading-none">{actor.name.toUpperCase()}</h3>
              <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                {actor.era}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{actor.note}</p>
              <ul className="mt-4 space-y-1">
                {actor.movies.map((id) => {
                  const film = getFilm(id);
                  return (
                    <li key={id} className="font-mono text-[0.7rem] text-foreground/80">
                      {film ? `${film.title} (${film.year})` : id}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>

        <h2 className="mt-16 text-4xl leading-none">WATCH ORDER</h2>
        <div className="mt-5">
          <EditToolbar>
            <AddButton
              label="Add film"
              onClick={() => {
                setEditingFilm(null);
                setFilmOpen(true);
              }}
            />
            {filmStore.hasChanges && <ResetButton onClick={filmStore.resetAll} />}
          </EditToolbar>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liveAction.map((film, i) => (
            <div key={film.id} className="ink-panel group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border p-5 transition-colors hover:border-accent">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")} · {film.year}
                </p>
                <h3 className="mt-2 text-2xl leading-tight">{film.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {film.summary || `Part of the ${film.continuity} continuity.`}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {film.continuity}
                </span>
                <ItemControls
                  label={film.title}
                  onEdit={() => {
                    setEditingFilm(film);
                    setFilmOpen(true);
                  }}
                  onDelete={() => filmStore.remove(film.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecordDialog
        open={actorOpen}
        onOpenChange={setActorOpen}
        title={editingActor ? `Edit ${editingActor.name}` : "Add actor"}
        description="Saved in this browser only."
        fields={actorFields}
        initial={editingActor ?? undefined}
        onSave={(values) => {
          if (editingActor) actorStore.update(editingActor.id, values as Partial<Actor>);
          else actorStore.create({ id: newId("actor"), ...(values as Omit<Actor, "id">) });
        }}
      />

      <RecordDialog
        open={filmOpen}
        onOpenChange={setFilmOpen}
        title={editingFilm ? `Edit ${editingFilm.title}` : "Add live-action film"}
        description="Saved in this browser only."
        fields={filmFields}
        initial={editingFilm ?? undefined}
        onSave={(values) => {
          if (editingFilm) filmStore.update(editingFilm.id, values as Partial<Movie>);
          else
            filmStore.create({
              id: newId("film"),
              type: "live-action",
              cast: [],
              characters: [],
              ...(values as Omit<Movie, "id" | "type" | "cast" | "characters">),
            });
        }}
      />
    </>
  );
}
