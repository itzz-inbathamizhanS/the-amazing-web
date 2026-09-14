import { Request, Response, NextFunction } from 'express';

/**
 * Input validation middleware.
 * Ensures required fields are present for each entity type.
 * Only runs on POST/PUT requests.
 */

type ValidationRule = {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
};

const schemas: Record<string, ValidationRule[]> = {
  characters: [
    { field: 'id', required: true, type: 'string' },
    { field: 'name', required: true, type: 'string' },
  ],
  earths: [
    { field: 'id', required: true, type: 'string' },
    { field: 'designation', required: true, type: 'string' },
  ],
  events: [
    { field: 'id', required: true, type: 'string' },
    { field: 'title', required: true, type: 'string' },
    { field: 'year', required: true, type: 'number' },
  ],
  movies: [
    { field: 'id', required: true, type: 'string' },
    { field: 'title', required: true, type: 'string' },
    { field: 'year', required: true, type: 'number' },
    { field: 'type', required: true, type: 'string' },
  ],
  actors: [
    { field: 'id', required: true, type: 'string' },
    { field: 'name', required: true, type: 'string' },
  ],
};

export function validateInput(entityType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only validate on POST (create)
    if (req.method !== 'POST') return next();

    const rules = schemas[entityType];
    if (!rules) return next();

    const errors: string[] = [];
    for (const rule of rules) {
      const value = req.body[rule.field];
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`"${rule.field}" is required`);
      } else if (value !== undefined && rule.type && typeof value !== rule.type) {
        errors.push(`"${rule.field}" must be a ${rule.type}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
  };
}
