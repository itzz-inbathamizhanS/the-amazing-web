import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { type Character, type Earth, type TimelineEvent } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";
import { useMemo } from "react";

export const Route = createFileRoute("/earths/$earthId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.earthId} — The Amazing Web` },
      { name: "description", content: `Explore ${params.earthId} in the Spider-Verse multiverse.` },
    ],
  }),
  component: EarthDetail,
});

function EarthDetail() {
  const { earthId } = Route.useParams();
  const earthStore = useCollection<Earth>("earths");
  const charStore = useCollection<Character>("characters");
  const eventStore = useCollection<TimelineEvent>("timeline-events");

  const earth = earthStore.items.find((e) => e.id === earthId);
  const characters = useMemo(
    () => charStore.items.filter((c) => c.earth === earthId || (c as any).earthId === earthId),
    [charStore.items, earthId]
  );
  const events = useMemo(
    () => eventStore.items.filter((e) => e.branch === earthId),
    [eventStore.items, earthId]
  );

  if (!earthStore.hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Loading universe data…</p>
      </div>
    );
  }

  if (!earth) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Universe Not Found</h1>
          <p className="mt-2 text-muted-foreground">This Earth hasn't been mapped yet.</p>
          <Link to="/directory" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Universe"
        title={earth.designation}
        intro={earth.description || `Explore the characters and events of ${earth.designation}.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Earth Color Indicator */}
        <div className="mb-10 flex items-center gap-4">
          <span
            className="size-6 rounded-full"
            style={{ backgroundColor: earth.hex, boxShadow: `0 0 20px ${earth.hex}` }}
            aria-hidden
          />
          <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {earth.hex}
          </span>
        </div>

        {/* Characters Section */}
        {characters.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl leading-none mb-6">CHARACTERS</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {characters.map((c) => (
                <Link
                  key={c.id}
                  to="/directory/$characterId"
                  params={{ characterId: c.id }}
                  className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4"
                >
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.alias || c.name}
                      className="size-12 rounded-full object-cover border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="flex size-12 items-center justify-center rounded-full border border-border bg-background/50 text-lg font-bold text-accent"
                    >
                      {(c.alias || c.name).charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{c.alias || c.name}</p>
                    <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground truncate">
                      {c.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Events Section */}
        {events.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl leading-none mb-6">TIMELINE EVENTS</h2>
            <div className="space-y-3">
              {events.sort((a, b) => a.year - b.year).map((e) => (
                <div key={e.id} className="ink-panel rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{e.title}</p>
                    {e.summary && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.summary}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-sm text-accent">{e.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link
            to="/what-is-the-spider-verse"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors"
          >
            ← All Universes
          </Link>
        </div>
      </div>
    </>
  );
}
