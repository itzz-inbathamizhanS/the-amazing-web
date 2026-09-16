const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const files = {
  'README.md': `# The Amazing Web Docs\n\nWelcome to the documentation for The Amazing Web project. Please navigate the folders for detailed information.`,
  
  '01-overview/project-overview.md': `# Project Overview\n\nThe Amazing Web is an interactive 3D timeline and directory mapping the entire Spider-Verse. It tracks the various continuities, alternate Earths, crossover events, characters, and live-action movies across the Marvel Multiverse.`,
  '01-overview/problem-statement.md': `# Problem Statement\n\nNavigating the complex, branching continuity of the Spider-Verse across comics, animated films, and live-action media is difficult for fans. There is no unified, visual database to explore these connections.`,
  '01-overview/objectives.md': `# Objectives\n\n- Provide a visually stunning 3D timeline of the Spider-Verse.\n- Offer a comprehensive directory of Spider-variants.\n- Allow secure, authenticated administration of data.`,
  
  '02-architecture/system-architecture.md': `# System Architecture\n\n- **Frontend:** Vercel (React, Vite, TanStack Router)\n- **Backend:** Render (Express, Node.js)\n- **Database:** Supabase (PostgreSQL)\n\n\`\`\`mermaid\nflowchart TD\n    Client[Web Browser] -->|HTTP Requests| Vercel[Vercel - Static Frontend]\n    Client -->|API Requests| Render[Render - Express Backend]\n    Render -->|Prisma TCP 6543| SupabaseDB[(Supabase PostgreSQL)]\n    Render -->|HTTPS API| SupabaseStorage[Supabase Object Storage]\n\`\`\``,
  '02-architecture/data-flow.md': `# Data Flow\n\n\`\`\`mermaid\nsequenceDiagram\n    participant Admin\n    participant Frontend\n    participant Backend\n    participant Supabase\n    \n    Admin->>Frontend: Upload image via ContentEditor\n    Frontend->>Backend: POST /api/upload + x-api-key\n    Backend->>Backend: Authenticate API Key\n    Backend->>Supabase: Upload buffer to 'images'\n    Supabase-->>Backend: Return public URL\n    Backend-->>Frontend: { url: "https://..." }\n    Frontend-->>Admin: Display preview\n\`\`\``,
  
  '03-installation/prerequisites.md': `# Prerequisites\n\n- Node.js (v18+)\n- PostgreSQL database (Supabase recommended)\n- Git`,
  '03-installation/installation.md': `# Installation\n\n\`\`\`bash\ngit clone https://github.com/thamizhans/theamazingweb.git\ncd theamazingweb\nnpm install\ncd Frontend && npm install\n\`\`\``,
  
  '04-usage/user-guide.md': `# User Guide\n\n1. Navigate to the homepage to interact with the 3D Multiverse graph.\n2. Scroll to zoom in and out of the timeline.\n3. Click "Directory" to browse the complete list of characters, filterable by Earth and Medium.`,
  
  '05-technical/frontend.md': `# Frontend\n\nThe frontend is a Single Page Application (SPA) built with:\n- React\n- Vite\n- TanStack Router\n- Tailwind CSS\n- react-force-graph-3d`,
  '05-technical/backend.md': `# Backend\n\nThe backend is a Node.js Express API that handles:\n- CRUD operations for Prisma models.\n- Direct proxy uploads to Supabase Storage via Multer.\n- Authentication middleware.`,
  '05-technical/database.md': `# Database\n\nThe database is a PostgreSQL instance hosted on Supabase, managed via Prisma ORM.\nKey tables: Characters, Earths, Events, Movies.`,
  
  '06-security/security-model.md': `# Security Model\n\n- The application uses a static API key for Admin access.\n- Read operations are unauthenticated.\n- Write operations require the \`x-api-key\` header to match the server's \`API_SECRET_KEY\`.`,
  '06-security/threat-model.md': `# Threat Model\n\n| Asset | Threat | Attack Vector | Impact | Existing Mitigation | Residual Risk |\n|------|--------|---------------|--------|--------------------|---------------|\n| Database Records | Unauthorized Modification | Direct API calls | High | \`x-api-key\` validation | Low (Key compromise) |\n| Supabase Storage | Unrestricted Uploads | Flooding endpoint | Medium | \`x-api-key\` validation | Low |`,
  
  '08-api-reference/endpoints.md': `# API Endpoints\n\n- \`GET /api/characters\` - List characters\n- \`GET /api/earths\` - List Earths\n- \`GET /api/events\` - List timeline events\n- \`POST /api/upload\` - Upload an image\n- \`POST /api/auth/verify\` - Verify admin key`,
  '08-api-reference/authentication.md': `# API Authentication\n\nPass the API key in the headers:\n\`\`\`json\n{\n  "x-api-key": "your-secret-key"\n}\n\`\`\``,
  
  '09-deployment/deployment.md': `# Deployment\n\nThe frontend is automatically deployed to Vercel upon pushing to the \`main\` branch. The backend is deployed to Render.`,
  '09-deployment/production.md': `# Production Configuration\n\nEnsure \`DATABASE_URL\` uses the Transaction Pooler URL (port 6543) when deploying the backend to Render.`,
  
  '11-reference/changelog.md': `# Changelog\n\n## v1.0.0\n- Initial release of The Amazing Web.\n- 3D Timeline implementation.\n- Directory view with filtering.`,
  '11-reference/known-issues.md': `# Known Issues\n\n- **No Automated Tests:** The test suite is currently empty and relies on manual validation.\n- **Static API Key:** Uses a single master key instead of per-user JWTs.`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(docsDir, filePath);
  const dirName = path.dirname(fullPath);
  
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content);
});

console.log('Documentation framework generated successfully!');
