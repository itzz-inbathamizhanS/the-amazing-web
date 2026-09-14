import { useCallback, useEffect, useState } from "react";
import type { TimelineEvent } from "@/data/spiderverse";

const STORAGE_KEY = "branching-web:my-timeline-events";

export type MyEvent = TimelineEvent & { custom: true };

function read(): MyEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MyEvent[]) : [];
  } catch {
    return [];
  }
}

export function useMyEvents() {
  const [events, setEvents] = useState<MyEvent[]>([]);

  useEffect(() => {
    setEvents(read());
  }, []);

  const persist = useCallback((next: MyEvent[]) => {
    setEvents(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep the in-memory copy */
    }
  }, []);

  const addEvent = useCallback(
    (input: {
      title: string;
      year: number;
      dateRange: string;
      summary: string;
      branch: string;
      issues: string[];
    }) => {
      const next: MyEvent[] = [
        ...read(),
        {
          id: `mine-${Date.now().toString(36)}`,
          title: input.title,
          year: input.year,
          dateRange: input.dateRange || String(input.year),
          summary: input.summary,
          branch: input.branch,
          characters: [],
          issues: input.issues,
          custom: true,
        },
      ];
      persist(next);
    },
    [persist],
  );

  const updateEvent = useCallback(
    (
      id: string,
      input: {
        title: string;
        year: number;
        dateRange: string;
        summary: string;
        branch: string;
        issues: string[];
      },
    ) => {
      persist(
        read().map((e) =>
          e.id === id
            ? {
                ...e,
                title: input.title,
                year: input.year,
                dateRange: input.dateRange || String(input.year),
                summary: input.summary,
                branch: input.branch,
                issues: input.issues,
              }
            : e,
        ),
      );
    },
    [persist],
  );

  const removeEvent = useCallback(
    (id: string) => {
      persist(read().filter((e) => e.id !== id));
    },
    [persist],
  );

  return { events, addEvent, updateEvent, removeEvent };
}
