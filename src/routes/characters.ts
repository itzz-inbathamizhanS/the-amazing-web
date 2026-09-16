import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Allowed fields for Character create/update — prevents arbitrary field injection
const ALLOWED_FIELDS = ['id', 'name', 'alias', 'earthId', 'realName', 'firstAppearance', 'description', 'powers', 'imageUrl', 'tags', 'media'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

// Get all characters
router.get('/', async (_req, res) => {
  try {
    const characters = await prisma.character.findMany({
      include: {
        earth: true,
        timelineEvents: true,
        movies: true,
        relatedCharacters: true,
      },
    });
    res.json(characters);
  } catch (error) {
    console.error('Failed to fetch characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Get a single character by id
router.get('/:id', async (req, res) => {
  try {
    const character = await prisma.character.findUnique({
      where: { id: req.params.id },
      include: {
        earth: true,
        timelineEvents: { include: { event: true } },
        movies: { include: { movie: true } },
        attachments: true,
        relatedCharacters: true,
      },
    });
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
  } catch (error) {
    console.error('Failed to fetch character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Create a character
router.post('/', async (req, res) => {
  try {
    const data = pickFields(req.body);
    const character = await prisma.character.create({ data: data as any });
    res.status(201).json(character);
  } catch (error) {
    console.error('Failed to create character:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Update a character
router.put('/:id', async (req, res) => {
  try {
    const data = pickFields(req.body);
    delete (data as any).id; // never allow ID mutation
    const character = await prisma.character.update({
      where: { id: req.params.id },
      data: data as any,
    });
    res.json(character);
  } catch (error) {
    console.error('Failed to update character:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// Delete a character
router.delete('/:id', async (req, res) => {
  try {
    await prisma.character.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Failed to delete character:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;

