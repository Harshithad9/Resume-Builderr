# How to Run Resume Builder

Complete step-by-step instructions to run the React frontend and connect it to your MERN backend.

---

## Prerequisites

Before starting, make sure you have:
- Node.js (v16+) installed
- npm or pnpm package manager
- MongoDB running (for backend)
- A MERN backend with the 6 required API endpoints (see below)

Check if Node is installed:
```bash
node --version
npm --version
```

---

## Option 1: Run Frontend Only (Quick Preview)

If you just want to see the React app without connecting to a backend:

### Step 1: Install Dependencies
```bash
cd /path/to/resume-builder
pnpm install
```

### Step 2: Start Development Server
```bash
pnpm dev
```

### Step 3: Open in Browser
```
http://localhost:5173
```

You'll see the landing page. Click "Get Started" to see the signup flow (won't save data without backend).

---

## Option 2: Run Frontend + Backend (Full Setup)

Complete setup with a working backend connection.

### Frontend Setup

#### Step 1: Navigate to Project Directory
```bash
cd /path/to/resume-builder
```

#### Step 2: Install Frontend Dependencies
```bash
pnpm install
```

#### Step 3: Update Backend URL (if needed)

Edit `src/services/api.ts`:

```typescript
// If your backend is on localhost:5000 (default), no change needed
// If on different port:

const API = axios.create({
  baseURL: 'http://localhost:YOUR_PORT/api',  // Change YOUR_PORT to your actual port
  withCredentials: true,
})
```

**Examples:**
- Backend on port 5000: `http://localhost:5000/api`
- Backend on port 3001: `http://localhost:3001/api`
- Backend on different machine: `http://192.168.1.100:5000/api`
- Production: `https://your-backend.com/api`

#### Step 4: Start Frontend Development Server
```bash
pnpm dev
```

Output will show:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal open** - your frontend is now running.

---

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd /path/to/your-backend
```

#### Step 2: Install Backend Dependencies (if not done)
```bash
npm install
```

#### Step 3: Create Environment Variables

Create `.env` file in your backend root:
```
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your-secret-key-here
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### Step 4: Enable CORS in Your Backend

In your Express app (usually `server.js` or `app.js`), add CORS middleware:

```javascript
const cors = require('cors');

// Add this before your routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
```

**Important:** Add this BEFORE your route definitions!

#### Step 5: Make Sure These 6 API Routes Exist

Your backend must have these endpoints:

**Authentication Routes:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user, return JWT token

**Resume Routes:**
- `GET /api/resume` - Get all user's resumes
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume by ID
- `DELETE /api/resume/:id` - Delete resume by ID

See `BACKEND_EXAMPLES.md` for complete example code.

#### Step 6: Start Backend Server

**In a new terminal:**
```bash
npm start
```

Output should show:
```
Server running on port 5000
MongoDB connected
```

**Keep this terminal open** - your backend is now running.

---

## Testing the Connection

### Step 1: Verify Both Servers Running

You should have 2 terminals open:

**Terminal 1 (Frontend):**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Terminal 2 (Backend):**
```
Server running on port 5000
MongoDB connected
```

### Step 2: Open App in Browser
```
http://localhost:5173
```

You should see the landing page.

### Step 3: Test Signup Flow

