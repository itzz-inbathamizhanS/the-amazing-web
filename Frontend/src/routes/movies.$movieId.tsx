import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteChrome";
import { type Movie, type Character, type Actor } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";
import { useMemo } from "react";

export const Route = createFileRoute("/movies/$movieId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.movieId} — The Amazing Web` },
      { name: "description", content: `Movie details for ${params.movieId}.` },
    ],
  }),
  component: MovieDetail,
});

function MovieDetail() {
  const { movieId } = Route.useParams();
  const movieStore = useCollection<Movie>("movies");
  const charStore = useCollection<Character>("characters");
  const actorStore = useCollection<Actor>("actors");

  const movie = movieStore.items.find((m) => m.id === movieId);

  const movieCharacters = useMemo(() => {
    if (!movie?.characters) return [];
    return movie.characters
      .map((cId: string) => charStore.items.find((c) => c.id === cId))
      .filter(Boolean) as Character[];
  }, [movie, charStore.items]);

  const movieActors = useMemo(() => {
    if (!movie?.cast) return [];
    return movie.cast
      .map((aId: string) => actorStore.items.find((a) => a.id === aId))
      .filter(Boolean) as Actor[];
  }, [movie, actorStore.items]);

  if (!movieStore.hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Loading movie…</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Movie Not Found</h1>
          <p className="mt-2 text-muted-foreground">This film hasn't been added to the database yet.</p>
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
        eyebrow={movie.type === "live-action" ? "Live-Action Film" : "Animated Film"}
        title={movie.title}
        intro={`Released in ${movie.year}${movie.continuity ? ` · ${movie.continuity} continuity` : ""}`}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Movie Info */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="ink-panel rounded-lg p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">Year</p>
            <p className="mt-1 text-3xl font-bold text-accent">{movie.year}</p>
          </div>
          <div className="ink-panel rounded-lg p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">Type</p>
            <p className="mt-1 text-lg font-medium text-foreground capitalize">{movie.type}</p>
          </div>
          {movie.watchOrder && (
            <div className="ink-panel rounded-lg p-5">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">Watch Order</p>
              <p className="mt-1 text-3xl font-bold text-foreground">#{movie.watchOrder}</p>
            </div>
          )}
        </div>

        {/* Cast */}
        {movieActors.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl leading-none mb-6">CAST</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {movieActors.map((a) => (
                <Link
                  key={a.id}
                  to="/actors/$actorId"
                  params={{ actorId: a.id }}
                  className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-border bg-accent/10 text-sm font-bold text-accent">
                    {a.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{a.name}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{a.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Characters */}
        {movieCharacters.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl leading-none mb-6">CHARACTERS</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {movieCharacters.map((c) => (
                <Link
                  key={c.id}
                  to="/directory/$characterId"
                  params={{ characterId: c.id }}
                  className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4"
                >
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.alias || c.name} className="size-10 rounded-full object-cover border border-border" loading="lazy" />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background/50 text-sm font-bold text-accent">
                      {(c.alias || c.name).charAt(0)}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{c.alias || c.name}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{c.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          <Link
            to={movie.type === "live-action" ? "/live-action" : "/animated-films"}
            className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors"
          >
            ← All {movie.type === "live-action" ? "Live-Action" : "Animated"} Films
          </Link>
        </div>
      </div>
    </>
  );
}
