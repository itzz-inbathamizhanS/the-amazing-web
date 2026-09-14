import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import MultiverseScene from "./MultiverseScene";
import { branchCamera, overviewCamera, scrollCamera, type BranchNode } from "@/lib/timeline-graph";

export type MultiverseCanvasProps = {
  nodes: BranchNode[];
  /** 0-1 scroll progress that flies the camera down the trunk */
  scrollProgress?: number;
  focusedBranch: string | null;
  onSelectBranch?: (id: string) => void;
  onSelectNode?: (node: BranchNode) => void;
  reducedMotion?: boolean;
};

export default function MultiverseCanvas({
  nodes,
  scrollProgress = 0,
  focusedBranch,
  onSelectBranch,
  onSelectNode,
  reducedMotion = false,
}: MultiverseCanvasProps) {
  const [dpr, setDpr] = useState(1);
  const frame = useRef(0);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 2));
  }, []);

  const cameraTarget = useMemo(() => {
    if (focusedBranch) return branchCamera(focusedBranch);
    if (scrollProgress > 0.02) return scrollCamera(scrollProgress);
    return overviewCamera();
  }, [focusedBranch, scrollProgress]);

  return (
    <Canvas
      dpr={dpr}
      frameloop={reducedMotion ? "demand" : "always"}
      camera={{ position: [0, 6, 78], fov: 52, near: 0.1, far: 400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color("#0b0d1a"));
        frame.current += 1;
      }}
    >
      <Suspense fallback={null}>
        <MultiverseScene
          nodes={nodes}
          cameraTarget={cameraTarget}
          focusedBranch={focusedBranch}
          reducedMotion={reducedMotion}
          onSelectBranch={onSelectBranch}
          onSelectNode={onSelectNode}
        />
      </Suspense>
    </Canvas>
  );
}
