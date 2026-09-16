import { createFileRoute } from "@tanstack/react-router";
import { useCollection } from "@/lib/content-store";
import { type Character, type Earth } from "@/data/spiderverse";
import { PageHeader } from "@/components/SiteChrome";
import { lazy, Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
// @ts-ignore
import SpriteText from "three-spritetext";

// Dynamically import to avoid SSR window errors
const ForceGraph3D = lazy(() => import("react-force-graph-3d"));

export const Route = createFileRoute("/web-of-life")({
  head: () => ({
    meta: [
      { title: "The Web of Life — The Amazing Web" },
      {
        name: "description",
        content: "An interactive 3D graph mapping the connections between all characters.",
      },
    ],
  }),
  component: WebOfLife,
});

function WebOfLife() {
  const charStore = useCollection<Character>("characters");
  const earthStore = useCollection<Earth>("earths");
  const fgRef = useRef<any>(null);

  const graphData = useMemo(() => {
    const nodes = charStore.items.map((c) => {
      const earth = earthStore.items.find((e) => e.id === c.earth);
      return {
        id: c.id,
        name: c.alias || c.name,
        val: c.id === "peter-parker" ? 25 : 10,
        color: earth?.hex || "#ff3b5c",
        earthName: earth?.designation || earth?.id || "Unknown Universe",
        imageUrl: c.imageUrl,
      };
    });

    const links: any[] = [];
    charStore.items.forEach((c) => {
      if (c.related) {
        c.related.forEach((rId) => {
          if (nodes.find((n) => n.id === rId)) {
            links.push({
              source: c.id,
              target: rId,
            });
          }
        });
      }
    });

    return { nodes, links };
  }, [charStore.items, earthStore.items]);

  useEffect(() => {
    // Wait for the lazy-loaded component to mount, then adjust physics to spread nodes out
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force("charge").strength(-350); // Push nodes apart reasonably
        fgRef.current.d3Force("link").distance(80); // Keep distances manageable for better zooming
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [graphData]);

  return (
    <>
      <PageHeader
        eyebrow="Connections"
        title="THE WEB OF LIFE AND DESTINY"
        intro="An interactive 3D map of relationships across the multiverse. Drag to rotate the camera, scroll to zoom, and click nodes to explore."
      />

      <div className="mx-auto max-w-[110rem] px-4 py-8 sm:px-6">
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden rounded-2xl border border-red-900/30 bg-black shadow-2xl shadow-red-900/10">
          
          {/* Custom ASM2 Background Image */}
          <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen">
            <img 
              src="/images/asm2-bg.jpg" 
              alt="ASM2 Logo" 
              className="h-full w-full object-cover" 
            />
          </div>

          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center font-mono text-sm uppercase tracking-widest text-red-500 animate-pulse">
                Weaving the 3D web...
              </div>
            }
          >
            {typeof window !== "undefined" && (
              <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                controlType="orbit"
                nodeLabel="name"
                nodeColor="color"
                linkColor={() => "rgba(220, 20, 20, 0.4)"}
                backgroundColor="rgba(0,0,0,0)"
                linkWidth={1.5}
                linkCurvature={0.2}
                linkDirectionalParticles={4}
                linkDirectionalParticleWidth={3}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleColor={() => "#ff1a1a"}
                nodeThreeObject={(node: any) => {
                  const group = new THREE.Group();
                  
                  // 1. Image Billboard
                  const scale = node.val * 2; // Better proportion for zooming
                  if (node.imageUrl) {
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.setCrossOrigin('anonymous');
                    const imgTexture = textureLoader.load(node.imageUrl);
                    imgTexture.colorSpace = THREE.SRGBColorSpace;
                    const material = new THREE.SpriteMaterial({ map: imgTexture, color: 0xffffff });
                    const sprite = new THREE.Sprite(material);
                    sprite.scale.set(scale, scale, 1);
                    group.add(sprite);
                  } else {
                    const geometry = new THREE.SphereGeometry(Math.cbrt(node.val) * 4);
                    const material = new THREE.MeshLambertMaterial({
                      color: node.color,
                      transparent: true,
                      opacity: 0.9,
                    });
                    const sphere = new THREE.Mesh(geometry, material);
                    group.add(sphere);
                  }

                  // 2. Permanent Floating Text Label (Name + Universe)
                  const spriteText = new SpriteText(`${node.name}\n${node.earthName}`);
                  spriteText.color = 'rgba(255, 255, 255, 0.8)';
                  spriteText.textHeight = node.val === 25 ? 5 : 3.5; 
                  spriteText.fontFace = 'Space Mono, monospace';
                  spriteText.fontWeight = 'normal';
                  spriteText.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                  spriteText.padding = 2;
                  spriteText.borderRadius = 2;
                  
                  // Position the text slightly below the image
                  spriteText.position.y = - (scale / 2) - 6;
                  
                  group.add(spriteText);

                  return group;
                }}
                onNodeClick={(node: any) => {
                  // Calculate new camera position
                  const distance = 40;
                  const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                  
                  if (fgRef.current) {
                    fgRef.current.cameraPosition(
                      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                      node, // lookAt
                      1500  // ms transition
                    );
                  }
                }}
                onNodeRightClick={(node: any) => {
                  window.location.href = `/directory/${node.id}`;
                }}
              />
            )}
          </Suspense>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <strong>Left Click</strong> a character to zoom and focus the camera on them. <strong>Right Click</strong> to visit their full profile.
        </p>
      </div>
    </>
  );
}
