# Authentication Implementation

All protected endpoints must include the `x-api-key` header.

### Example Request (cURL)
```bash
curl -X POST http://localhost:3001/api/characters \
  -H "Content-Type: application/json" \
  -H "x-api-key: spider-admin-123" \
  -d '{"id": "new-spidey", "alias": "Spider-Man"}'
```

### Backend Middleware Source
```typescript
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_SECRET_KEY;

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
  }

  next();
};
```