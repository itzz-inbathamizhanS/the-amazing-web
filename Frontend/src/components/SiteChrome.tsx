import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/directory", label: "Directory" },
  { to: "/timeline", label: "Timeline" },
  { to: "/web-of-life", label: "Web of Life" },
  { to: "/discover", label: "Discover" },
  { to: "/what-is-the-spider-verse", label: "Universes" },
  { to: "/animated-films", label: "Animated" },
  { to: "/live-action", label: "Live-Action" },
  { to: "/help", label: "Help" },
] as const;

function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element once
    const audio = new Audio("/theme.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Browser autoplay policies require user interaction,
      // which is satisfied since this is triggered by an onClick.
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
      aria-label={isPlaying ? "Mute music" : "Play music"}
      title={isPlaying ? "Mute music" : "Play music"}
    >
      {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-void/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto transition-transform group-hover:scale-110" />
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

        <div className="flex items-center gap-2">
          <AudioToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="rounded-md border border-border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.15em] text-muted-foreground lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
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
      <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-display text-xl tracking-widest">THE AMAZING WEB</p>
          <div className="flex flex-wrap gap-4 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
            <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
              Help / User Guide
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The Amazing Web is an interactive Spider-Verse knowledge platform.<br />
          <span className="mt-2 block font-mono text-[0.7rem] uppercase tracking-widest text-primary/90">
            Always and only, Andrew Garfield — My Peter Parker in every universe.
          </span>
          <br />
          &copy; {new Date().getFullYear()} Inbathamizhan S. All rights reserved.
        </p>
        <div className="flex gap-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="https://github.com/itzz-inbathamizhanS" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/inbathamizhans" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
        </div>
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
