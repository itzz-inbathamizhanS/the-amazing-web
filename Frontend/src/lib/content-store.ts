import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env['VITE_API_URL'] || "http://localhost:3001/api";

// Mapper to align backend schema with frontend expected types
export function mapFromApi(key: string, item: any): any {
  if (key === "characters") {
    return {
      ...item,
      earth: item.earthId || item.earth, // frontend uses 'earth' for the ID string
      tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()) : [],
      powers: item.powers ? item.powers.split(',').map((t: string) => t.trim()) : [],
      media: (() => {
        // Prefer the DB-stored media column
        if (item.media) return item.media.split(',').map((t: string) => t.trim());
        // Fallback heuristic for legacy records without media set
        const earth = item.earthId || item.earth || '';
        const tags = item.tags ? item.tags.toLowerCase() : '';
        if (tags.includes('live-action') || ['earth-96283', 'earth-120703', 'earth-199999'].includes(earth)) return ['live-action'];
        if (tags.includes('animated') || earth === 'earth-1610') return ['animated'];
        return ['comics'];
      })(),
      appearsIn: item.timelineEvents ? item.timelineEvents.map((te: any) => te.eventId) : [],
      related: item.relatedCharacters ? item.relatedCharacters.map((r: any) => r.relatedCharacterId) : []
    };
  }
  if (key === "timeline-events") {
    return {
      ...item,
      characters: item.characters ? item.characters.map((c: any) => c.characterId) : [],
      issues: item.issues ? item.issues.split(',').map((t: string) => t.trim()) : []
    };
  }
  if (key === "movies") {
    return {
      ...item,
      watchOrder: item.watchOrderRank,
      cast: item.actors ? item.actors.map((a: any) => a.actorId) : [],
      characters: item.characters ? item.characters.map((c: any) => c.characterId) : []
    };
  }
  if (key === "actors") {
    return {
      ...item,
      movies: []
    };
  }
  if (key === "earths") {
    return {
      ...item,
      hex: item.hex || '#ff3b5c',
      colorVar: item.colorVar || `--${item.id}`
    }
  }
  return item;
}

// Mapper to align frontend data for backend saving
function mapToApi(key: string, item: any): any {
  if (key === "characters") {
    const data = { ...item };
    if (data.earth) {
      data.earthId = data.earth;
      delete data.earth;
    }
    if (Array.isArray(data.tags)) data.tags = data.tags.join(', ');
    if (Array.isArray(data.powers)) data.powers = data.powers.join(', ');
    if (Array.isArray(data.media)) data.media = data.media.join(', ');
    delete data.appearsIn;
    delete data.related;
    return data;
  }
  if (key === "movies") {
    const data = { ...item };
    if (data.watchOrder) {
      data.watchOrderRank = data.watchOrder;
      delete data.watchOrder;
    }
    delete data.cast;
    delete data.characters;
    return data;
  }
  if (key === "timeline-events") {
    const data = { ...item };
    if (Array.isArray(data.issues)) {
      data.issues = data.issues.join(', ');
    }
    delete data.characters;
    return data;
  }
  return item;
}
// Keys that have real backend API endpoints
const BACKEND_KEYS = new Set(["characters", "earths", "timeline-events", "movies", "actors", "attachments"]);

// Ensure keys match backend endpoints
function getEndpoint(key: string): string | null {
  if (!BACKEND_KEYS.has(key)) return null; // local-only collection
  if (key === "timeline-events") return "events";
  return key; // characters, earths, movies, actors, attachments
}

/** Build headers for mutation requests, including the admin API key if available. */
function mutationHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const key = localStorage.getItem("spider-admin-key");
    if (key) headers["x-api-key"] = key;
  }
  return headers;
}

/** Build headers for delete requests (no Content-Type needed). */
function deleteHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const key = localStorage.getItem("spider-admin-key");
    if (key) headers["x-api-key"] = key;
  }
  return headers;
}

export type Collection<T> = {
  items: T[];
  hydrated: boolean;
  isCustom: (id: string) => boolean;
  isEdited: (id: string) => boolean;
  create: (value: T) => void;
  update: (id: string, value: Partial<T>) => void;
  remove: (id: string) => void;
  resetAll: () => void;
  hasChanges: boolean;
};

export function useCollection<T extends { id: string }>(
  key: string,
  seedData?: T[]
): Collection<T> {
  const queryClient = useQueryClient();
  const endpointPath = getEndpoint(key);
  const isLocal = endpointPath === null;
  const endpoint = isLocal ? null : `${API_URL}/${endpointPath}`;

  // For local-only collections, use localStorage
  const getLocalData = (): T[] => {
    if (typeof window === "undefined") return seedData || [];
    const stored = localStorage.getItem(`collection-${key}`);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fall through */ }
    }
    return seedData || [];
  };

  const setLocalData = (items: T[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`collection-${key}`, JSON.stringify(items));
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: [key],
    queryFn: async () => {
      if (isLocal) return getLocalData();
      try {
        const res = await fetch(endpoint!);
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        return json.map((item: any) => mapFromApi(key, item));
      } catch (err) {
        console.error("Failed to fetch", key, err);
        return [];
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (value: T) => {
      if (isLocal) {
        const current = getLocalData();
        const updated = [...current, value];
        setLocalData(updated);
        return value;
      }
      const res = await fetch(endpoint!, {
        method: "POST",
        headers: mutationHeaders(),
        body: JSON.stringify(mapToApi(key, value)),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: Partial<T> }) => {
      if (isLocal) {
        const current = getLocalData();
        const updated = current.map((item) => item.id === id ? { ...item, ...value } : item);
        setLocalData(updated);
        return value;
      }
      const res = await fetch(`${endpoint!}/${id}`, {
        method: "PUT",
        headers: mutationHeaders(),
        body: JSON.stringify(mapToApi(key, value)),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isLocal) {
        const current = getLocalData();
        setLocalData(current.filter((item) => item.id !== id));
        return;
      }
      const res = await fetch(`${endpoint!}/${id}`, { method: "DELETE", headers: deleteHeaders() });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
  });

  return {
    items: data || [],
    hydrated: !isLoading,
    isCustom: () => false,
    isEdited: () => false,
    create: (value: T) => createMutation.mutate(value),
    update: (id: string, value: Partial<T>) => updateMutation.mutate({ id, value }),
    remove: (id: string) => removeMutation.mutate(id),
    resetAll: () => {
      if (isLocal && seedData) {
        setLocalData(seedData);
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
    hasChanges: false,
  };
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000).toString(36)}`;
}

