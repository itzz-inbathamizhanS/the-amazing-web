import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const ALLOWED_FIELDS = ['id', 'title', 'year', 'dateRange', 'summary', 'branch', 'crossover', 'issues'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

router.get('/', async (_req, res) => {
  try {
    const events = await prisma.timelineEvent.findMany({
      include: { characters: { include: { character: true } } }
    });
    res.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.timelineEvent.findUnique({
      where: { id: req.params.id },
      include: { characters: { include: { character: true } }, attachments: true }
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error('Failed to fetch event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

router.post('/', async (req, res) => {
  try {
    const event = await prisma.timelineEvent.create({ data: pickFields(req.body) as any });
    res.status(201).json(event);
  } catch (error) {
    console.error('Failed to create event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = pickFields(req.body);
    delete (data as any).id;
    const event = await prisma.timelineEvent.update({
      where: { id: req.params.id },
      data: data as any,
    });
    res.json(event);
  } catch (error) {
    console.error('Failed to update event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.timelineEvent.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Failed to delete event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
