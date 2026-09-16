import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const ALLOWED_FIELDS = ['id', 'name', 'role'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

router.get('/', async (_req, res) => {
  try {
    const actors = await prisma.actor.findMany();
    res.json(actors);
  } catch (error) {
    console.error('Failed to fetch actors:', error);
    res.status(500).json({ error: 'Failed to fetch actors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const actor = await prisma.actor.findUnique({
      where: { id: req.params.id },
      include: { movies: { include: { movie: true } } }
    });
    if (!actor) return res.status(404).json({ error: 'Actor not found' });
    res.json(actor);
  } catch (error) {
    console.error('Failed to fetch actor:', error);
    res.status(500).json({ error: 'Failed to fetch actor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const actor = await prisma.actor.create({ data: pickFields(req.body) as any });
    res.status(201).json(actor);
  } catch (error) {
    console.error('Failed to create actor:', error);
    res.status(500).json({ error: 'Failed to create actor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = pickFields(req.body);
    delete (data as any).id;
    const actor = await prisma.actor.update({
      where: { id: req.params.id },
      data: data as any,
    });
    res.json(actor);
  } catch (error) {
    console.error('Failed to update actor:', error);
    res.status(500).json({ error: 'Failed to update actor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.actor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    console.error('Failed to delete actor:', error);
    res.status(500).json({ error: 'Failed to delete actor' });
  }
});

export default router;
