import { useEffect, useState, useRef } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { type Character, type Movie, type TimelineEvent, type Earth } from "@/data/spiderverse";
import { useCollection } from "@/lib/content-store";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const charStore = useCollection<Character>("characters");
  const movieStore = useCollection<Movie>("movies");
  const eventStore = useCollection<TimelineEvent>("timeline-events");
  const earthStore = useCollection<Earth>("earths");

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  if (!open) return null;

  const query = search.toLowerCase();

  const charResults = charStore.items.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.alias?.toLowerCase().includes(query) ||
      c.realName?.toLowerCase().includes(query)
  );
  
  const movieResults = movieStore.items.filter((m) => m.title.toLowerCase().includes(query));
  
  const eventResults = eventStore.items.filter((e) => e.title.toLowerCase().includes(query));

  const earthResults = earthStore.items.filter(
    (e) =>
      e.designation.toLowerCase().includes(query) ||
      (e.description && e.description.toLowerCase().includes(query))
  );

  const hasHelpMatch = "help".includes(query) || "guide".includes(query) || "user".includes(query);

  const hasResults =
    charResults.length > 0 || movieResults.length > 0 || eventResults.length > 0 || earthResults.length > 0 || hasHelpMatch;

  const close = () => setOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl animate-glitch-in">
        <div className="flex items-center border-b border-border px-4 py-3">
          <svg
            className="mr-3 h-5 w-5 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent font-mono text-sm uppercase tracking-widest outline-none placeholder:text-muted-foreground"
            placeholder="Search the multiverse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={close}
            className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:bg-accent/10"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!search && (
            <p className="p-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Search for characters, movies, or events.
            </p>
          )}

          {search && !hasResults && (
            <p className="p-4 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
              No results found across the multiverse.
            </p>
          )}

          {search && hasResults && (
            <div className="space-y-4 py-2">
              {charResults.length > 0 && (
                <div>
                  <h3 className="px-3 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                    Spider-People & Villains
                  </h3>
                  <div className="space-y-1">
                    {charResults.map((c) => (
                      <Link
                        key={c.id}
                        to="/directory/$characterId"
                        params={{ characterId: c.id }}
                        onClick={close}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent/15"
                      >
                        <span className="font-medium text-foreground">{c.alias || c.name}</span>
                        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                          {c.earth}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {movieResults.length > 0 && (
                <div>
                  <h3 className="px-3 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                    Movies
                  </h3>
                  <div className="space-y-1">
                    {movieResults.map((m) => (
                      <Link
                        key={m.id}
                        to={m.type === "live-action" ? "/live-action" : "/animated-films"}
                        onClick={close}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent/15"
                      >
                        <span className="font-medium text-foreground">{m.title}</span>
                        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                          {m.year}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {eventResults.length > 0 && (
                <div>
                  <h3 className="px-3 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                    Timeline Events
                  </h3>
                  <div className="space-y-1">
                    {eventResults.map((e) => (
                      <Link
                        key={e.id}
                        to="/timeline"
                        onClick={close}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent/15"
                      >
                        <span className="font-medium text-foreground">{e.title}</span>
                        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                          {e.year}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {search && hasResults && earthResults.length > 0 && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="px-3 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                  Universes
                </h3>
                <div className="space-y-1">
                  {earthResults.map((e) => (
                    <Link
                      key={e.id}
                      to="/what-is-the-spider-verse"
                      onClick={close}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent/15"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2 rounded-full"
                          style={{ backgroundColor: e.hex, boxShadow: `0 0 10px ${e.hex}` }}
                        />
                        <span className="font-medium text-foreground">{e.designation}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {search && ("help".includes(query) || "guide".includes(query) || "user".includes(query)) && (
            <div className="space-y-4 py-2">
              <div>
                <h3 className="px-3 pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
                  Pages
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/help"
                    onClick={close}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent/15"
                  >
                    <span className="font-medium text-foreground">Help / User Guide</span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      Guide
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
