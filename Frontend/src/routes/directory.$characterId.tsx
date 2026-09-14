import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  mediumLabel,
  type Character,
  type Earth,
  type TimelineEvent,
  type Movie
} from "@/data/spiderverse";
import { useCollection, mapFromApi } from "@/lib/content-store";
import { EditToolbar, ItemControls, RecordDialog, ResetButton, type Field } from "@/components/ContentEditor";
import { SkeletonCard, SectionError } from "@/components/ui/Skeletons";

const getCharacterFields = (earths: Earth[]): Field[] => [
  { key: "alias", label: "Alias" },
  { key: "name", label: "Name" },
  { key: "realName", label: "Real name" },
  {
    key: "earth",
    label: "Earth",
    type: "select",
    options: earths.map((e) => ({ value: e.id, label: e.designation })),
  },
  { key: "firstAppearance", label: "First appearance" },
  { key: "imageUrl", label: "Image URL", type: "image", placeholder: "/images/characters/hobie-brown.jpg" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "powers", label: "Powers", type: "list" },
  { key: "media", label: "Media", type: "list", hint: "comics, animated, live-action" },
  { key: "tags", label: "Tags", type: "list" },
];

export const Route = createFileRoute("/directory/$characterId")({
  loader: async ({ params }) => {
    try {
      const res = await fetch(`http://localhost:3001/api/characters/${params.characterId}`);
      if (!res.ok) throw notFound();
      const char = await res.json();
      if (!char) throw notFound();
      return { character: mapFromApi("characters", char) };
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Character not found — The Amazing Web" }, { name: "robots", content: "noindex" }],
      };
    }
    const { character } = loaderData;
    const title = `${character.alias} (${character.name}) — The Amazing Web`;
    return {
      meta: [
        { title },
        { name: "description", content: character.description },
        { property: "og:title", content: title },
        { property: "og:description", content: character.description },
      ],
    };
  },
  component: CharacterDetail,
  pendingComponent: () => (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SkeletonCard lines={5} />
    </div>
  ),
  errorComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <SectionError title="Character not found" />
    </div>
  ),
});

function CharacterDetail() {
  const { character: seedCharacter } = Route.useLoaderData();
  const store = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const eventStore = useCollection<TimelineEvent>("timeline-events");
  const filmStore = useCollection<Movie>("movies");
  const [open, setOpen] = useState(false);
  const character = store.items.find((c) => c.id === seedCharacter.id) ?? seedCharacter;
  const earth = earthStore.items.find((e) => e.id === character.earth);
  const events = eventStore.items.filter((e) => e.characters?.includes(character.id) || (Array.isArray(e.characters) === false && e.id && false)); // Since characters in event might not be fully fetched/array in DB, actually timeline-events relation is not returned by the API properly! Wait... wait, timeline-events API does not return characters list in my content-store mapping. 
  const films = filmStore.items.filter((m) => m.characters?.includes(character.id));
  const related = character.related?.map((id) => store.items.find(c => c.id === id)).filter(Boolean) || [];

  return (
    <>
      <div className="void-wash relative border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: earth?.hex }}
        />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/directory"
              className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-accent hover:underline"
            >
              ← Directory
            </Link>
            <EditToolbar>
              <ItemControls
                label={character.alias}
                onEdit={() => setOpen(true)}
              />
              {store.hasChanges && <ResetButton onClick={store.resetAll} />}
            </EditToolbar>
          </div>
          <div className="mt-6 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground">
                {earth?.designation}
              </p>
              <h1 className="mt-2 text-6xl leading-[0.9] text-glow sm:text-7xl">{character.alias}</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {character.name} · {character.realName}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {character.media.map((m) => (
                  <span
                    key={m}
                    className="rounded border border-border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-foreground/75"
                  >
                    {mediumLabel[m]}
                  </span>
                ))}
                {character.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-foreground/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            {character.imageUrl && (
              <div className="shrink-0">
                <img 
                  src={character.imageUrl} 
                  alt={character.alias} 
                  referrerPolicy="no-referrer"
                  className="h-64 w-auto rounded-xl border border-border/60 object-cover shadow-2xl" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 lg:grid-cols-3">
        <section className="ink-panel rounded-lg p-6 lg:col-span-2">
          <h2 className="text-3xl leading-none">WHO THEY ARE</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {character.description}
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                First appearance
              </dt>
              <dd className="mt-1 text-sm text-foreground/85">{character.firstAppearance}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                Home universe
              </dt>
              <dd className="mt-1 text-sm text-foreground/85">{earth?.description}</dd>
            </div>
          </dl>
        </section>

        <section className="ink-panel rounded-lg p-6">
          <h2 className="text-3xl leading-none">ABILITIES</h2>
          <ul className="mt-3 space-y-2">
            {character.powers.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: earth?.hex }}
                />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="ink-panel rounded-lg p-6 lg:col-span-2">
          <h2 className="text-3xl leading-none">STORY BRANCH POINTS</h2>
          {events.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No comics events logged for this version yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {events.map((e) => (
                <li key={e.id} className="border-l-2 border-border pl-4">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                    {e.dateRange}
                    {e.crossover ? " · crossover" : ""}
                  </p>
                  <p className="font-display text-2xl leading-none">{e.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ink-panel rounded-lg p-6">
          <h2 className="text-3xl leading-none">ON SCREEN</h2>
          {films.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Comics only, so far.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {films.map((m) => (
                <li key={m.id} className="text-sm text-muted-foreground">
                  <span className="text-foreground/90">{m.title}</span> · {m.year}
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-6 font-display text-2xl leading-none">RELATED</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {related.map((r) => (
              <Link
                key={r!.id}
                to="/directory/$characterId"
                params={{ characterId: r!.id }}
                className="rounded border border-border px-2 py-1 text-xs text-foreground/80 hover:border-accent"
              >
                {r!.alias} · {r!.name}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
          {store.items.length} variants in the directory
        </p>
      </div>


      <RecordDialog
        open={open}
        onOpenChange={setOpen}
        title={`Edit ${character.alias}`}
        description="Saved in this browser only."
        fields={getCharacterFields(earthStore.items)}
        initial={character}
        onSave={(values) => store.update(character.id, values as Partial<Character>)}
      />
    </>
  );
}
