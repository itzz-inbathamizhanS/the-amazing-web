import { type ReactNode } from "react";

/** Animated skeleton loader card */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ink-panel animate-pulse rounded-lg p-6">
      <div className="h-3 w-20 rounded bg-muted/60 mb-3" />
      <div className="h-7 w-3/4 rounded bg-muted/40 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded bg-muted/30 mb-2"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

/** Grid of skeleton cards for directory/list pages */
export function SkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  const colClass =
    cols === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : cols === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/** Timeline skeleton with vertical bar */
export function SkeletonTimeline({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="size-3 rounded-full bg-muted/50" />
            <div className="w-px flex-1 bg-muted/30" />
          </div>
          <div className="flex-1 pb-6">
            <div className="h-3 w-16 rounded bg-muted/50 mb-2" />
            <div className="h-6 w-2/3 rounded bg-muted/40 mb-3" />
            <div className="h-3 w-full rounded bg-muted/30 mb-2" />
            <div className="h-3 w-4/5 rounded bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Inline loading spinner */
export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20">
      <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

/** Error boundary fallback for individual route sections */
export function SectionError({
  title = "This section couldn't load",
  onRetry,
}: {
  title?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="ink-panel rounded-lg p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-destructive">Error</p>
      <h3 className="mt-2 text-xl font-display">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong loading this content. Try refreshing, or report this if it keeps happening.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/** Empty state for when a collection has no items */
export function EmptyState({
  icon = "🕸️",
  title = "Nothing here yet",
  description = "No items match your current filters.",
}: {
  icon?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-3 text-lg font-display">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
