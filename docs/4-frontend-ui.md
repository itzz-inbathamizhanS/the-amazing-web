# 4. Frontend & User Interface

## Framework & Routing
The frontend is built using **Vite** and **React 18**. **TanStack Router** is used for type-safe, file-based routing. Routes are defined in `Frontend/src/routes/` and generated automatically. State management and data fetching are handled by **TanStack Query** (React Query).

## 3D Rendering Engine
The `react-force-graph-3d` library handles the core 3D visualization.
- **Mobile Optimizations**: The graph limits device pixel ratio (`dpr`) to a maximum of 2 to prevent WebGL crashes on mobile devices.
- **Dynamic Viewport Heights**: The sticky hero container uses `h-[100dvh]` to ensure the canvas does not jitter when mobile browser address bars expand/collapse.

## Styling & Theme
**Tailwind CSS** handles all styling, utilizing a custom design system defined in `tailwind.config.ts`. The application uses a strictly dark-mode theme (referred to as the "Void" theme), employing deep blacks, muted grays, and vivid neon accent colors derived from the Earth `hex` codes in the database.
