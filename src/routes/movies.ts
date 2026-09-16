import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const ALLOWED_FIELDS = ['id', 'title', 'year', 'type', 'continuity', 'watchOrderRank'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

router.get('/', async (_req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: { characters: true, actors: true }
    });
    res.json(movies);
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: req.params.id },
      include: { characters: { include: { character: true } }, actors: { include: { actor: true } } }
    });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    console.error('Failed to fetch movie:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = await prisma.movie.create({ data: pickFields(req.body) as any });
    res.status(201).json(movie);
  } catch (error) {
    console.error('Failed to create movie:', error);
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = pickFields(req.body);
    delete (data as any).id;
    const movie = await prisma.movie.update({
      where: { id: req.params.id },
      data: data as any,
    });
    res.json(movie);
  } catch (error) {
    console.error('Failed to update movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.movie.delete({ where: { id: req.params.id } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Failed to delete movie:', error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

export default router;
