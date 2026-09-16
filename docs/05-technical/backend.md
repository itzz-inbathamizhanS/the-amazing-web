# Backend Technical Details

## API Framework
The backend is a robust **Express.js** application written in TypeScript. It operates as a RESTful API serving JSON data to the frontend.

## Data Access Layer
**Prisma ORM** provides type-safe database queries. The schema is located in `prisma/schema.prisma`. Prisma handles connection pooling natively, but is configured to connect to Supabase's IPv4 PgBouncer port (6543) for serverless compatibility.

## File Processing
**Multer** is used as middleware for the `/api/upload` route. Instead of saving files to the local disk, Multer is configured with `multer.memoryStorage()`. The resulting buffer is passed directly to the Supabase Storage SDK, ensuring the server remains stateless.