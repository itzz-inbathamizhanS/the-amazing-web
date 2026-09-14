import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const actors = await prisma.actor.findMany();
    res.json(actors);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch actor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const actor = await prisma.actor.create({ data: req.body });
    res.status(201).json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create actor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actor = await prisma.actor.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(actor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update actor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.actor.delete({ where: { id: req.params.id } });
    res.json({ message: 'Actor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete actor' });
  }
});

export default router;
