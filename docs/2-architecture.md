# 2. Architecture & Data Flow

## System Architecture
The Amazing Web utilizes a decoupled, modern full-stack architecture to maximize edge caching for the frontend while maintaining a persistent connection pool for the backend.

- **Frontend (Vercel)**: React 18, Vite, TanStack Router, `react-force-graph-3d`, Tailwind CSS.
- **Backend (Render)**: Node.js, Express.js, Prisma ORM, Multer.
- **Database (Supabase)**: PostgreSQL with PgBouncer connection pooling on port 6543, plus Supabase Object Storage.

```mermaid
flowchart TD
    Client[Web Browser] -->|HTTP Requests| Vercel[Vercel - Static Frontend]
    Client -->|API Requests| Render[Render - Express Backend]
    Render -->|Prisma TCP 6543| SupabaseDB[(Supabase PostgreSQL)]
    Render -->|HTTPS API| SupabaseStorage[Supabase Object Storage]
```

## Image Upload Data Flow
When an administrator uploads a new image for a character or event, the flow occurs entirely in-memory:

```mermaid
sequenceDiagram
    participant Admin as Admin Client
    participant Backend as Express API
    participant Storage as Supabase Storage
    
    Admin->>Backend: POST /api/upload (multipart/form-data) [includes x-api-key]
    Backend->>Backend: Verify API Key
    Backend->>Backend: Multer parses file to memory buffer
    Backend->>Storage: upload(buffer, { contentType })
    Storage-->>Backend: Upload Success
    Backend->>Storage: getPublicUrl()
    Backend-->>Admin: 200 OK { url: "https://..." }
```
