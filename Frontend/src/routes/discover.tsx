import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { PageHeader } from "@/components/SiteChrome";
import { type Character, type Earth, type Movie, type Actor, type TimelineEvent } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — The Amazing Web" },
      { name: "description", content: "Discover random characters, Earths, movies, actors and events across the Spider-Verse." },
    ],
  }),
  component: DiscoverPage,
});

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function DiscoverPage() {
  const navigate = useNavigate();
  const charStore = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const movieStore = useCollection<Movie>("movies");
  const actorStore = useCollection<Actor>("actors");
  const eventStore = useCollection<TimelineEvent>("timeline-events");

  const [featuredChars, setFeaturedChars] = useState<Character[]>([]);
  const [featuredEarths, setFeaturedEarths] = useState<Earth[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize featured content once data is loaded
  if (charStore.hydrated && !initialized) {
    setFeaturedChars(pickRandom(charStore.items, 6));
    setFeaturedEarths(pickRandom(earthStore.items, 4));
    setFeaturedMovies(pickRandom(movieStore.items, 4));
    setInitialized(true);
  }

  const surpriseMe = useCallback(() => {
    if (charStore.items.length === 0) return;
    const random = charStore.items[Math.floor(Math.random() * charStore.items.length)];
    navigate({ to: "/directory/$characterId", params: { characterId: random.id } });
  }, [charStore.items, navigate]);

  const refreshChars = () => setFeaturedChars(pickRandom(charStore.items, 6));
  const refreshEarths = () => setFeaturedEarths(pickRandom(earthStore.items, 4));
  const refreshMovies = () => setFeaturedMovies(pickRandom(movieStore.items, 4));

  if (!charStore.hydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground animate-pulse">Loading the multiverse…</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="EXPLORE THE UNKNOWN"
        intro="Discover random characters, Earths, movies, and events. Every refresh reveals something new."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Surprise Me */}
        <section className="mb-16 text-center">
          <button
            onClick={surpriseMe}
            className="group relative inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 font-mono text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition-all hover:scale-105 hover:shadow-glow-lg"
          >
            <span className="text-xl" aria-hidden>🎲</span>
            Surprise Me
          </button>
          <p className="mt-3 text-sm text-muted-foreground">Jump to a random character</p>
        </section>

        {/* Random Characters */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl leading-none">RANDOM CHARACTERS</h2>
            <button
              onClick={refreshChars}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              ↻ Shuffle
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredChars.map((c) => (
              <Link
                key={c.id}
                to="/directory/$characterId"
                params={{ characterId: c.id }}
                className="ink-panel hover-lift rounded-lg overflow-hidden"
              >
                {c.imageUrl && (
                  <div className="h-32 w-full overflow-hidden">
                    <img src={c.imageUrl} alt={c.alias || c.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-lg font-medium text-foreground">{c.alias || c.name}</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{c.name} · {c.earth}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Random Earths */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl leading-none">RANDOM UNIVERSES</h2>
            <button
              onClick={refreshEarths}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              ↻ Shuffle
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredEarths.map((e) => (
              <Link
                key={e.id}
                to="/earths/$earthId"
                params={{ earthId: e.id }}
                className="ink-panel hover-lift rounded-lg p-5 flex items-start gap-4"
              >
                <span
                  className="mt-1 size-4 shrink-0 rounded-full"
                  style={{ backgroundColor: e.hex, boxShadow: `0 0 16px ${e.hex}` }}
                  aria-hidden
                />
                <div>
                  <p className="text-lg font-medium text-foreground">{e.designation}</p>
                  {e.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Random Movies */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl leading-none">RANDOM MOVIES</h2>
            <button
              onClick={refreshMovies}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              ↻ Shuffle
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featuredMovies.map((m) => (
              <Link
                key={m.id}
                to="/movies/$movieId"
                params={{ movieId: m.id }}
                className="ink-panel hover-lift rounded-lg p-5"
              >
                <p className="text-lg font-medium text-foreground">{m.title}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-mono text-sm text-accent">{m.year}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                    {m.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-5 mb-14">
          {[
            { label: "Characters", count: charStore.items.length, to: "/directory" as const },
            { label: "Earths", count: earthStore.items.length, to: "/what-is-the-spider-verse" as const },
            { label: "Movies", count: movieStore.items.length, to: "/animated-films" as const },
            { label: "Actors", count: actorStore.items.length, to: "/live-action" as const },
            { label: "Events", count: eventStore.items.length, to: "/timeline" as const },
          ].map((stat) => (
            <Link key={stat.label} to={stat.to} className="ink-panel hover-lift rounded-lg p-4 text-center">
              <p className="font-display text-3xl text-primary text-glow">{stat.count}</p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
