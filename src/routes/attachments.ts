import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

const ALLOWED_FIELDS = ['title', 'ownedFormat', 'personalNotes', 'linkedCharacterId', 'linkedEventId', 'filePath'] as const;

function pickFields(body: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) result[key] = body[key];
  }
  return result;
}

router.get('/', async (_req, res) => {
  try {
    const attachments = await prisma.comicAttachment.findMany({
      include: { character: true, event: true }
    });
    res.json(attachments);
  } catch (error) {
    console.error('Failed to fetch attachments:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = pickFields(req.body);
    const attachment = await prisma.comicAttachment.create({
      data: data as any
    });
    res.status(201).json(attachment);
  } catch (error) {
    console.error('Failed to create attachment:', error);
    res.status(500).json({ error: 'Failed to create attachment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.comicAttachment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Failed to delete attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

export default router;
