# Threat Model

| Asset | Threat | Attack Vector | Impact | Existing Mitigation | Residual Risk |
|------|--------|---------------|--------|--------------------|---------------|
| Database Records | Unauthorized Modification | Direct API calls | High | `x-api-key` validation | Low (Key compromise) |
| Supabase Storage | Unrestricted Uploads | Flooding endpoint | Medium | `x-api-key` validation | Low |