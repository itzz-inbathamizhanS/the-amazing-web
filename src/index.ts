import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import charactersRouter from './routes/characters';
import earthsRouter from './routes/earths';
import eventsRouter from './routes/events';
import moviesRouter from './routes/movies';
import actorsRouter from './routes/actors';
import attachmentsRouter from './routes/attachments';
import { authMiddleware } from './middleware/auth';
import { validateInput } from './middleware/validate';

dotenv.config();

// Validate required env vars
const requiredEnvVars = ['DATABASE_URL', 'API_SECRET_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required env var: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// --- CORS ---
// In production, restrict to the actual frontend origin.
// Locally, allow all origins for development convenience.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : undefined; // undefined = allow all (dev mode)

app.use(cors({
  origin: allowedOrigins || true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
}));

app.use(express.json({ limit: '1mb' }));

// Supabase setup (optional — only needed for uploads)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// --- Upload config ---
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`));
    }
  },
});

// Auth middleware — protects POST/PUT/DELETE on all /api routes
app.use('/api', authMiddleware);

// Routes with input validation
app.use('/api/characters', validateInput('characters'), charactersRouter);
app.use('/api/earths', validateInput('earths'), earthsRouter);
app.use('/api/events', validateInput('events'), eventsRouter);
app.use('/api/movies', validateInput('movies'), moviesRouter);
app.use('/api/actors', validateInput('actors'), actorsRouter);
app.use('/api/attachments', attachmentsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Spider-Verse API is running' });
});

// --- File upload endpoint to Supabase ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'File storage is not configured' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Generate a safe filename (no user-controlled path components)
  const ext = path.extname(req.file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}${safeExt}`;

  try {
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    res.json({ url: publicUrlData.publicUrl });
  } catch (err: unknown) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Multer error handler (e.g., file too large)
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message && err.message.startsWith('Invalid file type')) {
    return res.status(415).json({ error: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`🕷️  The Amazing Web API running at http://localhost:${PORT}`);
});
