# Changelog

## v1.0.1 (Current)
- Fixed mobile viewport issues (`100dvh`) for sticky hero canvases on iOS Safari.
- Fixed hardcoded `localhost:3001` API fetches that caused 404 errors in production.
- Migrated database schema to PostgreSQL (Supabase).
- Decoupled frontend (Vercel) and backend (Render) architectures.

## v1.0.0
- Initial Proof of Concept.
- SQLite local database.
- 3D Multiverse stage built using `react-force-graph-3d`.
- Basic CRUD via Admin panel.