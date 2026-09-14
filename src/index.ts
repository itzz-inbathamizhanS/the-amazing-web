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
const requiredEnvVars = ['DATABASE_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required env var: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Use memory storage for multer instead of writing to disk
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Legacy static route for any files still needed
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Spider-Verse API is running' });
});

// Generic file upload endpoint to Supabase
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const fileExt = path.extname(req.file.originalname);
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000000)}${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    res.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload to Supabase' });
  }
});

app.listen(PORT, () => {
  console.log(`🕷️  The Amazing Web API running at http://localhost:${PORT}`);
});
