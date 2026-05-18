# Resume Builder - Setup Summary

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Side)                     │
│                                                               │
│  http://localhost:5173                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React App (Vite)                                    │   │
│  │  ├─ Landing Page                                     │   │
│  │  ├─ Signup/Login Pages                              │   │
│  │  ├─ Dashboard (Protected)                           │   │
│  │  └─ Resume Builder (Protected)                      │   │
│  │                                                      │   │
│  │  localStorage                                        │   │
│  │  └─ token (JWT)  ◄─────┐                           │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                                                     │
│         │ Axios HTTP Requests                                │
│         │ (Auto-adds Authorization header)                   │
│         │                                                     │
└─────────┼─────────────────────────────────────────────────────┘
          │
          │ CORS Enabled
          │ Port 5000
          │
┌─────────▼─────────────────────────────────────────────────────┐
│                    SERVER (Backend)                             │
│                                                                 │
│  http://localhost:5000                                         │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Express.js Server                                       │ │
│  │  ├─ POST   /api/auth/register    → Create User          │ │
│  │  ├─ POST   /api/auth/login       → Return Token         │ │
│  │  ├─ GET    /api/resume           → Get User's Resumes   │ │
│  │  ├─ POST   /api/resume           → Create Resume        │ │
│  │  ├─ PUT    /api/resume/:id       → Update Resume        │ │
│  │  └─ DELETE /api/resume/:id       → Delete Resume        │ │
│  └──────────────────────────────────────────────────────────┘ │
│         │                                                      │
│         │ Query/Insert/Update/Delete                          │
│         │                                                      │
│  ┌──────▼──────────────────────────────────────────────────┐ │
│  │  MongoDB Database                                      │ │
│  │  ├─ users collection                                  │ │
│  │  │  └─ { _id, name, email, password, createdAt }    │ │
│  │  │                                                    │ │
│  │  └─ resumes collection                               │ │
│  │     └─ { _id, userId, fullName, email, ... }       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Setup

### Phase 1: One-Time Frontend Setup

#### Step 1.1 - Install Dependencies
```bash
cd resume-builder
pnpm install
# Installs: React, Vite, React Router, Tailwind, Axios, etc.
```

#### Step 1.2 - Configure Backend URL
**File:** `src/services/api.ts`

```typescript
// Default (works if backend is on localhost:5000)
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Change if your backend is on different port/URL
```

#### Step 1.3 - Configure CORS on Backend
**In your backend's Express app:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### Phase 2: Running the Application

#### Step 2.1 - Start Frontend (Terminal 1)
```bash
pnpm dev
```
**Opens on:** `http://localhost:5173/`

#### Step 2.2 - Start Backend (Terminal 2)
```bash
npm start
# or
npm run dev
```
**Runs on:** `http://localhost:5000/`

#### Step 2.3 - Verify Connection
1. Open `http://localhost:5173` in browser
2. Click "Get Started" → "Sign Up"
3. Enter test credentials
4. If you see success or error from backend → ✅ Connected!

---

## Data Flow Diagram

### User Signup Flow
```
┌─────────┐
│ Browser │ Fills signup form
└────┬────┘
     │
     ▼
┌──────────────────────────────────────┐
│ Submit Form                          │
│ email: "user@example.com"            │
│ password: "password123"              │
│ name: "John Doe"                     │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ React POST /api/auth/register        │
└────┬─────────────────────────────────┘
     │
     ▼ (Network Request)
┌──────────────────────────────────────┐
│ Backend Receives Request             │
│ ✓ Validates input                    │
│ ✓ Hashes password                    │
│ ✓ Creates user in MongoDB            │
│ ✓ Generates JWT token                │
└────┬─────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ Backend Response                     │
│ {                                    │
│   "token": "eyJ...",                 │
│   "user": {                          │
│     "id": "...",                     │
│     "email": "...",                  │
│     "name": "..."                    │
│   }                                  │
│ }                                    │
└────┬─────────────────────────────────┘
     │
     ▼ (Back to Browser)
┌──────────────────────────────────────┐
│ React Receives Response              │
│ ✓ Stores token in localStorage       │
│ ✓ Stores user in AuthContext         │
│ ✓ Redirects to Login page            │
└──────────────────────────────────────┘
```

