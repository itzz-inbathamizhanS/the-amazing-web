import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// Get all characters
router.get('/', async (req, res) => {
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
  } catch (e: any) {
    console.error('Error fetching characters:', e);
    res.status(500).json({ error: 'Failed to fetch characters', details: e.message });
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
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// Create a character
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const character = await prisma.character.create({
      data,
    });
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Update a character
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    const character = await prisma.character.update({
      where: { id: req.params.id },
      data,
    });
    res.json(character);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;
