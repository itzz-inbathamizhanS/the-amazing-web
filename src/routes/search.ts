import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/search?q=miles&type=characters,earths,movies,actors,events
 * Server-side search across all entities.
 * Returns grouped, limited results.
 */
router.get('/', async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();
    if (!q) {
      return res.json({ characters: [], earths: [], movies: [], actors: [], events: [] });
    }

    const typeParam = (req.query.type as string || 'characters,earths,movies,actors,events');
    const types = new Set(typeParam.split(',').map(t => t.trim()));
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    const results: Record<string, unknown[]> = {};

    if (types.has('characters')) {
      results.characters = await prisma.character.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { alias: { contains: q, mode: 'insensitive' } },
            { realName: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          alias: true,
          earthId: true,
          imageUrl: true,
          media: true,
        },
        take: limit,
      });
    }

    if (types.has('earths')) {
      results.earths = await prisma.earth.findMany({
        where: {
          OR: [
            { id: { contains: q, mode: 'insensitive' } },
            { designation: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          designation: true,
          description: true,
          hex: true,
        },
        take: limit,
      });
    }

    if (types.has('movies')) {
      results.movies = await prisma.movie.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { continuity: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          year: true,
          type: true,
        },
        take: limit,
      });
    }

    if (types.has('actors')) {
      results.actors = await prisma.actor.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { role: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
        take: limit,
      });
    }

    if (types.has('events')) {
      results.events = await prisma.timelineEvent.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          year: true,
          branch: true,
        },
        take: limit,
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * GET /api/random?type=characters&count=6
 * Returns random entities for discovery features.
 */
router.get('/random', async (req, res) => {
  try {
    const type = (req.query.type as string) || 'characters';
    const count = Math.min(Number(req.query.count) || 6, 20);

    let items: unknown[] = [];

    if (type === 'characters') {
      const all = await prisma.character.findMany({
        select: { id: true, name: true, alias: true, earthId: true, imageUrl: true, media: true },
      });
      items = shuffleAndTake(all, count);
    } else if (type === 'earths') {
      const all = await prisma.earth.findMany({
        select: { id: true, designation: true, hex: true, description: true },
      });
      items = shuffleAndTake(all, count);
    } else if (type === 'movies') {
      const all = await prisma.movie.findMany({
        select: { id: true, title: true, year: true, type: true },
      });
      items = shuffleAndTake(all, count);
    } else if (type === 'actors') {
      const all = await prisma.actor.findMany({
        select: { id: true, name: true, role: true },
      });
      items = shuffleAndTake(all, count);
    } else if (type === 'events') {
      const all = await prisma.timelineEvent.findMany({
        select: { id: true, title: true, year: true, branch: true },
      });
      items = shuffleAndTake(all, count);
    }

    res.json(items);
  } catch (error) {
    console.error('Random fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch random items' });
  }
});

function shuffleAndTake<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

export default router;
