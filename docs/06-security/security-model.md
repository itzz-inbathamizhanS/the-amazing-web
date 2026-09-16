# Security Model

The application employs a flat, role-based security model. Users are classified as either Anonymous (Read-Only) or Admin (Read-Write).

## Authentication Flow
1. The admin user inputs the secret key into the Frontend UI (Command Palette or Admin Gate).
2. The key is stored in the browser's `localStorage` as `spider-admin-key`.
3. The Frontend appends this key to the `x-api-key` header on all POST, PUT, and DELETE requests.
4. The Backend `authMiddleware` intercepts the request.
5. If `req.headers['x-api-key'] === process.env.API_SECRET_KEY`, the request proceeds.
6. Otherwise, a `401 Unauthorized` response is returned.