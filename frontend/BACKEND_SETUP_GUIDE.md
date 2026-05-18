# Backend Integration Guide

Complete step-by-step procedure to connect your React frontend with your MERN backend.

## Prerequisites

- Node.js 18+ installed
- Your MERN backend running
- pnpm installed (or npm/yarn)

---

## Step 1: Verify Your Backend is Running

Before starting the frontend, ensure your backend server is up and running.

### Check Your Backend:
```bash
# Your backend should be running on http://localhost:5000
# Test it with:
curl http://localhost:5000/api/auth/login
```

**Expected Response:** Your backend should respond (even with an error is fine)

---

## Step 2: Install Frontend Dependencies

```bash
# Navigate to the project directory
cd /path/to/resume-builder

# Install all dependencies
pnpm install

# If using npm:
npm install

# If using yarn:
yarn install
```

**What this does:** Downloads all required packages (React, Vite, Axios, etc.)

---

## Step 3: Update API Base URL

The frontend needs to know where your backend is located.

### Edit the API configuration:

**File:** `src/services/api.ts`

```typescript
// Current (default):
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// If your backend is on a different port or URL, change it:
// Example for port 8000:
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Example for production:
const API = axios.create({
  baseURL: 'https://api.yourdomain.com/api',
})
```

**Save the file after making changes.**

---

## Step 4: Configure CORS on Backend

Your backend must allow requests from the frontend URL.

### Add to your backend's Express app:

```javascript
// In your backend (Node.js/Express):
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Why this is needed:** Prevents cross-origin request errors in the browser.

---

## Step 5: Start the Development Server

```bash
# Start the Vite dev server
pnpm dev

# If using npm:
npm run dev

# If using yarn:
yarn dev
```

**Output you should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

## Step 6: Test the Connection

Open your browser and navigate to: `http://localhost:5173/`

### Test the signup flow:
1. Click "Get Started" button
2. Fill in the signup form with test data:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create Account"

**Expected:** 
- If backend is connected, you'll see either a success message or an error from your backend
- If connection fails, you'll see a network error in the browser console

### Debug connection issues:
1. Open Browser DevTools (F12 or Cmd+Option+I)
2. Go to "Network" tab
3. Try signing up again
4. Look for the request to your backend
5. Check the response to see what error is returned

---

## Step 7: Verify Backend Response Format

Your backend's login/signup endpoints should return a JSON response like this:

### Signup Response (POST /api/auth/register):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id_here",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### Login Response (POST /api/auth/login):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id_here",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Important:** The response must have `token` and `user` fields, or the auth will fail.

---

## Step 8: Test the Full Workflow

Once signup/login works:

1. **Login:** Go to `/login` and login with your test credentials
2. **Redirect:** You should be redirected to `/dashboard`
3. **Create Resume:** Click "Create New Resume" button
4. **Edit Resume:** Fill in the form and watch the preview update in real-time
5. **Save Resume:** Click "Save Resume" button
6. **Download PDF:** Click "Download as PDF" button

---

## Required API Endpoints

Your backend must implement these endpoints. The frontend expects them at these exact paths:

### Authentication Endpoints:
```
POST   /api/auth/register         # User signup
POST   /api/auth/login            # User login
```

### Resume Endpoints:
```
GET    /api/resume                # Get all user's resumes
POST   /api/resume                # Create new resume
GET    /api/resume/:id            # Get single resume
PUT    /api/resume/:id            # Update resume
DELETE /api/resume/:id            # Delete resume
```

### Expected Request/Response Formats:

**POST /api/auth/register**
```
Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

Response:
{
  "token": "jwt_token_here",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

**POST /api/resume** (requires Authorization header)
```
Request Headers:
Authorization: <jwt_token>

Request Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedIn": "linkedin.com/in/johndoe",
  "github": "github.com/johndoe",
  "education": [...],
  "experience": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...]
}

Response:
{
  "_id": "resume_id",
  "userId": "user_id",
  "fullName": "John Doe",
  ...
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**GET /api/resume** (requires Authorization header)
```
Request Headers:
Authorization: <jwt_token>

Response:
[
  {
    "_id": "resume_1",
    "fullName": "John Doe",
    "email": "john@example.com",
    ...
  },
  {
    "_id": "resume_2",
    "fullName": "Jane Smith",
    ...
  }
]
```

---

## Troubleshooting

### Issue: "Cannot POST /api/auth/register"
**Solution:** 
- Check that your backend is running
- Verify the API base URL in `src/services/api.ts` matches your backend URL
- Check your backend has the `/api/auth/register` route

### Issue: "Network request failed" or CORS error
**Solution:**
- Add CORS configuration to your backend (see Step 4)
- Check the backend is running on the correct port
- Check browser console for exact error message

### Issue: "Unauthorized" or "Invalid token"
**Solution:**
- Ensure backend is returning a `token` field in login response
- Check token is being stored in localStorage
- Verify backend validates the Authorization header correctly

### Issue: Form submission does nothing
**Solution:**
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try the action again
4. Check if the request was made
5. Look at the response for error details

### Issue: Can't create/edit resumes
**Solution:**
- Make sure you're logged in (token should be in localStorage)
- Check your backend's resume endpoints exist and are working
- Verify the Authorization header is being sent (check Network tab in DevTools)

---

## Environment Variables (Optional)

If you need to use different URLs for different environments:

**Create a `.env` file in the project root:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Update `src/services/api.ts`:**
```typescript
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
})
```

---

## Building for Production

When your app is ready for production:

```bash
# Build the optimized production bundle
pnpm build

# Preview the production build locally
pnpm preview
```

**Then:**
1. Update `src/services/api.ts` with your production backend URL
2. Deploy the `dist/` folder to your hosting (Vercel, Netlify, etc.)
3. Ensure CORS is configured for your production domain

---

## Common Questions

**Q: What port does the frontend run on?**
A: By default, `http://localhost:5173/`

**Q: What port should my backend run on?**
A: By default, `http://localhost:5000/` (but you can change this in Step 3)

**Q: How is the token stored?**
A: In browser's `localStorage` as key `token`

**Q: How is the token sent to the backend?**
A: Automatically in the `Authorization` header for all API requests

**Q: Do I need to implement logout?**
A: Yes, the logout button will clear the token from localStorage and redirect to login

---

## Quick Start Summary

```bash
# 1. Install dependencies
pnpm install

# 2. Update src/services/api.ts with your backend URL

# 3. Add CORS to your backend

# 4. Start frontend
pnpm dev

# 5. Start your backend (in another terminal)
npm start

# 6. Open http://localhost:5173 in browser
```

That's it! Your frontend is now connected to your backend.

---

## Need Help?

1. Check the browser console (F12) for error messages
2. Check the Network tab to see what requests are being made
3. Verify your backend endpoints match the expected routes
4. Ensure the API response format matches what the frontend expects
