import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual, createHash } from 'crypto';

/**
 * Middleware that protects mutation endpoints (POST, PUT, DELETE).
 * Requires a valid API key in the x-api-key header.
 * GET requests are always allowed (public read access).
 *
 * SECURITY: Fails CLOSED — if API_SECRET_KEY is not configured,
 * all mutation requests are denied.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // Allow all GET/HEAD/OPTIONS requests (public reads)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] as string;
  const expectedKey = process.env['API_SECRET_KEY'];

  // FAIL CLOSED: If no API_SECRET_KEY is configured, deny all mutations
  if (!expectedKey) {
    console.error('AUTH: API_SECRET_KEY is not configured — denying mutation request');
    return res.status(503).json({ error: 'Server is not configured for write operations' });
  }

  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: missing API key' });
  }

  // Use timing-safe comparison to prevent timing attacks
  const a = createHash('sha256').update(apiKey).digest();
  const b = createHash('sha256').update(expectedKey).digest();
  if (!timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }

  next();
}
