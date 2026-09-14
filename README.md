# The Amazing Web
**Every Spider. Every Universe. Every Story.**

The Amazing Web is an interactive, cinematic 3D timeline and directory mapping the entire Spider-Verse. It tracks the various continuities, alternate Earths, crossover events, characters, and live-action movies across the Marvel Multiverse.

## Features
- **3D Multiverse Timeline:** Explore a glowing, interactive branching timeline of every Spider-Man continuity, built with Three.js.
- **Character Directory:** A comprehensive, filterable database of Spider-people, villains, and allies across the multiverse.
- **Live-Action Continuity:** Detailed integration of the Sam Raimi, Marc Webb, and MCU timelines, all intersecting at the events of *No Way Home*.
- **Admin Dashboard:** Real-time data editing, protected by a secure API key, instantly syncing to the cloud database.

## Tech Stack
- **Frontend:** React, TanStack Router (SSR via Nitro), Tailwind CSS, Three.js (`react-force-graph-3d`)
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (Supabase) + Supabase Storage for character imagery

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itzz-inbathamizhanS/the-amazing-web.git
   cd the-amazing-web
   ```

2. **Install dependencies:**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of the project with your Supabase credentials:
   ```env
   DATABASE_URL="postgres://[db-user]:[db-password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   SUPABASE_URL="https://[your-supabase-url].supabase.co"
   SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"
   API_SECRET_KEY="[your-admin-password]"
   ```

4. **Start the Development Servers:**
   The project has both a backend API and a frontend server.
   
   Start the backend (Port 3001):
   ```bash
   npm start
   ```
   
   Start the frontend (Port 8080):
   ```bash
   cd Frontend
   npm run dev
   ```

## Disclaimer
"Spider-Man" and all related characters and elements are trademarks of and © Marvel Characters, Inc. and Sony Pictures Entertainment. This is a non-commercial, educational fan project and is not affiliated with Marvel or Sony. Official imagery is sourced under fair use / wiki APIs.
