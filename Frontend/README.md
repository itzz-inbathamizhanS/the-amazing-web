# Spider-Verse Codex

Build a cinematic, 3D-enhanced website about the Marvel Spider-Verse — a fan reference site covering every Spider-Man/Spider-Woman variant across the comics multiverse, the animated Spider-Verse films, and real-world live-action movies. Prioritize a strong visual "cinematic" first impression over a plain content site.

Use React Three Fiber (Three.js) with @react-three/drei for 3D scenes, and GSAP with ScrollTrigger for scroll-driven camera/scene animation, layered under Tailwind CSS for all text/UI overlays.

CORE VISUAL CONCEPT (Homepage hero):
A 3D scene showing a single glowing main timeline "trunk" line running through space, representing the core Marvel timeline. At several points along it, the trunk splits into separate glowing branch lines curving off into their own paths — like a river delta or tree branching — each branch representing a different alternate universe/Earth. Give each branch its own accent color. Place small glowing nodes along each line representing key story events; hovering a node shows a floating label with a title and year. On load, the camera is pulled back to show the whole branching structure at once, then scrolling or clicking lets the user travel down a specific branch to explore it closer. Where multiple branches represent a "crossover" moment, have them curve inward and briefly touch at one glowing point before separating again.

Use a moody dark navy/black space background, soft glow/bloom on the lines and nodes, subtle particle effects, and light comic-inspired touches (subtle halftone-dot texture, light glitch/scanline transitions between sections) — this should be an original design inspired by the comic-book medium in general, NOT a copy of any specific film studio's exact art style, characters, or logos. Represent characters as abstract glowing nodes/icons, not rendered character likenesses.

PAGES TO BUILD:
1. Home — the 3D branching timeline hero scene described above
2. What Is the Spider-Verse — short explainer section on the multiverse concept and "Earth-###" numbering
3. Spider-People Directory — grid of character cards, filterable by Earth / medium (comics, animated, live-action) / tags, each opening a detail page
4. Comics Timeline — full-page version of the branching 3D timeline, with a normal list/table fallback view toggle for accessibility
5. Animated Films — Into the Spider-Verse trilogy, linked to Directory characters
6. Live-Action Movies & Actors — actor/movie history and MCU connections
7. Adjacent Characters — Daredevil, Deadpool, clearly labeled as "connected, not core Spider-Verse"
8. My Comics Collection — personal library page (we'll wire up storage in a later step)

Keep the 3D scene performant: use simple tube/line geometry with emissive glow rather than heavy geometry, lazy-load non-hero 3D content, and provide a static fallback hero image for low-power devices or reduced-motion preference.

For now, use placeholder/mock data for characters, Earths, and timeline events — we'll connect a real database next.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8f49d066-479e-41a4-9430-3160c633e84a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
