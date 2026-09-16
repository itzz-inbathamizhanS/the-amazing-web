# Frontend Technical Details

## Framework
The frontend is built using **Vite**, offering lightning-fast HMR and optimized production builds. It uses **React 18** with strict mode enabled.

## Routing
**TanStack Router** is used for type-safe, file-based routing. Routes are defined in `Frontend/src/routes/` and generated automatically via the TanStack Vite plugin.

## 3D Rendering
The `react-force-graph-3d` library handles the 3D visualization. It wraps Three.js and provides a force-directed graph physics engine.
- **Optimization**: The graph limits device pixel ratio (`dpr`) to a maximum of 2 to prevent WebGL crashes on mobile devices.
- **Layout**: The sticky hero container uses `h-[100dvh]` to ensure the canvas does not jitter when mobile browser address bars expand/collapse.

## Styling
**Tailwind CSS** handles all styling, utilizing a custom design system defined in `tailwind.config.ts`. The theme relies heavily on CSS variables for dynamic dark mode (Void theme).