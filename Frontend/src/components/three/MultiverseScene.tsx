import { Billboard, Html, OrbitControls } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  branches,
  crossoverPoint,
  trunkCurve,
  type BranchNode,
} from "@/lib/timeline-graph";

type GlowLineProps = {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  radius?: number;
  dim?: boolean;
  onSelect?: () => void;
};

/**
 * A line is drawn as two additive tubes: a bright thin core and a wide,
 * faint halo. Cheap, and reads as emissive glow without a bloom pass.
 */
function GlowLine({ curve, color, radius = 0.055, dim = false, onSelect }: GlowLineProps) {
  const core = useMemo(() => new THREE.TubeGeometry(curve, 140, radius, 6, false), [curve, radius]);
  const halo = useMemo(
    () => new THREE.TubeGeometry(curve, 90, radius * 6.5, 6, false),
    [curve, radius],
  );

  useEffect(() => () => {
    core.dispose();
    halo.dispose();
  }, [core, halo]);

  return (
    <group
      {...(onSelect
        ? {
            onClick: (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onSelect();
            },
          }
        : {})}
    >
      <mesh geometry={core}>
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          transparent
          opacity={dim ? 0.35 : 1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh geometry={halo}>
        <meshBasicMaterial
          color={color}
          toneMapped={false}
          transparent
          opacity={dim ? 0.04 : 0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function EventNode({
  node,
  dim,
  onSelect,
}: {
  node: BranchNode;
  dim: boolean;
  onSelect: (node: BranchNode) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 6.28, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6 + seed) * 0.12;
    const s = (hovered ? 1.6 : 1) * pulse;
    ref.current.scale.setScalar(s);
  });

  const size = node.crossover ? 0.42 : 0.26;

  return (
    <group position={node.position}>
      <mesh
        ref={ref}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={node.color} toneMapped={false} />
      </mesh>
      <Billboard>
        <mesh>
          <circleGeometry args={[size * 5, 24]} />
          <meshBasicMaterial
            color={node.color}
            transparent
            opacity={dim ? 0.06 : hovered ? 0.35 : 0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>
      {hovered && (
        <Html center distanceFactor={26} position={[0, size * 4, 0]} zIndexRange={[20, 0]}>
          <div className="pointer-events-none w-max max-w-[16rem] -translate-y-2 rounded-md border border-border/80 bg-popover/90 px-3 py-2 text-center backdrop-blur">
            <p className="font-display text-base leading-none text-foreground">{node.title}</p>
            <p className="mt-1 font-mono text-[0.65rem] tracking-widest text-muted-foreground">
              {node.year}
              {node.crossover ? " · CROSSOVER" : ""}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Starfield({ count = 900 }: { count?: number }) {
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.22}
        sizeAttenuation
        color="#cfd8ff"
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function DustMotes() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 260;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.15) * 1.2;
      ref.current.rotation.z = clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        color="#8fa6ff"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig({
  target,
  reducedMotion,
}: {
  target: { pos: THREE.Vector3; target: THREE.Vector3 };
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // If the target changes programmatically (e.g. scrolling or clicking a branch),
  // we resume programmatic control briefly to move there.
  useEffect(() => {
    setUserInteracted(false);
  }, [target]);

  useEffect(() => {
    if (reducedMotion && controls.current) {
      camera.position.copy(target.pos);
      controls.current.target.copy(target.target);
      controls.current.update();
    }
  }, [camera, reducedMotion, target]);

  useFrame((_, rawDelta) => {
    if (userInteracted || !controls.current) return;
    
    const delta = Math.min(rawDelta, 0.05);
    const k = reducedMotion ? 30 : 2.2;
    const alpha = 1 - Math.exp(-k * delta);
    
    camera.position.lerp(target.pos, alpha);
    controls.current.target.lerp(target.target, alpha);
    controls.current.update();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
      onStart={() => setUserInteracted(true)}
    />
  );
}

export type MultiverseSceneProps = {
  nodes: BranchNode[];
  cameraTarget: { pos: THREE.Vector3; target: THREE.Vector3 };
  focusedBranch: string | null;
  reducedMotion?: boolean | undefined;
  onSelectBranch?: ((id: string) => void) | undefined;
  onSelectNode?: ((node: BranchNode) => void) | undefined;
};

export default function MultiverseScene({
  nodes,
  cameraTarget,
  focusedBranch,
  reducedMotion = false,
  onSelectBranch,
  onSelectNode,
}: MultiverseSceneProps) {
  const trunkColor = "#ff3b5c";

  return (
    <>
      <color attach="background" args={["#0b0d1a"]} />
      <fog attach="fog" args={["#0b0d1a", 60, 150]} />
      <ambientLight intensity={0.4} />
      <CameraRig target={cameraTarget} reducedMotion={reducedMotion} />

      <Starfield />
      <DustMotes />

      <GlowLine
        curve={trunkCurve}
        color={trunkColor}
        radius={0.09}
        dim={Boolean(focusedBranch) && focusedBranch !== "earth-616"}
        onSelect={() => onSelectBranch?.("earth-616")}
      />

      {branches.map((branch) => (
        <GlowLine
          key={branch.id}
          curve={branch.curve}
          color={branch.color}
          dim={Boolean(focusedBranch) && focusedBranch !== branch.id}
          onSelect={() => onSelectBranch?.(branch.id)}
        />
      ))}

      {/* the point where crossover branches touch */}
      <group position={crossoverPoint}>
        <mesh>
          <sphereGeometry args={[0.5, 20, 20]} />
          <meshBasicMaterial color="#fff2d0" toneMapped={false} />
        </mesh>
        <Billboard>
          <mesh>
            <circleGeometry args={[3.4, 32]} />
            <meshBasicMaterial
              color="#ffd9a0"
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </Billboard>
      </group>

      {nodes.map((node) => (
        <EventNode
          key={`${node.branchId}-${node.id}`}
          node={node}
          dim={Boolean(focusedBranch) && focusedBranch !== node.branchId}
          onSelect={(n) => onSelectNode?.(n)}
        />
      ))}
    </>
  );
}
