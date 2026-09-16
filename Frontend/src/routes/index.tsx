import { createFileRoute, Link } from "@tanstack/react-router";
import { BranchLegend, MultiverseStage } from "@/components/MultiverseStage";
import { type Character, type Earth, type TimelineEvent } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";

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

function Home() {
  const charStore = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const eventStore = useCollection<TimelineEvent>("timeline-events");

  return (
    <>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-border/60">
        <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:grid-cols-3 sm:px-6">
          {[
            { n: charStore.items.length, label: "Spider-people mapped" },
            { n: earthStore.items.length, label: "Universes tracked" },
            { n: eventStore.items.length, label: "Story branch points" },
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
    </>
  );
}
