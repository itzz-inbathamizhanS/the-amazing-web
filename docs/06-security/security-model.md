# Security Model

- The application uses a static API key for Admin access.
- Read operations are unauthenticated.
- Write operations require the `x-api-key` header to match the server's `API_SECRET_KEY`.