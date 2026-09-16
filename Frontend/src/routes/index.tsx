import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BranchLegend, MultiverseStage } from "@/components/MultiverseStage";
import { type Character, type Earth, type TimelineEvent, type Movie } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";
import { useState, useCallback } from "react";
import { Users, Globe, Film, User, Calendar, Sparkles, Search, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Amazing Web — A Cinematic Spider-Verse Multiverse Map" },
      {
        name: "description",
        content:
          "Travel a glowing 3D timeline where the main Marvel continuity splits into alternate Earths. Explore Spider-variants, comics crossovers, animated films and live-action continuities.",
      },
      { property: "og:title", content: "The Amazing Web — A Cinematic Spider-Verse Map" },
      {
        property: "og:description",
        content:
          "A 3D branching timeline of the Spider-Verse: every Earth as its own glowing branch, with crossover points where they touch.",
      },
    ],
  }),
  component: Home,
});

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function Home() {
  const navigate = useNavigate();
  const charStore = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const eventStore = useCollection<TimelineEvent>("timeline-events");
  const movieStore = useCollection<Movie>("movies");

  const [featured, setFeatured] = useState<Character[]>([]);
  const [initialized, setInitialized] = useState(false);

  if (charStore.hydrated && !initialized) {
    setFeatured(pickRandom(charStore.items.filter((c) => c.imageUrl), 6));
    setInitialized(true);
  }

  const surpriseMe = useCallback(() => {
    if (charStore.items.length === 0) return;
    const random = charStore.items[Math.floor(Math.random() * charStore.items.length)];
    if (!random) return;
    navigate({ to: "/directory/$characterId", params: { characterId: random.id } });
  }, [charStore.items, navigate]);

  return (
    <>
      {/* ───── HERO ───── */}
      <section className="relative h-[300vh]">
        <div className="sticky top-0 h-[100dvh]">
          <MultiverseStage mode="hero" className="h-full w-full" />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-16 sm:px-6 sm:pt-24">
            <div className="mx-auto max-w-6xl">
              <p className="animate-glitch-in font-mono text-[0.68rem] uppercase tracking-[0.4em] text-accent">
                One timeline · many Earths
              </p>
              <h1 className="mt-4 max-w-3xl text-6xl leading-[0.88] text-glow sm:text-8xl">
                THE AMAZING WEB
              </h1>
              <h2 className="mt-3 text-3xl leading-[1.1] sm:text-5xl text-foreground font-medium text-glow-sm">
                Every Spider. Every Universe. Every Story.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80">
                The bright line running through the dark is the main continuity. Every colour
                curving away from it is another Earth. Scroll to travel down the trunk, click a
                branch to follow it, and hover a node to read the story that happened there.
              </p>
              <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
                <Link
                  to="/directory"
                  className="rounded-full bg-primary px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
                >
                  Open the directory
                </Link>
                <Link
                  to="/timeline"
                  className="rounded-full border border-border bg-background/50 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/85 transition-colors hover:border-accent"
                >
                  Full timeline
                </Link>
                <Link
                  to="/search"
                  search={{ q: "" }}
                  className="rounded-full border border-border bg-background/50 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/85 transition-colors hover:border-accent"
                >
                  Search Ctrl+K
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="relative border-y border-border/60">
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:grid-cols-4 sm:px-6">
          {[
            { n: charStore.items.length, label: "Spider-people mapped" },
            { n: earthStore.items.length, label: "Universes tracked" },
            { n: eventStore.items.length, label: "Story branch points" },
            { n: movieStore.items.length, label: "Films catalogued" },
          ].map((stat) => (
            <div key={stat.label} className="ink-panel rounded-lg p-6">
              <p className="font-display text-6xl leading-none text-primary text-glow">{stat.n}</p>
              <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── EXPLORE THE WEB ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
          Explore the Web
        </p>
        <h2 className="mt-3 text-5xl leading-none">JUMP IN ANYWHERE</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Every corner of the Spider-Verse is connected. Pick a starting point.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { to: "/directory" as const, label: "Characters", count: charStore.items.length, icon: Users },
            { to: "/what-is-the-spider-verse" as const, label: "Earths", count: earthStore.items.length, icon: Globe },
            { to: "/animated-films" as const, label: "Movies", count: movieStore.items.length, icon: Film },
            { to: "/live-action" as const, label: "Actors", count: 0, icon: User },
            { to: "/timeline" as const, label: "Timeline", count: eventStore.items.length, icon: Calendar },
          ].map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="ink-panel hover-lift flex flex-col items-center rounded-lg p-6 text-center"
            >
              <cat.icon className="h-8 w-8 text-accent" />
              <p className="mt-3 text-lg font-medium text-foreground">{cat.label}</p>
              {cat.count > 0 && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">{cat.count} entries</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ───── FEATURED CHARACTERS ───── */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
                Featured
              </p>
              <h2 className="mt-3 text-5xl leading-none">DISCOVER SOMEONE NEW</h2>
            </div>
            <button
              onClick={surpriseMe}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              <Sparkles className="h-3.5 w-3.5" /> Surprise Me
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c.id}
                to="/directory/$characterId"
                params={{ characterId: c.id }}
                className="ink-panel hover-lift group rounded-lg overflow-hidden"
              >
                {c.imageUrl && (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={c.imageUrl}
                      alt={c.alias || c.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-lg font-medium text-foreground">{c.alias || c.name}</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {c.name} · {c.earth}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile surprise me */}
          <div className="mt-6 text-center sm:hidden">
            <button
              onClick={surpriseMe}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-sm uppercase tracking-[0.2em] text-primary-foreground shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Surprise Me
            </button>
          </div>
        </section>
      )}

      {/* ───── BRANCH LEGEND ───── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
          Read the colours
        </p>
        <h2 className="mt-3 text-5xl leading-none">EVERY BRANCH IS AN EARTH</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Each universe on the map gets its own accent colour, reused everywhere on the site so a
          character card, a timeline node and a branch line all agree on where you are.
        </p>
        <div className="mt-10">
          <BranchLegend />
        </div>
      </section>

      {/* ───── CONTENT CARDS ───── */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              to: "/what-is-the-spider-verse" as const,
              title: "WHAT IS THE SPIDER-VERSE",
              body: "The multiverse idea in plain terms, plus how the Earth-### numbering works.",
            },
            {
              to: "/animated-films" as const,
              title: "THE ANIMATED TRILOGY",
              body: "Three films, one continuity, and how their cast maps onto the directory.",
            },
            {
              to: "/live-action" as const,
              title: "THREE SCREEN CONTINUITIES",
              body: "The live-action history by actor, and the point where all three touched.",
            },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="ink-panel hover-lift block rounded-lg p-6"
            >
              <h3 className="text-2xl leading-none">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                Enter →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── DISCOVER + SEARCH CTA ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/discover"
            className="ink-panel hover-lift rounded-lg p-8 text-center"
          >
            <Compass className="mx-auto h-10 w-10 text-accent" />
            <h3 className="mt-4 text-2xl">DISCOVER MODE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore random characters, Earths, and movies. Every visit is different.
            </p>
          </Link>
          <Link
            to="/search"
            search={{ q: "" }}
            className="ink-panel hover-lift rounded-lg p-8 text-center"
          >
            <Search className="mx-auto h-10 w-10 text-accent" />
            <h3 className="mt-4 text-2xl">SEARCH THE MULTIVERSE</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Find any character, Earth, movie, actor, or event across every universe.
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