1. Click **"Get Started"** button
2. Click **"Create Account"** link
3. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!`
4. Click **"Create Account"**
5. **Check DevTools (F12) → Network tab** to see the request

**Success:** You see success message OR redirected to login
**Error:** You see error message from backend

Either way = Connection is working!

### Step 4: Complete Login Test

1. Login with your test credentials
2. Should see Dashboard with your resume list (empty on first try)
3. Try creating a new resume

---

## Quick Test: Is Backend Working?

Test your backend independently using cURL:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

If this works, your backend is good!

---

## File Locations Reference

Important files to know:

```
project-root/
├── src/
│   ├── services/
│   │   └── api.ts              ← Backend URL goes here
│   ├── context/
│   │   └── AuthContext.tsx     ← Auth logic
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── ResumeBuilder.tsx
│   └── App.tsx
├── vite.config.ts
├── package.json
└── index.html
```

Backend files (your project):
```
backend-root/
├── server.js or app.js         ← Add CORS here
├── routes/
│   ├── auth.js                 ← Auth endpoints
│   └── resume.js               ← Resume endpoints
├── models/
│   ├── User.js
│   └── Resume.js
├── .env                        ← Put MongoDB URI here
└── package.json
```

---

## Troubleshooting

### Frontend Won't Start

**Error: `Port 5173 already in use`**
```bash
# Kill process using port 5173
npx kill-port 5173
pnpm dev
```

**Error: `Module not found`**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
pnpm dev
```

### Backend Won't Start

**Error: `Cannot connect to MongoDB`**
- Check MongoDB is running: `mongod`
- Check MONGODB_URI in .env is correct
- Verify MongoDB is on `localhost:27017`

**Error: `Port 5000 already in use`**
```bash
# Kill process using port 5000
npx kill-port 5000
npm start
```

### CORS Error in Browser

**Error: `Access to XMLHttpRequest blocked by CORS`**

1. Check backend has CORS middleware
2. Check CORS origin matches: `http://localhost:5173`
3. Check CORS is added BEFORE routes
4. Restart backend: `npm start`

### Signup Doesn't Work

**Error: `Network request failed`**

1. Check backend is running: terminal should show "Server running on port 5000"
2. Check API URL in `src/services/api.ts` is correct
3. Open DevTools (F12) → Network tab
4. Try signup again
5. Look for the request to `/api/auth/register`
6. Click it to see actual error

**Error: `Invalid request format`**

Backend expects:
```json
{
  "name": "string",
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

Check your backend is validating correctly.

### Dashboard is Blank

1. Make sure you're logged in
2. Open DevTools → Network tab
3. Look for GET request to `/api/resume`
4. Check response has array of resumes (can be empty `[]`)
5. If request fails, check backend route exists

---

## Development Commands

### Frontend Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

### Backend Commands (yours)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Restart if you make changes
# Just Ctrl+C and npm start again
```

---

## Production Deployment

### Deploying Frontend

```bash
pnpm build
```

Creates `dist/` folder ready for deployment.

Deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting

### Deploying Backend

Update `.env` for production:
```
MONGODB_URI=mongodb+srv://user:pass@cluster...
JWT_SECRET=strong-secret-key
PORT=5000
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

Deploy to:
- Heroku
- Railway
- Render
- AWS
- DigitalOcean

Update `src/services/api.ts` with production URL:
```typescript
baseURL: 'https://your-backend.com/api'
```

---

## Complete Workflow (5 Steps)

1. **Install Frontend Dependencies**
   ```bash
   cd resume-builder
   pnpm install
   ```

2. **Update Backend URL** (if needed)
   Edit: `src/services/api.ts`

3. **Start Frontend**
   ```bash
   pnpm dev
   ```
   Keep terminal open.

4. **Start Backend** (in new terminal)
   ```bash
   npm start
   ```
   Keep terminal open.

5. **Open Browser**
   ```
   http://localhost:5173
   ```
   Test signup to verify connection.

---

## Need Help?

1. **Frontend issue?** Check `src/services/api.ts` has correct backend URL
2. **Backend issue?** Check CORS is enabled and routes exist
3. **Connection issue?** Test backend with cURL command above
4. **Other issue?** Check browser DevTools (F12) → Network and Console tabs

See other guides for detailed troubleshooting:
- `BACKEND_SETUP_GUIDE.md` - Detailed 8-step setup
- `BACKEND_EXAMPLES.md` - Complete backend code examples
- `CHEAT_SHEET.txt` - Quick reference for common issues
