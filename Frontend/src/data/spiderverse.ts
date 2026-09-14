/**
 * Mock content for the Spider-Verse reference site.
 * Shapes mirror the planned database tables so swapping to a real
 * backend later only changes the data source, not the components.
 */

export type Medium = "comics" | "animated" | "live-action";

export type Earth = {
  id: string;
  designation: string;
  /** CSS token name used for this universe's accent colour. */
  colorVar: string;
  /** Hex used by the 3D scene (Three.js can't read CSS vars). */
  hex: string;
  description: string;
  primaryCharacter: string;
};

export type Character = {
  id: string;
  name: string;
  alias: string;
  earth: string;
  realName: string;
  firstAppearance: string;
  description: string;
  powers: string[];
  media: Medium[];
  tags: string[];
  imageUrl?: string;
  appearsIn: string[];
  related: string[];
};

export type TimelineEvent = {
  id: string;
  title: string;
  year: number;
  dateRange: string;
  summary: string;
  branch: string;
  characters: string[];
  issues: string[];
  crossover?: boolean;
};

export type Movie = {
  id: string;
  title: string;
  year: number;
  type: Medium;
  continuity: string;
  cast: string[];
  watchOrder: number;
  summary: string;
  characters: string[];
};

export type Actor = {
  id: string;
  name: string;
  role: string;
  era: string;
  movies: string[];
  note: string;
};

export const mediumLabel: Record<Medium, string> = {
  comics: "Comics",
  animated: "Animated",
  "live-action": "Live-action",
};
