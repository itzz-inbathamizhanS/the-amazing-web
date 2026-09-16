import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Users, Globe, Film, User, Calendar, Link as LinkIcon, Search, Compass, Map } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "User Guide — The Amazing Web" },
      {
        name: "description",
        content:
          "Learn how to explore The Amazing Web — an interactive Spider-Verse knowledge platform. Discover characters, Earths, movies, actors, events, and an interactive 3D multiverse graph.",
      },
      { property: "og:title", content: "User Guide — The Amazing Web" },
    ],
  }),
  component: HelpPage,
});

/* ─── Table of Contents ─── */
const TOC = [
  { id: "quick-start", label: "Quick Start" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "explore", label: "How to Explore" },
  { id: "visualization", label: "3D Visualization" },
  { id: "search", label: "Search" },
  { id: "navigation", label: "Navigation" },
  { id: "shortcuts", label: "Keyboard Shortcuts" },
  { id: "mobile", label: "Mobile" },
  { id: "admin", label: "Admin" },
  { id: "faq", label: "FAQ" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

/* ─── Smooth scroll helper ─── */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─── Section wrapper ─── */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-4xl leading-none sm:text-5xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function HelpPage() {
  const [tocOpen, setTocOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const filteredToc = TOC.filter((t) =>
    t.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <>
      {/* ───── HERO ───── */}
      <div className="void-wash border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
            User Guide
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[0.95] text-glow sm:text-6xl">
            THE AMAZING WEB
          </h1>
          <h2 className="mt-2 text-3xl text-foreground/80 sm:text-4xl">USER GUIDE</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Everything you need to know to explore the Spider-Verse knowledge platform.
            Characters, Earths, movies, actors, events — all interconnected through a
            3D multiverse visualization.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full bg-primary px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start Exploring →
            </Link>
            <Link
              to="/discover"
              className="rounded-full border border-border bg-background/50 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-foreground/85 transition-colors hover:border-accent"
            >
              Discover Something
            </Link>
          </div>
        </div>
      </div>

      {/* ───── MAIN CONTENT ───── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:gap-12">
        {/* Sticky TOC (desktop) */}
        <aside className="hidden lg:block lg:w-56 lg:shrink-0">
          <div className="sticky top-24">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              On this page
            </p>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter sections..."
              className="mb-3 w-full rounded-md border border-border bg-background/60 px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus:border-accent"
            />
            <nav className="space-y-1">
              {filteredToc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToId(item.id)}
                  className="block w-full text-left rounded-md px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/10"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC toggle */}
        <div className="mb-8 lg:hidden">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="w-full rounded-lg border border-border px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {tocOpen ? "▾ Hide sections" : "▸ On this page"}
          </button>
          {tocOpen && (
            <nav className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-border p-3">
              {TOC.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToId(item.id);
                    setTocOpen(false);
                  }}
                  className="rounded-md px-3 py-2 text-left font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:bg-accent/10"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-20">
          {/* ── QUICK START ── */}
          <Section id="quick-start" eyebrow="Getting Started" title="QUICK START">
            <div className="grid gap-4 sm:grid-cols-5">
              {[
                {
                  step: "01",
                  title: "Choose",
                  desc: "Pick what you want to explore — characters, Earths, movies, actors, or events.",
                },
                {
                  step: "02",
                  title: "Search or Browse",
                  desc: "Use the directory, the search page, or press Ctrl+K to find anything instantly.",
                },
                {
                  step: "03",
                  title: "Open",
                  desc: "Click any entity to open its detailed profile with images, descriptions, and metadata.",
                },
                {
                  step: "04",
                  title: "Follow",
                  desc: "Every profile links to related characters, Earths, movies, and events. Follow the connections.",
                },
                {
                  step: "05",
                  title: "Explore",
                  desc: "Open the 3D Web of Life to see the entire multiverse as an interactive graph.",
                },
              ].map((s) => (
                <div key={s.step} className="ink-panel rounded-lg p-5">
                  <p className="font-display text-3xl text-primary text-glow">{s.step}</p>
                  <p className="mt-2 text-sm font-medium text-foreground">{s.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── ABOUT ── */}
          <Section id="about" eyebrow="What Is This?" title="THE AMAZING WEB">
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              The Amazing Web is an interactive Spider-Verse knowledge and exploration platform.
              It maps the multiverse of Spider-characters, alternate Earths, films, actors, and
              comics events into one interconnected experience. Everything is linked — a character
              connects to their Earth, their movies, their related variants, and the timeline events
              they participated in.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { icon: Users, label: "Characters", desc: "Spider-variants across the multiverse" },
                { icon: Globe, label: "Earths", desc: "Alternate universes with unique identities" },
                { icon: Film, label: "Movies", desc: "Animated and live-action films" },
                { icon: User, label: "Actors", desc: "Performers who brought characters to life" },
                { icon: Calendar, label: "Events", desc: "Key story moments and crossovers" },
                { icon: LinkIcon, label: "Connections", desc: "Relationships linking everything together" },
              ].map((cat) => (
                <div key={cat.label} className="ink-panel rounded-lg p-4 text-center flex flex-col items-center">
                  <cat.icon className="h-6 w-6 text-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">{cat.label}</p>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">{cat.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── FEATURES ── */}
          <Section id="features" eyebrow="What Can I Do?" title="FEATURE GUIDE">
            <div className="space-y-8">
              {/* Character Explorer */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><Users className="text-accent h-6 w-6" /> CHARACTER EXPLORER</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Browse every Spider-variant in the database with filtering and search.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Name, alias, real name, Earth designation, image, description, powers/abilities,
                      first appearance, media tags (Comics/Animated/Live-Action), related characters, on-screen appearances.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Go to <strong>/directory</strong> to see the full grid. Filter by Earth, medium, or tag.
                      Use the search bar. Click any card to open the character's full profile.
                      From there, follow links to their Earth, movies, or related characters.
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <Link to="/directory" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    Open Directory →
                  </Link>
                </div>
              </div>

              {/* Earth Explorer */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><Globe className="text-accent h-6 w-6" /> EARTH EXPLORER</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Each Earth (universe) has its own detail page showing its unique accent colour,
                  description, characters from that Earth, and associated timeline events.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Earth designation, description, hex accent colour, all characters from that Earth (with images), and timeline events.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Go to <strong>/what-is-the-spider-verse</strong> for the overview, or navigate to
                      an individual Earth via <strong>/earths/earth-616</strong>. You can also reach Earth
                      pages from any character profile by clicking their universe.
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <Link to="/what-is-the-spider-verse" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    View Universes →
                  </Link>
                </div>
              </div>

              {/* Movie Explorer */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><Film className="text-accent h-6 w-6" /> MOVIE EXPLORER</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Explore both animated and live-action Spider-Verse films with cast, characters, and release details.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Title, release year, type (animated/live-action), continuity, watch order,
                      cast (linked to actor profiles), and characters (linked to character profiles).
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Browse films via <strong>/animated-films</strong> or <strong>/live-action</strong>.
                      Click any film to open its detail page at <strong>/movies/[id]</strong>.
                      From there, click actors or characters to explore further.
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-4">
                  <Link to="/animated-films" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    Animated Films →
                  </Link>
                  <Link to="/live-action" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    Live-Action Films →
                  </Link>
                </div>
              </div>

              {/* Actor Explorer */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><User className="text-accent h-6 w-6" /> ACTOR PROFILES</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  See which actors portrayed Spider-Verse characters and browse their filmography.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Actor name, role, and all Spider-Verse movies they appeared in (linked to movie detail pages).
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Actor profiles are reached from movie pages or search results. Navigate to
                      <strong> /actors/[id]</strong> (e.g., /actors/tobey-maguire) to see their page.
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Timeline */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><Calendar className="text-accent h-6 w-6" /> TIMELINE</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A chronological view of Spider-Verse comics events, crossovers, and story branch points.
                  Available in both a 3D visualization mode and a plain list mode.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Event title, year, date range, summary, associated issues, Earth/branch, and crossover markers.
                      Grouped by branch (universe) with Earth accent colours.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Go to <strong>/timeline</strong>. Toggle between the 3D view and the list view using
                      the buttons at the top. Click branch labels to filter by universe.
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <Link to="/timeline" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    Open Timeline →
                  </Link>
                </div>
              </div>

              {/* Discover */}
              <div className="ink-panel rounded-lg p-6">
                <h3 className="text-2xl leading-none flex items-center gap-2"><Compass className="text-accent h-6 w-6" /> DISCOVER MODE</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A randomised exploration experience. Every visit shows different characters, Earths,
                  and movies. Hit "Shuffle" to regenerate, or "Surprise Me" to jump to a random character.
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">What It Shows</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Random characters with images, random Earths with descriptions, random movies,
                      and quick-access stats across all entity types.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-accent">How To Use</dt>
                    <dd className="mt-1 text-muted-foreground">
                      Go to <strong>/discover</strong>. Click Shuffle to get new random entities.
                      Click Surprise Me to jump directly to a random character's profile.
                    </dd>
                  </div>
                </dl>
                <div className="mt-4">
                  <Link to="/discover" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    Open Discover →
                  </Link>
                </div>
              </div>
            </div>
          </Section>

          {/* ── HOW TO EXPLORE ── */}
          <Section id="explore" eyebrow="Follow The Threads" title="HOW TO EXPLORE">
            <p className="max-w-3xl text-sm text-muted-foreground mb-8">
              Everything in The Amazing Web is connected. Here's a typical exploration journey — each
              step leads naturally to the next.
            </p>
            <div className="flex flex-col items-center gap-2">
              {[
                { label: "Character", route: "/directory", desc: "Start with a character profile" },
                { label: "Earth", route: "/earths/earth-616", desc: "Click their universe to see who else lives there" },
                { label: "Movie", route: "/animated-films", desc: "See which films they appear in" },
                { label: "Actor", route: "/live-action", desc: "Follow to the actor who portrayed them" },
                { label: "Timeline", route: "/timeline", desc: "See where they appear in the chronology" },
                { label: "Web of Life", route: "/web-of-life", desc: "See their connections in 3D" },
              ].map((step, i) => (
                <div key={step.label} className="w-full max-w-md">
                  <Link
                    to={step.route as any}
                    className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4 w-full"
                  >
                    <span className="flex size-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-lg text-accent">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                  </Link>
                  {i < 5 && (
                    <div className="flex justify-center py-1">
                      <span className="text-accent/60 text-lg">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* ── 3D VISUALIZATION ── */}
          <Section id="visualization" eyebrow="Web of Life" title="3D MULTIVERSE VISUALIZATION">
            <p className="max-w-3xl text-sm text-muted-foreground mb-6">
              The Web of Life and Destiny is a full interactive 3D force-directed graph. Each node
              is a character, coloured by their Earth's accent colour. Lines between nodes represent
              character-to-character relationships from the database.
            </p>

            <div className="ink-panel rounded-lg p-6">
              <h3 className="text-xl leading-none mb-4">CONTROLS</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { action: "Rotate / Orbit", how: "Click and drag anywhere in the 3D space" },
                  { action: "Zoom", how: "Scroll wheel (mouse) or pinch (touch)" },
                  { action: "Focus on Character", how: "Left-click a character node — camera smoothly zooms to them" },
                  { action: "Open Character Profile", how: "Right-click a character node to navigate to their full profile" },
                  { action: "Hover", how: "Hover over a node to see the character name" },
                  { action: "Pan", how: "Right-click and drag to pan the camera" },
                ].map((ctrl) => (
                  <div key={ctrl.action} className="flex gap-3">
                    <span className="shrink-0 size-2 mt-1.5 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{ctrl.action}</p>
                      <p className="text-xs text-muted-foreground">{ctrl.how}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 ink-panel rounded-lg p-6">
              <h3 className="text-xl leading-none mb-4">WHAT THE COLOURS MEAN</h3>
              <p className="text-sm text-muted-foreground">
                Each Earth has a unique hex accent colour. Character nodes are coloured to match their
                home Earth, so clusters of the same colour represent characters from the same universe.
                For example, Earth-616 characters appear in red, Earth-1610 in purple, and Earth-65 in cyan.
              </p>
            </div>

            <div className="mt-6 ink-panel rounded-lg p-6">
              <h3 className="text-xl leading-none mb-4">WHAT THE LINES MEAN</h3>
              <p className="text-sm text-muted-foreground">
                Lines (edges) represent actual relationships between characters stored in the database.
                Red animated particles flow along these lines. The relationships come from each character's
                "related" field — they indicate variant connections, team affiliations, or narrative links
                between characters across the multiverse.
              </p>
            </div>

            <div className="mt-4">
              <Link to="/web-of-life" className="font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                Open Web of Life →
              </Link>
            </div>
          </Section>

          {/* ── SEARCH ── */}
          <Section id="search" eyebrow="Find Anything" title="SEARCH">
            <div className="ink-panel rounded-lg p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-foreground">What Can I Search?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Characters (by name, alias, or real name), Earths (by designation or description),
                    Movies (by title), Actors (by name or role), and Events (by title or summary).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">How Do I Search?</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Press <kbd className="rounded border border-border px-1.5 py-0.5 text-xs font-mono">Ctrl + K</kbd> from anywhere to open the Command Palette</li>
                    <li>• Navigate to <strong>/search</strong> for the dedicated search page</li>
                    <li>• Click the search link in the homepage hero section</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">How Are Results Displayed?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Results are grouped by type (Characters, Universes, Movies, Actors, Events) with
                    a count badge. The dedicated search page uses debounced server-side search so results
                    update as you type. The URL updates with your query so you can share search links.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">How Do I Open a Result?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click any result to navigate to its detail page. Characters open their full profile,
                    Earths open the Earth detail page, Movies open the movie page, and Actors open the
                    actor page.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── NAVIGATION ── */}
          <Section id="navigation" eyebrow="Getting Around" title="NAVIGATION">
            <p className="max-w-3xl text-sm text-muted-foreground mb-6">
              The top navigation bar is available on every page. On mobile, tap "Menu" to expand it.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Home", route: "/", desc: "3D hero, featured characters, discovery cards" },
                { label: "Directory", route: "/directory", desc: "All characters with filtering" },
                { label: "Timeline", route: "/timeline", desc: "Chronological events, 3D + list views" },
                { label: "Web of Life", route: "/web-of-life", desc: "Interactive 3D relationship graph" },
                { label: "Discover", route: "/discover", desc: "Random exploration mode" },
                { label: "Universes", route: "/what-is-the-spider-verse", desc: "Earth overview + explanations" },
                { label: "Animated", route: "/animated-films", desc: "The animated Spider-Verse trilogy" },
                { label: "Live-Action", route: "/live-action", desc: "Live-action films by era" },
              ].map((nav) => (
                <Link
                  key={nav.route}
                  to={nav.route as any}
                  className="ink-panel hover-lift rounded-lg p-4"
                >
                  <p className="text-sm font-medium text-foreground">{nav.label}</p>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">{nav.desc}</p>
                </Link>
              ))}
            </div>
          </Section>

          {/* ── KEYBOARD SHORTCUTS ── */}
          <Section id="shortcuts" eyebrow="Power User" title="KEYBOARD SHORTCUTS">
            <div className="ink-panel rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-widest text-accent">Shortcut</th>
                    <th className="px-4 py-3 text-left font-mono text-[0.6rem] uppercase tracking-widest text-accent">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="px-4 py-3">
                      <kbd className="rounded border border-border px-2 py-0.5 font-mono text-xs">Ctrl + K</kbd>
                      <span className="text-muted-foreground text-xs ml-2">(or ⌘K on Mac)</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">Open / close the Command Palette for quick search</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3"><kbd className="rounded border border-border px-2 py-0.5 font-mono text-xs">Esc</kbd></td>
                    <td className="px-4 py-3 text-muted-foreground">Close the Command Palette or any open dialog</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              The 3D Web of Life supports mouse controls: left-click to focus, right-click to navigate, scroll to zoom, drag to orbit.
            </p>
          </Section>

          {/* ── MOBILE ── */}
          <Section id="mobile" eyebrow="On The Go" title="USING ON MOBILE">
            <div className="ink-panel rounded-lg p-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Navigation</p>
                  <p className="mt-1">Tap the "Menu" button in the top-right corner to expand the navigation. Tap any link to navigate, and the menu closes automatically.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">3D Visualizations</p>
                  <p className="mt-1">The Web of Life and homepage 3D graph work on mobile with touch gestures — pinch to zoom, drag to rotate, tap a node to focus. For the best experience, use landscape orientation.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Search</p>
                  <p className="mt-1">The Command Palette (Ctrl+K) works on mobile as a full-screen overlay. You can also use the dedicated /search page for a more comfortable mobile search experience.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Character Directory</p>
                  <p className="mt-1">Filter controls stack vertically on smaller screens. The character grid adapts from 3 columns on desktop to 1 column on mobile.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* ── ADMIN ── */}
          <Section id="admin" eyebrow="For Administrators Only" title="ADMIN FEATURES">
            <div className="ink-panel rounded-lg border-l-4 border-l-accent p-6">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-accent mb-3">Restricted Access</p>
              <p className="text-sm text-muted-foreground mb-4">
                The Amazing Web includes an administrator mode that allows authorized users to create,
                edit, and manage content directly in the browser. Admin features are only visible after
                authentication.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">How to Access</p>
                  <p className="mt-1">Navigate to <strong>/admin</strong> and enter the owner password to unlock admin mode. This is session-based.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">What Admins Can Do</p>
                  <ul className="mt-1 space-y-1">
                    <li>• Create, edit, and delete characters, Earths, movies, actors, and events</li>
                    <li>• Upload images to Supabase storage</li>
                    <li>• Manage content through inline edit buttons that appear on entity pages</li>
                    <li>• Add new timeline events from the timeline page</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">How to Lock</p>
                  <p className="mt-1">Return to /admin and click "Lock" to end your admin session.</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/70">
                Admin credentials and API keys are never exposed to regular visitors.
              </p>
            </div>
          </Section>

          {/* ── FAQ ── */}
          <Section id="faq" eyebrow="Common Questions" title="FAQ">
            <div className="space-y-4">
              {[
                {
                  q: "What is The Amazing Web?",
                  a: "An interactive fan-made Spider-Verse knowledge platform that maps characters, alternate Earths, films, actors, and comics events into one interconnected experience.",
                },
                {
                  q: "What information can I explore?",
                  a: "Characters (with images, powers, descriptions), Earths (with accent colours), Movies (animated + live-action), Actors, and Timeline Events. All are interconnected.",
                },
                {
                  q: "How do I find a specific character?",
                  a: "Go to /directory and use the search bar, or press Ctrl+K from anywhere to search. You can also filter by Earth, medium (Comics/Animated/Live-Action), or tag.",
                },
                {
                  q: "How do I find a specific Earth?",
                  a: "Go to /what-is-the-spider-verse for an overview. Search for an Earth by designation using Ctrl+K or /search. Click any Earth in the results to see its detail page.",
                },
                {
                  q: "How does the 3D visualization work?",
                  a: "The Web of Life at /web-of-life is a force-directed 3D graph using Three.js. Each node is a character, coloured by their Earth. Drag to rotate, scroll to zoom, left-click to focus, right-click to navigate to a character's profile.",
                },
                {
                  q: "Can I search across all types at once?",
                  a: "Yes. The Command Palette (Ctrl+K) and the /search page both search across characters, Earths, movies, actors, and events simultaneously.",
                },
                {
                  q: "How are entities connected?",
                  a: "Characters link to their Earth, their movie appearances, and related characters. Movies link to their cast and characters. Actors link to their filmography. Events link to their branch/Earth.",
                },
                {
                  q: "Is the website mobile-friendly?",
                  a: "Yes. All pages are responsive. The navigation adapts to a hamburger menu on small screens. The 3D visualizations support touch gestures (pinch-zoom, drag-rotate, tap-focus).",
                },
                {
                  q: "Who built this?",
                  a: "The Amazing Web is created and maintained by Inbathamizhan S.",
                },
              ].map((faq) => (
                <details key={faq.q} className="ink-panel rounded-lg group">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-foreground list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-accent ml-2 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                </details>
              ))}
            </div>
          </Section>

          {/* ── TROUBLESHOOTING ── */}
          <Section id="troubleshooting" eyebrow="Something Wrong?" title="TROUBLESHOOTING">
            <div className="space-y-3">
              {[
                {
                  problem: "The page is loading for a long time",
                  solution: "The application loads data from a remote database. On first visit, this may take a few seconds. The 3D visualization requires WebGL — ensure your browser supports it.",
                },
                {
                  problem: "The 3D graph is not visible",
                  solution: "The Web of Life requires WebGL and a modern browser. Try Chrome, Firefox, Edge, or Safari. Disable browser extensions that might block WebGL. On mobile, ensure you have sufficient memory available.",
                },
                {
                  problem: "Search returned no results",
                  solution: "Try a shorter or different search term. The search matches against names, titles, descriptions, and designations. Check spelling.",
                },
                {
                  problem: "An image is not loading",
                  solution: "Images are hosted on Supabase. If an image doesn't load, it may have been removed or the URL may have changed. The character will show an initial letter fallback instead.",
                },
                {
                  problem: "A page shows '404 — This universe isn't mapped'",
                  solution: "The entity you're looking for may not exist in the database. Return to the directory or use search to find what you're looking for.",
                },
                {
                  problem: "Edit buttons are not showing",
                  solution: "Edit functionality is restricted to administrators. Go to /admin to unlock admin mode with the owner password.",
                },
              ].map((ts) => (
                <div key={ts.problem} className="ink-panel rounded-lg p-5">
                  <p className="text-sm font-medium text-foreground">{ts.problem}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ts.solution}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* ── NEW HERE? ── */}
          <section className="scroll-mt-24 ink-panel rounded-xl p-8 text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">
              New to The Amazing Web?
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl">START YOUR JOURNEY</h2>
            <p className="mt-4 max-w-lg mx-auto text-sm text-muted-foreground">
              Begin with characters, explore their Earth, discover their movies,
              follow the connections, and open the multiverse.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6 max-w-4xl mx-auto">
              {[
                { to: "/directory" as const, icon: Users, label: "Explore Characters" },
                { to: "/what-is-the-spider-verse" as const, icon: Globe, label: "Explore Earths" },
                { to: "/animated-films" as const, icon: Film, label: "Explore Movies" },
                { to: "/live-action" as const, icon: User, label: "Explore Actors" },
                { to: "/timeline" as const, icon: Calendar, label: "Explore Events" },
                { to: "/web-of-life" as const, icon: LinkIcon, label: "Open Multiverse" },
              ].map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="ink-panel hover-lift rounded-lg p-4 text-center flex flex-col items-center"
                >
                  <card.icon className="h-6 w-6 text-foreground" />
                  <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-widest text-foreground">
                    {card.label}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
