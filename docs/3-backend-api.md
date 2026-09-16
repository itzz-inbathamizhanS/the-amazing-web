# 3. Backend, Database & API

## Database Schema (Prisma/PostgreSQL)
The PostgreSQL database consists of four primary relational models:
- **Earth**: Represents a universe (e.g., Earth-616). Contains a `hex` color code used for rendering branches in the 3D graph.
- **Character**: Represents a Spider-variant, ally, or villain. Links to an Earth.
- **TimelineEvent**: Represents a comic run, movie, or crossover event. Includes an array of participating Character IDs.
- **Movie**: Tracks live-action films and theatrical release dates.

## API Endpoints Reference
The backend exposes a RESTful JSON API.

**Public Endpoints (Read-Only)**
- `GET /api/characters` - List all characters
- `GET /api/characters/:id` - Get specific character details
- `GET /api/earths` - List all Earths
- `GET /api/events` - List all timeline events
- `GET /api/movies` - List all movies

**Protected Endpoints (Requires `x-api-key`)**
- `POST /api/characters` - Create a character
- `PUT /api/characters/:id` - Update a character
- `DELETE /api/characters/:id` - Delete a character
- `POST /api/upload` - Upload an image file (multipart/form-data)

## Deployment Constraints
Because Render operates in an IPv4 environment, it cannot connect directly to Supabase's IPv6 direct connection string. The `DATABASE_URL` environment variable MUST use the Supabase Transaction Pooler URL (port `6543` with `?pgbouncer=true`).
