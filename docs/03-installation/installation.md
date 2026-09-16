# Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/thamizhans/theamazingweb.git
cd theamazingweb
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd Frontend
npm install
cd ..
```

### 4. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
SUPABASE_URL="https://[ID].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
API_SECRET_KEY="your-secure-password"
PORT=3001
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Start the Development Servers
Open two terminal windows.

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```