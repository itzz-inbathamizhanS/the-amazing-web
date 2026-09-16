# Audit Changelog

All changes made during the 2026-09-16 security audit.

---

## Security

| File | Change | Reason | Risk | Verification |
|------|--------|--------|------|-------------|
| `src/middleware/auth.ts` | Fail-closed when `API_SECRET_KEY` missing | Previously allowed all mutations when env var absent | Critical fix, no regression | POST without key → 401 |
| `src/middleware/auth.ts` | `timingSafeEqual` for key comparison | Prevents timing-based key extraction | Low risk change | POST with wrong key → 401 |
| `src/index.ts` | Added `API_SECRET_KEY` to required env vars | Server should not start without auth configured | May break deploys missing the var — intentional | Server exits with clear error |
| `src/index.ts` | CORS origin restriction via `CORS_ORIGIN` env var | Open CORS allowed cross-origin attacks | No regression (defaults to allow-all for dev) | Health check from browser works |
| `src/index.ts` | Upload size limit: 5MB | Unlimited uploads could crash server (OOM) | No regression for normal images | Large file → 413 |
| `src/index.ts` | Upload MIME filter: images only | Arbitrary file upload (XSS, malware) | Blocks non-image uploads — intentional | Non-image → 415 |
| `src/index.ts` | Safe filename sanitization | User-controlled extensions could cause issues | No regression | Filenames are server-generated |
| `src/routes/characters.ts` | `pickFields()` whitelist | Raw `req.body` → Prisma allowed field injection | No regression — only schema fields accepted | Tested CRUD |
| `src/routes/earths.ts` | `pickFields()` whitelist | Same as above | Same | Tested |
| `src/routes/events.ts` | `pickFields()` whitelist | Same as above | Same | Tested |
| `src/routes/movies.ts` | `pickFields()` whitelist | Same as above | Same | Tested |
| `src/routes/actors.ts` | `pickFields()` whitelist | Same as above | Same | Tested |
| `src/routes/attachments.ts` | Removed disk-based multer upload | Disk storage doesn't work on Render; inconsistent with Supabase strategy | Attachments now metadata-only; files use `/api/upload` | Tested |
| `Frontend/src/lib/content-store.ts` | Added `x-api-key` header to all mutations | Mutations were rejected by backend (missing auth header) | No regression — key read from localStorage | Admin CRUD works |

## Infrastructure

| File | Change | Reason | Risk | Verification |
|------|--------|--------|------|-------------|
| `.env.example` | Created with all required variables | New developers had no reference for env setup | None | File exists |
| `.gitignore` | Added `prisma/dev.db`, `test_ps.jpg`, `uploads/` | Stale/generated files should not be committed | None | Git status clean |
| `.env` | Added `API_SECRET_KEY` | Required by hardened auth middleware | None (file is gitignored) | Backend starts |

## Documentation

| File | Change | Reason | Risk | Verification |
|------|--------|--------|------|-------------|
| `docs/FULL_AUDIT_REPORT.md` | Created | Documents all security findings and fixes | None | File exists |
| `docs/AUDIT_CHANGELOG.md` | Created | Lists every modification with rationale | None | File exists |
