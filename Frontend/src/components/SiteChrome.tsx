import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/directory", label: "Directory" },
  { to: "/timeline", label: "Timeline" },
  { to: "/discover", label: "Discover" },
  { to: "/what-is-the-spider-verse", label: "Universes" },
  { to: "/animated-films", label: "Animated" },
  { to: "/live-action", label: "Live-Action" },
  { to: "/collection", label: "My Comics" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <span
            aria-hidden
            className="size-3 rounded-full bg-primary shadow-glow transition-transform group-hover:scale-125"
          />
          <span className="font-display text-xl leading-none tracking-widest">
            THE AMAZING WEB
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground border-primary/70 bg-primary/10" }}
              inactiveProps={{ className: "text-muted-foreground border-transparent" }}
              className="rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.15em] transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="rounded-md border border-border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-muted-foreground lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="grid gap-1 border-t border-border/70 px-4 py-3 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6">
        <p className="font-display text-xl tracking-widest">THE AMAZING WEB</p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          An independent, non-commercial fan reference about the Spider-Verse multiverse concept.
          All summaries are written from scratch; characters are represented as abstract glowing
          nodes rather than likenesses. Not affiliated with or endorsed by any publisher or studio.
        </p>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          Powered by Supabase · built with love for the multiverse
        </p>
      </div>
    </footer>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="void-wash border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-5xl leading-[0.95] text-glow sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      </div>
    </div>
  );
}
