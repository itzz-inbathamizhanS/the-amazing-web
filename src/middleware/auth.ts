import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that protects mutation endpoints (POST, PUT, DELETE).
 * Requires a valid API key in the x-api-key header.
 * GET requests are always allowed (public read access).
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow all GET/HEAD/OPTIONS requests (public reads)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] as string;
  const expectedKey = process.env['API_SECRET_KEY'];

  // If no API_SECRET_KEY is set in env, allow all (dev mode)
  if (!expectedKey) {
    return next();
  }

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing API key' });
  }

  next();
}
