import { PrismaClient } from '@prisma/client';

// Singleton PrismaClient to prevent connection exhaustion.
// All route files should import from here instead of creating their own.
const prisma = new PrismaClient();

export default prisma;