### User Login & Resume Access
```
┌─────────────────────────────────┐
│ User logs in                    │
│ POST /api/auth/login            │
│ ↓                               │
│ Backend returns token           │
│ ↓                               │
│ Token stored in localStorage    │
│ ↓                               │
│ User redirected to /dashboard   │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Dashboard Component Loads       │
│ useEffect → GET /api/resume     │
│                                 │
│ Axios Interceptor adds token:   │
│ Authorization: "eyJ..."         │
│ ↓                               │
│ Backend receives request        │
│ ✓ Validates token               │
│ ✓ Extracts userId from token    │
│ ✓ Queries MongoDB for user's    │
│   resumes                       │
│ ↓                               │
│ Returns array of resumes        │
│ ↓                               │
│ React displays list on screen   │
└─────────────────────────────────┘
```

---

## Configuration Checklist

### Backend (.env)
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=mongodb://localhost:27017/resume-builder`
- [ ] `JWT_SECRET=your_secret_key`
- [ ] CORS enabled for `http://localhost:5173`

### Frontend (src/services/api.ts)
- [ ] `baseURL: 'http://localhost:5000/api'`
- [ ] Matches your backend port

### MongoDB
- [ ] Running locally or accessible via cloud connection string
- [ ] Collections created (users, resumes)

### API Endpoints
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `GET /api/resume`
- [ ] `POST /api/resume`
- [ ] `PUT /api/resume/:id`
- [ ] `DELETE /api/resume/:id`

---

## Response Format Validation

### ✅ CORRECT Response Format

**Signup/Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "605c72ef654321abcdef0123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Get Resumes Response:**
```json
[
  {
    "_id": "605c72ef654321abcdef0124",
    "userId": "605c72ef654321abcdef0123",
    "fullName": "John Doe",
    "email": "john@example.com",
    "skills": ["JavaScript", "React"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### ❌ INCORRECT Response Format

```json
{
  "success": true,           // ❌ Frontend expects no "success" field
  "data": {                  // ❌ Should be at root level
    "token": "...",
    "user": { ... }
  }
}
```

---

## File Locations for Reference

```
resume-builder/
├── src/
│   ├── services/api.ts          ← Edit backend URL here
│   ├── context/AuthContext.tsx  ← Auth logic
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── ResumeBuilder.tsx
│   └── components/
├── vite.config.ts               ← Build config
├── package.json
├── QUICK_START.md               ← Quick reference
├── BACKEND_SETUP_GUIDE.md       ← Detailed guide
└── BACKEND_EXAMPLES.md          ← Code examples
```

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| "Cannot reach backend" | Check backend is running on correct port |
| CORS error | Add CORS middleware to backend |
| "Invalid token" | Ensure response has `token` field |
| Form submission does nothing | Open DevTools → Network tab → Check requests |
| Dashboard is blank | Check Authorization header is sent (Network tab) |
| Resume won't save | Verify backend's PUT endpoint exists and works |

---

## Next: Deployment

When everything works locally:

### Deploy Frontend to Vercel
```bash
npm install -g vercel
vercel
```

### Update Backend URL
Edit `src/services/api.ts` to your production URL:
```typescript
const API = axios.create({
  baseURL: 'https://api.yourdomain.com/api',
})
```

### Deploy Backend
- Push code to GitHub
- Deploy to Heroku, Railway, AWS, etc.
- Update MongoDB connection to production database

---

## Quick Links

- **Frontend Setup:** `QUICK_START.md`
- **Detailed Guide:** `BACKEND_SETUP_GUIDE.md`
- **Backend Code Examples:** `BACKEND_EXAMPLES.md`
- **Frontend Repo:** `.`
- **Full README:** `README.md`

---

## Summary

1. **Install frontend:** `pnpm install`
2. **Configure:** Edit `src/services/api.ts` with backend URL
3. **Enable CORS:** Add CORS middleware on backend
4. **Run both:** `pnpm dev` (frontend) + `npm start` (backend)
5. **Test:** Visit `http://localhost:5173` and try signup

**That's it! Your app is connected. 🚀**
