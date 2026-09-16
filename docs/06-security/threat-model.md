# Threat Model

| Asset | Threat | Attack Vector | Impact | Existing Mitigation | Residual Risk |
|------|--------|---------------|--------|--------------------|---------------|
| Database Records | Unauthorized Modification | Direct API calls to mutation endpoints | High | `x-api-key` validation via `authMiddleware` | Low (Requires key compromise) |
| Supabase Storage | Unrestricted Uploads | Flooding the `/api/upload` endpoint | Medium | Endpoint is protected by `authMiddleware` | Low |
| .env Secrets | Credential Leakage | Committing `.env` to version control | Critical | Ignored via `.gitignore` | None |
| API Availability | DDoS Attacks | Spamming GET requests | Medium | None currently | Medium |