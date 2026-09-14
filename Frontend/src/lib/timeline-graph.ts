import * as THREE from "three";
import { type TimelineEvent, type Earth } from "@/data/spiderverse";

export type BranchNode = {
  id: string;
  title: string;
  year: number;
  position: THREE.Vector3;
  color: string;
  branchId: string;
  crossover?: boolean;
};

export type Branch = {
  id: string;
  label: string;
  color: string;
  curve: THREE.CatmullRomCurve3;
  /** where along the trunk this branch splits off (0-1) */
  split: number;
};

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** The main continuity: one long, slightly wavering line through space. */
export const trunkCurve = new THREE.CatmullRomCurve3([
  v(-34, -1.4, 2),
  v(-22, -0.4, -1),
  v(-10, 0.4, 1),
  v(2, 0.2, -1.5),
  v(14, -0.4, 1),
  v(26, -1, -1),
  v(36, -1.8, 1.5),
]);

/**
 * Branch definitions. Each curves away from a point on the trunk, and the
 * two crossover branches bend back inward to touch at the crossover node
 * before separating again.
 */
const branchSpecs: Array<{
  id: string;
  label: string;
  split: number;
  dir: [number, number];
  reach: number;
  crossoverPull?: boolean;
  hex: string;
}> = [
  { id: "earth-928", label: "Earth-928 · 2099", split: 0.3, dir: [1, 0.7], reach: 16, hex: "#3fe89a" },
  { id: "earth-1610", label: "Earth-1610 · Ultimate", split: 0.42, dir: [-1, -0.9], reach: 20, crossoverPull: true, hex: "#9d6bff" },
  { id: "earth-65", label: "Earth-65 · Ghost-Spider", split: 0.55, dir: [1, -1], reach: 18, crossoverPull: true, hex: "#3fd8e8" },
  { id: "earth-90214", label: "Earth-90214 · Noir", split: 0.6, dir: [-1, 0.55], reach: 13, hex: "#c9cddb" },
  { id: "earth-8311", label: "Earth-8311 · Spider-Ham", split: 0.66, dir: [1, 1.25], reach: 11, hex: "#ffc23f" },
  { id: "earth-14512", label: "Earth-14512 · SP//dr", split: 0.7, dir: [-1, 1.1], reach: 12, hex: "#6ee7ff" },
  { id: "earth-138", label: "Earth-138 · Spider-Punk", split: 0.75, dir: [1, -1.5], reach: 14, hex: "#ffd23f" },
  { id: "earth-50101", label: "Earth-50101 · Mumbai", split: 0.8, dir: [-1, -1.45], reach: 13, hex: "#ff7a3f" },
  { id: "earth-982", label: "Earth-982 · MC2", split: 0.86, dir: [1, 0.35], reach: 11, hex: "#c48bff" },
  { id: "live-action", label: "Live-action continuities", split: 0.92, dir: [-1, 0.15], reach: 15, hex: "#7fb2ff" },
];

/** Single point in space where crossover branches briefly touch. */
export const crossoverPoint = v(6, 5.2, -6.5);

const colorFor = (id: string, earths?: Earth[]) => {
  if (id === "earth-616") return "#ff3b5c";
  if (id === "live-action") return "#7fb2ff";
  const branchHex = branchSpecs.find(b => b.id === id)?.hex;
  if (branchHex) return branchHex;
  const earthHex = earths?.find((e) => e.id === id)?.hex;
  return earthHex ?? "#ff3b5c";
};

