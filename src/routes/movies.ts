import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      include: { characters: true, actors: true }
    });
    res.json(movies);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

router.post('/', async (req, res) => {
  try {
    const movie = await prisma.movie.create({ data: req.body });
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create movie' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const movie = await prisma.movie.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.movie.delete({ where: { id: req.params.id } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

export default router;
