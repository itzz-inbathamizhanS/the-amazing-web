import { Router } from 'express';
import prisma from '../lib/prisma';
import multer from 'multer';
import path from 'path';

const router = Router();

// Use the same uploads config as index.ts
const uploadsDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const attachments = await prisma.comicAttachment.findMany({
      include: { character: true, event: true }
    });
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, ownedFormat, personalNotes, linkedCharacterId, linkedEventId } = req.body;
    let filePath = null;
    
    if (req.file) {
      filePath = '/uploads/' + req.file.filename;
    }

    const attachment = await prisma.comicAttachment.create({
      data: {
        title,
        ownedFormat,
        personalNotes,
        linkedCharacterId,
        linkedEventId,
        filePath
      }
    });
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attachment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.comicAttachment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

export default router;
