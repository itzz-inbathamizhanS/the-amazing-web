import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { type Actor, type Movie } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";
import { useMemo } from "react";

export const Route = createFileRoute("/actors/$actorId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.actorId} — The Amazing Web` },
      { name: "description", content: `Actor details for ${params.actorId}.` },
    ],
  }),
  component: ActorDetail,
});

function ActorDetail() {
  const { actorId } = Route.useParams();
  const actorStore = useCollection<Actor>("actors");
  const movieStore = useCollection<Movie>("movies");

  const actor = actorStore.items.find((a) => a.id === actorId);

  const actorMovies = useMemo(() => {
    return movieStore.items.filter((m) =>
      m.cast?.includes(actorId)
    );
  }, [movieStore.items, actorId]);

  if (!actorStore.hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Loading actor…</p>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Actor Not Found</h1>
          <p className="mt-2 text-muted-foreground">This actor hasn't been added to the database yet.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Actor"
        title={actor.name}
        intro={actor.role || "Spider-Verse performer"}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Filmography */}
        {actorMovies.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl leading-none mb-6">FILMOGRAPHY</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {actorMovies.sort((a, b) => a.year - b.year).map((m) => (
                <Link
                  key={m.id}
                  to="/movies/$movieId"
                  params={{ movieId: m.id }}
                  className="ink-panel hover-lift rounded-lg p-5"
                >
                  <p className="font-medium text-foreground">{m.title}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-mono text-sm text-accent">{m.year}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                      {m.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back */}
        <div className="mt-8">
          <Link
            to="/live-action"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
        </div>
      </div>
    </>
  );
}
