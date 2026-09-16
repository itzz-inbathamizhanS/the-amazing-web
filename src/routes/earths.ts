import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const ALLOWED_FIELDS = ['id', 'designation', 'description', 'primaryCharacterId', 'hex', 'colorVar'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

router.get('/', async (_req, res) => {
  try {
    const earths = await prisma.earth.findMany();
    res.json(earths);
  } catch (error) {
    console.error('Failed to fetch earths:', error);
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
    console.error('Failed to fetch earth:', error);
    res.status(500).json({ error: 'Failed to fetch earth' });
  }
});

router.post('/', async (req, res) => {
  try {
    const earth = await prisma.earth.create({ data: pickFields(req.body) as any });
    res.status(201).json(earth);
  } catch (error) {
    console.error('Failed to create earth:', error);
    res.status(500).json({ error: 'Failed to create earth' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = pickFields(req.body);
    delete (data as any).id;
    const earth = await prisma.earth.update({
      where: { id: req.params.id },
      data: data as any,
    });
    res.json(earth);
  } catch (error) {
    console.error('Failed to update earth:', error);
    res.status(500).json({ error: 'Failed to update earth' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.earth.delete({ where: { id: req.params.id } });
    res.json({ message: 'Earth deleted successfully' });
  } catch (error) {
    console.error('Failed to delete earth:', error);
    res.status(500).json({ error: 'Failed to delete earth' });
  }
});

export default router;
