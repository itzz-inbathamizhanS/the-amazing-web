# Deployment Architecture

The Amazing Web uses a decoupled deployment strategy to maximize edge caching for the frontend while maintaining a persistent connection pool for the backend.

## Frontend (Vercel)
- Deployed automatically via GitHub integration.
- Root Directory: `Frontend`
- Build Command: `npm run build`
- Install Command: `npm install`
- Env Var: `VITE_API_URL = https://the-amazing-web-api.onrender.com/api`

## Backend (Render)
- Deployed via Web Service.
- Root Directory: `.` (Repository Root)
- Build Command: `npm install`
- Start Command: `npm start`
- Contains a `postinstall` script (`npx prisma generate`) to ensure the Prisma client is built during the deployment phase.