import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/SiteChrome";

const API_URL = import.meta.env['VITE_API_URL'] || "http://localhost:3001/api";

type SearchResults = {
  characters?: { id: string; name: string; alias: string | null; earthId: string | null; imageUrl: string | null; media: string | null }[];
  earths?: { id: string; designation: string; hex: string | null; description: string | null }[];
  movies?: { id: string; title: string; year: number; type: string }[];
  actors?: { id: string; name: string; role: string | null }[];
  events?: { id: string; title: string; year: number; branch: string }[];
};

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — The Amazing Web" },
      { name: "description", content: "Search across every character, Earth, movie, actor, and event in the Spider-Verse." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: search['q'] as string | undefined,
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(q || "");
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        setResults(await res.json());
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      doSearch(query);
      navigate({ to: "/search", search: { q: query }, replace: true });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Initial search from URL
  useEffect(() => {
    if (q) {
      setQuery(q);
      doSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalResults =
    (results.characters?.length || 0) +
    (results.earths?.length || 0) +
    (results.movies?.length || 0) +
    (results.actors?.length || 0) +
    (results.events?.length || 0);

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title="SEARCH THE MULTIVERSE"
        intro="Find any character, Earth, movie, actor, or event across the Spider-Verse."
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {/* Search Input */}
        <div className="relative mb-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anything..."
            autoFocus
            className="w-full rounded-xl border border-border bg-background/70 px-5 py-4 text-lg text-foreground outline-none placeholder:text-muted-foreground focus:border-accent transition-colors"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <span className="font-mono text-xs text-muted-foreground animate-pulse">Searching…</span>
            </div>
          )}
        </div>

        {/* Results */}
        {query && !loading && totalResults === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No results found for "{query}"</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different search term.</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Start typing to search across the multiverse.</p>
          </div>
        )}

        <div className="space-y-10">
          {/* Characters */}
          {results.characters && results.characters.length > 0 && (
            <ResultSection title="Characters" count={results.characters.length}>
              {results.characters.map((c) => (
                <Link
                  key={c.id}
                  to="/directory/$characterId"
                  params={{ characterId: c.id }}
                  className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4"
                >
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.alias || c.name} className="size-10 rounded-full object-cover border border-border" loading="lazy" />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full border border-border bg-accent/10 text-sm font-bold text-accent">
                      {(c.alias || c.name).charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{c.alias || c.name}</p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{c.earthId || "Unknown Earth"}</p>
                  </div>
                </Link>
              ))}
            </ResultSection>
          )}

          {/* Earths */}
          {results.earths && results.earths.length > 0 && (
            <ResultSection title="Universes" count={results.earths.length}>
              {results.earths.map((e) => (
                <Link
                  key={e.id}
                  to="/earths/$earthId"
                  params={{ earthId: e.id }}
                  className="ink-panel hover-lift flex items-center gap-4 rounded-lg p-4"
                >
                  <span
                    className="size-4 rounded-full shrink-0"
                    style={{ backgroundColor: e.hex || "#888", boxShadow: `0 0 12px ${e.hex || "#888"}` }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{e.designation}</p>
                    {e.description && <p className="text-sm text-muted-foreground line-clamp-1">{e.description}</p>}
                  </div>
                </Link>
              ))}
            </ResultSection>
          )}

          {/* Movies */}
          {results.movies && results.movies.length > 0 && (
            <ResultSection title="Movies" count={results.movies.length}>
              {results.movies.map((m) => (
                <Link
                  key={m.id}
                  to="/movies/$movieId"
                  params={{ movieId: m.id }}
                  className="ink-panel hover-lift flex items-center justify-between rounded-lg p-4"
                >
                  <p className="font-medium text-foreground">{m.title}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm text-accent">{m.year}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                      {m.type}
                    </span>
                  </div>
                </Link>
              ))}
            </ResultSection>
          )}

          {/* Actors */}
          {results.actors && results.actors.length > 0 && (
            <ResultSection title="Actors" count={results.actors.length}>
              {results.actors.map((a) => (
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
                    {a.role && <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{a.role}</p>}
                  </div>
                </Link>
              ))}
            </ResultSection>
          )}

          {/* Events */}
          {results.events && results.events.length > 0 && (
            <ResultSection title="Events" count={results.events.length}>
              {results.events.map((e) => (
                <Link
                  key={e.id}
                  to="/timeline"
                  className="ink-panel hover-lift flex items-center justify-between rounded-lg p-4"
                >
                  <p className="font-medium text-foreground">{e.title}</p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm text-accent">{e.year}</span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
                      {e.branch}
                    </span>
                  </div>
                </Link>
              ))}
            </ResultSection>
          )}
        </div>
      </div>
    </>
  );
}

function ResultSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-accent">{title}</h2>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[0.6rem] text-accent">{count}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
    </section>
  );
}
