# API Endpoints Reference

## GET Endpoints (Public)
- `GET /api/characters`: Returns all characters.
- `GET /api/characters/:id`: Returns a specific character.
- `GET /api/earths`: Returns all Earths.
- `GET /api/events`: Returns all timeline events.
- `GET /api/movies`: Returns all movies.

## POST Endpoints (Protected)
- `POST /api/characters`: Create a character. Requires `x-api-key`.
- `POST /api/earths`: Create an Earth. Requires `x-api-key`.
- `POST /api/upload`: Upload an image file (multipart/form-data). Requires `x-api-key`.

## PUT/DELETE Endpoints (Protected)
- `PUT /api/characters/:id`: Update a character. Requires `x-api-key`.
- `DELETE /api/characters/:id`: Delete a character. Requires `x-api-key`.