# 5. Security & Operations

## Security Model
The application employs a flat, role-based security model distinguishing between Anonymous (Read-Only) and Admin (Read-Write) users.

1. The Admin inputs the secret key into the Frontend UI, which is stored in `localStorage` as `spider-admin-key`.
2. The Frontend appends this key to the `x-api-key` header on all mutation requests.
3. The Backend `authMiddleware` intercepts the request. If `req.headers['x-api-key'] === process.env.API_SECRET_KEY`, the request proceeds.

## Threat Model & Risks
| Asset | Threat | Attack Vector | Existing Mitigation | Residual Risk |
|------|--------|---------------|--------------------|---------------|
| Database Records | Unauthorized Modification | Direct API calls | `x-api-key` validation | Low (Key compromise) |
| Supabase Storage | Unrestricted Uploads | Flooding `/api/upload` | `x-api-key` validation | Low |
| .env Secrets | Credential Leakage | Committing `.env` to Git | Ignored via `.gitignore` | None |
| API Availability | DDoS Attacks | Spamming GET requests | None currently | Medium |

## Operational Scripts
The `scripts/` directory contains numerous utility files for maintenance:
- **Seed Scripts**: Used to populate the database with initial JSON payloads.
- **Scraping Scripts**: Used to fetch data from the Marvel Fandom Wiki.
- **Cleanup Scripts**: Utilities for finding and removing duplicate records in the database.
