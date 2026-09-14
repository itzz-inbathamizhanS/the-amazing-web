import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef, useState, useMemo } from "react";
import fallbackImage from "@/assets/multiverse-fallback.jpg";
import { branches } from "@/lib/timeline-graph";
import type { BranchNode } from "@/lib/timeline-graph";
import { type TimelineEvent, type Earth, type Character } from "@/data/spiderverse";
import { Link } from "@tanstack/react-router";
import { useCollection } from "@/lib/content-store";
import { computeNodes } from "@/lib/timeline-graph";

const MultiverseCanvas = lazy(() => import("@/components/three/MultiverseCanvas"));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useLowPower() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const cores = navigator.hardwareConcurrency ?? 4;
      const isMobile = window.innerWidth < 768;
      setLow(!gl || cores <= 2 || isMobile);
    } catch {
      setLow(true);
    }
  }, []);
  return low;
}

function StaticFallback({ className = "" }: { className?: string }) {
  return (
    <img
      src={fallbackImage}
      alt="Illustration of a glowing main timeline splitting into coloured branch lines across deep space"
      width={1600}
      height={912}
      className={`h-full w-full object-cover opacity-80 ${className}`}
    />
  );
}

export type MultiverseStageProps = {
  /** hero: scroll-driven fly-through. page: static overview with branch picker. */
  mode?: "hero" | "page";
  className?: string;
};

export function MultiverseStage({ mode = "hero", className = "" }: MultiverseStageProps) {
  const reducedMotion = useReducedMotion();
  const lowPower = useLowPower();
  const [progress, setProgress] = useState(0);
  const [focusedBranch, setFocusedBranch] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<BranchNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { items: timelineEvents } = useCollection<TimelineEvent>("timeline-events");
  const charStore = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const nodes = useMemo(() => computeNodes(timelineEvents, earthStore.items), [timelineEvents, earthStore.items]);

  // Scroll-driven camera travel via GSAP ScrollTrigger (hero mode only).
  useEffect(() => {
    if (mode !== "hero" || reducedMotion || lowPower) return;
    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=180%",
        scrub: true,
        onUpdate: (self) => setProgress(self.progress),
      });
      cleanup = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [mode, reducedMotion, lowPower]);

  const event = selectedNode ? timelineEvents.find((e) => e.id === selectedNode.id) : undefined;

  return (
    <div ref={containerRef} className={`relative isolate overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        {lowPower ? (
          <StaticFallback />
        ) : (
          <ClientOnly fallback={<StaticFallback />}>
            <Suspense fallback={<StaticFallback />}>
              <MultiverseCanvas
                nodes={nodes}
                scrollProgress={mode === "hero" ? progress : 0}
                focusedBranch={focusedBranch}
                reducedMotion={reducedMotion}
                onSelectBranch={(id) => setFocusedBranch((cur) => (cur === id ? null : id))}
                onSelectNode={(node) => setSelectedNode(node)}
              />
            </Suspense>
          </ClientOnly>
        )}
      </div>

      {/* comic-medium texture passes */}
      <div className="pointer-events-none absolute inset-0 halftone opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-40 mix-blend-overlay" />

      {/* branch picker */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
        <div className="pointer-events-auto mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFocusedBranch(null)}
            className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors ${
              focusedBranch === null
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            Whole multiverse
          </button>
          <button
            type="button"
            onClick={() => setFocusedBranch("earth-616")}
            className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors ${
              focusedBranch === "earth-616"
                ? "border-primary bg-primary/20 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            Main trunk
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              type="button"
              onClick={() => setFocusedBranch((cur) => (cur === branch.id ? null : branch.id))}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors ${
                focusedBranch === branch.id
                  ? "border-accent bg-accent/15 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ backgroundColor: branch.color, boxShadow: `0 0 10px ${branch.color}` }}
              />
              {branch.label}
            </button>
          ))}
        </div>
      </div>

      {/* selected event panel */}
      {selectedNode && (
        <div className="absolute right-4 top-4 z-20 w-[min(22rem,calc(100%-2rem))] animate-glitch-in ink-panel rounded-lg p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-accent">
                {selectedNode.year}
                {selectedNode.crossover ? " · crossover" : ""}
              </p>
              <h3 className="mt-1 text-2xl leading-none">{selectedNode.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              aria-label="Close event details"
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          {event && (
            <>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{event.summary}</p>
              {event.characters && event.characters.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {event.characters.slice(0, 8).map((id) => {
                    const character = charStore.items.find((c) => c.id === id);
                    if (!character) return null;
                    return (
                      <Link
                        key={id}
                        to="/directory/$characterId"
                        params={{ characterId: id }}
                        className="rounded border border-border px-2 py-0.5 text-xs text-foreground/80 hover:border-accent hover:text-foreground"
                      >
                        {character.alias}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function BranchLegend() {
  const earthStore = useCollection<Earth>("earths");
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {earthStore.items.map((earth) => (
        <li key={earth.id} className="ink-panel rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: earth.hex, boxShadow: `0 0 12px ${earth.hex}` }}
            />
            <p className="font-display text-lg leading-none">{earth.designation}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{earth.description}</p>
        </li>
      ))}
    </ul>
  );
}
