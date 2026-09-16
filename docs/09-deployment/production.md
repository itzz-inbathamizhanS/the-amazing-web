# Production Database Configuration

When deploying to Render, the application communicates with Supabase PostgreSQL.

### IPv4 Transaction Pooler
Because Render operates in an IPv4 environment, it cannot connect directly to Supabase's IPv6 direct connection string. 

**CRITICAL FIX**: The `DATABASE_URL` environment variable on Render MUST use the Supabase Transaction Pooler URL.
- Port: `6543`
- Suffix: `?pgbouncer=true`
- Example: `postgresql://postgres.xxx:[PASSWORD]@aws-0-ap.pooler.supabase.com:6543/postgres?pgbouncer=true`