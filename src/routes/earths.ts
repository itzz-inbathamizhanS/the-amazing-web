import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const earths = await prisma.earth.findMany();
    res.json(earths);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earths' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const earth = await prisma.earth.findUnique({
      where: { id: req.params.id },
      include: { characters: true }
    });
    if (!earth) return res.status(404).json({ error: 'Earth not found' });
    res.json(earth);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch earth' });
  }
});

router.post('/', async (req, res) => {
  try {
    const earth = await prisma.earth.create({ data: req.body });
    res.status(201).json(earth);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create earth' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const earth = await prisma.earth.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(earth);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update earth' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.earth.delete({ where: { id: req.params.id } });
    res.json({ message: 'Earth deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete earth' });
  }
});

export default router;