export const branches: Branch[] = branchSpecs.map((spec) => {
  const origin = trunkCurve.getPointAt(spec.split);
  const tangent = trunkCurve.getTangentAt(spec.split);
  const [sy, sz] = spec.dir;

  const p1 = origin.clone().add(tangent.clone().multiplyScalar(spec.reach * 0.25));
  p1.y += sy * spec.reach * 0.12;
  p1.z += sz * spec.reach * 0.1;

  const p2 = origin.clone().add(tangent.clone().multiplyScalar(spec.reach * 0.6));
  p2.y += sy * spec.reach * 0.4;
  p2.z += sz * spec.reach * 0.34;

  const p3 = origin.clone().add(tangent.clone().multiplyScalar(spec.reach * 0.95));
  p3.y += sy * spec.reach * 0.72;
  p3.z += sz * spec.reach * 0.6;

  const end = origin.clone().add(tangent.clone().multiplyScalar(spec.reach * 1.25));
  end.y += sy * spec.reach * 0.98;
  end.z += sz * spec.reach * 0.85;

  const points = spec.crossoverPull
    ? [origin.clone(), p1, crossoverPoint.clone(), p3, end]
    : [origin.clone(), p1, p2, p3, end];

  return {
    id: spec.id,
    label: spec.label,
    color: colorFor(spec.id),
    split: spec.split,
    curve: new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4),
  };
});

export const getBranch = (id: string) => branches.find((b) => b.id === id);

/** Event nodes distributed along the trunk and its branches. */
export function computeNodes(timelineEvents: TimelineEvent[], earths: Earth[]): BranchNode[] {
  const sortedEvents = [...timelineEvents].sort((a, b) => a.year - b.year);
  
  const trunkEvents = sortedEvents.filter((e) => e.branch === "earth-616");
  const out: BranchNode[] = [];

  trunkEvents.forEach((event, i) => {
    const t = 0.12 + (i / Math.max(trunkEvents.length - 1, 1)) * 0.7;
    out.push({
      id: event.id,
      title: event.title,
      year: event.year,
      position: trunkCurve.getPointAt(t),
      color: colorFor("earth-616", earths),
      branchId: "earth-616",
    });
  });

  branches.forEach((branch) => {
    const branchEvents = sortedEvents.filter((e) => {
      if (e.branch === branch.id) return true;
      if (branch.id === "live-action" && ["earth-96283", "earth-120703", "earth-199999"].includes(e.branch)) return true;
      return false;
    });
    const positions = branchEvents.length === 1 ? [0.62] : [0.42, 0.78, 0.95];
    branchEvents.forEach((event, i) => {
      out.push({
        id: event.id,
        title: event.title,
        year: event.year,
        position: branch.curve.getPointAt(positions[i % positions.length] ?? 0.62),
        color: branch.color,
        branchId: branch.id,
      });
    });
  });

  sortedEvents
    .filter((e) => e.crossover && e.branch === "crossover")
    .forEach((event, i) => {
      out.push({
        id: event.id,
        title: event.title,
        year: event.year,
        position: crossoverPoint.clone().add(v(i * 1.6 - 0.8, i * 0.5, i * 0.9)),
        color: "#ffd9a0",
        branchId: "crossover",
        crossover: true,
      });
    });

  return out;
}

/** Camera framings: wide overview, then one per branch. */
export function overviewCamera() {
  return { pos: v(0, 6, 62), target: v(1, 1, 0) };
}

export function branchCamera(branchId: string) {
  if (branchId === "crossover") {
    return { pos: crossoverPoint.clone().add(v(6, 5, 16)), target: crossoverPoint.clone() };
  }
  const branch = getBranch(branchId);
  if (!branch) return overviewCamera();
  const mid = branch.curve.getPointAt(0.55);
  const end = branch.curve.getPointAt(1);
  const offset = end.clone().sub(mid).normalize().multiplyScalar(4);
  return {
    pos: mid.clone().add(v(offset.x + 8, offset.y + 4, 16)),
    target: mid.clone(),
  };
}

/** Trunk fly-through framing driven by scroll progress (0-1). */
export function scrollCamera(progress: number) {
  const t = Math.min(Math.max(progress, 0), 0.999);
  const eased = 0.05 + t * 0.85;
  const point = trunkCurve.getPointAt(eased);
  const ahead = trunkCurve.getPointAt(Math.min(eased + 0.08, 1));
  const zoom = 62 - t * 40;
  return {
    pos: v(point.x - 6, point.y + 5 + t * 2, zoom * 0.5 + 12),
    target: ahead.clone().add(v(0, 1.5, 0)),
  };
}
