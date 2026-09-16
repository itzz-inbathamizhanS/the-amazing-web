const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

// Function to delete directory recursively
function deleteDir(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// 1. Delete all existing docs
deleteDir(docsDir);
fs.mkdirSync(docsDir);

// 2. Define the 5 comprehensive docs
const files = {
  '1-overview.md': `# 1. Project Overview\n
## What is The Amazing Web?
The Amazing Web is an interactive 3D timeline and directory mapping the entire Spider-Verse. It tracks the various continuities, alternate Earths, crossover events, characters, and live-action movies across the Marvel Multiverse.

## Core Objectives
1. **Data Visualization**: Provide a visually stunning, performant 3D timeline of the Spider-Verse capable of rendering hundreds of nodes simultaneously without frame drops.
2. **Comprehensive Database**: Offer a robust relational directory of Spider-variants, Earths, and Events.
3. **Content Management**: Allow secure, authenticated administration of data through an integrated editing interface (no external CMS required).
4. **Seamless Deployment**: Maintain a decoupled architecture allowing independent scaling of the static frontend and the API backend.

## User Guide
- **Exploring the 3D Timeline**: Click and drag to rotate the 3D space. Scroll the mouse wheel to zoom in and out. Hover over any glowing node to see details about the character or event. Click a node to open its full profile.
- **Using the Directory**: Click the **Directory** button in the top navigation. Use the filter chips at the top to filter characters by **Earth**, **Medium**, or **Tags**. Use the search bar to find characters by name or alias.
- **Admin Controls**: If you have the Admin API key configured, edit buttons will appear on all character and event cards, and a floating "Add Character" button will be visible in the Directory.
`,

  '2-architecture.md': `# 2. Architecture & Data Flow\n
## System Architecture
The Amazing Web utilizes a decoupled, modern full-stack architecture to maximize edge caching for the frontend while maintaining a persistent connection pool for the backend.

- **Frontend (Vercel)**: React 18, Vite, TanStack Router, \`react-force-graph-3d\`, Tailwind CSS.
- **Backend (Render)**: Node.js, Express.js, Prisma ORM, Multer.
- **Database (Supabase)**: PostgreSQL with PgBouncer connection pooling on port 6543, plus Supabase Object Storage.

\`\`\`mermaid
flowchart TD
    Client[Web Browser] -->|HTTP Requests| Vercel[Vercel - Static Frontend]
    Client -->|API Requests| Render[Render - Express Backend]
    Render -->|Prisma TCP 6543| SupabaseDB[(Supabase PostgreSQL)]
    Render -->|HTTPS API| SupabaseStorage[Supabase Object Storage]
\`\`\`

## Image Upload Data Flow
When an administrator uploads a new image for a character or event, the flow occurs entirely in-memory:

\`\`\`mermaid
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
\`\`\`
`,

  '3-backend-api.md': `# 3. Backend, Database & API\n
## Database Schema (Prisma/PostgreSQL)
The PostgreSQL database consists of four primary relational models:
- **Earth**: Represents a universe (e.g., Earth-616). Contains a \`hex\` color code used for rendering branches in the 3D graph.
- **Character**: Represents a Spider-variant, ally, or villain. Links to an Earth.
- **TimelineEvent**: Represents a comic run, movie, or crossover event. Includes an array of participating Character IDs.
- **Movie**: Tracks live-action films and theatrical release dates.

## API Endpoints Reference
The backend exposes a RESTful JSON API.

**Public Endpoints (Read-Only)**
- \`GET /api/characters\` - List all characters
- \`GET /api/characters/:id\` - Get specific character details
- \`GET /api/earths\` - List all Earths
- \`GET /api/events\` - List all timeline events
- \`GET /api/movies\` - List all movies

**Protected Endpoints (Requires \`x-api-key\`)**
- \`POST /api/characters\` - Create a character
- \`PUT /api/characters/:id\` - Update a character
- \`DELETE /api/characters/:id\` - Delete a character
- \`POST /api/upload\` - Upload an image file (multipart/form-data)

## Deployment Constraints
Because Render operates in an IPv4 environment, it cannot connect directly to Supabase's IPv6 direct connection string. The \`DATABASE_URL\` environment variable MUST use the Supabase Transaction Pooler URL (port \`6543\` with \`?pgbouncer=true\`).
`,

  '4-frontend-ui.md': `# 4. Frontend & User Interface\n
## Framework & Routing
The frontend is built using **Vite** and **React 18**. **TanStack Router** is used for type-safe, file-based routing. Routes are defined in \`Frontend/src/routes/\` and generated automatically. State management and data fetching are handled by **TanStack Query** (React Query).

## 3D Rendering Engine
The \`react-force-graph-3d\` library handles the core 3D visualization.
- **Mobile Optimizations**: The graph limits device pixel ratio (\`dpr\`) to a maximum of 2 to prevent WebGL crashes on mobile devices.
- **Dynamic Viewport Heights**: The sticky hero container uses \`h-[100dvh]\` to ensure the canvas does not jitter when mobile browser address bars expand/collapse.

## Styling & Theme
**Tailwind CSS** handles all styling, utilizing a custom design system defined in \`tailwind.config.ts\`. The application uses a strictly dark-mode theme (referred to as the "Void" theme), employing deep blacks, muted grays, and vivid neon accent colors derived from the Earth \`hex\` codes in the database.
`,

  '5-security-operations.md': `# 5. Security & Operations\n
## Security Model
The application employs a flat, role-based security model distinguishing between Anonymous (Read-Only) and Admin (Read-Write) users.

1. The Admin inputs the secret key into the Frontend UI, which is stored in \`localStorage\` as \`spider-admin-key\`.
2. The Frontend appends this key to the \`x-api-key\` header on all mutation requests.
3. The Backend \`authMiddleware\` intercepts the request. If \`req.headers['x-api-key'] === process.env.API_SECRET_KEY\`, the request proceeds.

## Threat Model & Risks
| Asset | Threat | Attack Vector | Existing Mitigation | Residual Risk |
|------|--------|---------------|--------------------|---------------|
| Database Records | Unauthorized Modification | Direct API calls | \`x-api-key\` validation | Low (Key compromise) |
| Supabase Storage | Unrestricted Uploads | Flooding \`/api/upload\` | \`x-api-key\` validation | Low |
| .env Secrets | Credential Leakage | Committing \`.env\` to Git | Ignored via \`.gitignore\` | None |
| API Availability | DDoS Attacks | Spamming GET requests | None currently | Medium |

## Operational Scripts
The \`scripts/\` directory contains numerous utility files for maintenance:
- **Seed Scripts**: Used to populate the database with initial JSON payloads.
- **Scraping Scripts**: Used to fetch data from the Marvel Fandom Wiki.
- **Cleanup Scripts**: Utilities for finding and removing duplicate records in the database.
`
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(docsDir, file), content);
});

console.log('Successfully consolidated into 5 major documentation files.');
