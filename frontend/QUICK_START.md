# Quick Start Checklist

## Before Running the Frontend

- [ ] **Backend is running** on `http://localhost:5000` (or note your port)
- [ ] **Backend has CORS enabled** for `http://localhost:5173`
- [ ] **Backend has these routes:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/resume`
  - `POST /api/resume`
  - `PUT /api/resume/:id`
  - `DELETE /api/resume/:id`

---

## Setting Up Frontend (One-Time)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Update Backend URL (if not on localhost:5000)
Edit `src/services/api.ts`:
```typescript
const API = axios.create({
  baseURL: 'http://localhost:YOUR_PORT/api', // Change YOUR_PORT
})
```

### Step 3: Make Sure Backend Has CORS
Add this to your backend (Express):
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## Running the App

### Terminal 1: Start Frontend
```bash
pnpm dev
```
Opens on `http://localhost:5173`

### Terminal 2: Start Your Backend
```bash
npm start
# or your backend's start command
```

---

## Testing the Connection

1. Open `http://localhost:5173` in browser
2. Click "Get Started" → "Sign Up"
3. Enter test credentials and click "Create Account"

**Success:** Redirected to login page
**Error:** Check browser console (F12) → Network tab for API response

---

## Quick API Testing

Test your backend endpoints with curl:

```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Both should return:
```json
{
  "token": "...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

---

## Debugging Errors

### Error: "Cannot reach backend"
- [ ] Backend is running?
- [ ] Backend port matches in `src/services/api.ts`?
- [ ] CORS enabled on backend?

### Error: "Invalid token" or "Unauthorized"
- [ ] Backend returns `token` in response?
- [ ] Token is stored in localStorage?
- [ ] Authorization header is being sent?

### No error but nothing happens
- Open DevTools (F12) → Network tab
- Try action again
- Look for failed requests
- Check response body for error details

---

## Common API Response Issues

Your backend response must match this format:

```javascript
// ✅ Correct format (signup/login)
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "605c72ef123456789",
    "email": "user@example.com",
    "name": "User Name"
  }
}

// ❌ Wrong format
{
  "success": true,  // Frontend doesn't use this
  "data": { ... }   // Frontend expects token & user at root level
}
```

---

## What to Do When Done

Once everything works:

1. **Create a resume:** Dashboard → Create New Resume
2. **Fill the form:** Watch live preview on the right
3. **Save:** Click "Save Resume"
4. **Download:** Click "Download as PDF"
5. **Edit:** Click resume from dashboard to edit
6. **Delete:** Click delete icon to remove

---

## Next Steps (Optional)

- Deploy to Vercel: `npm install -g vercel` → `vercel`
- Update backend URL in `src/services/api.ts` to production URL
- Build production: `pnpm build`
- Test in production build: `pnpm preview`

---

## File Locations Reference

| What | Location |
|------|----------|
| API Config | `src/services/api.ts` |
| Auth Logic | `src/context/AuthContext.tsx` |
| Protected Routes | `src/components/ProtectedRoute.tsx` |
| Pages | `src/pages/` |
| Components | `src/components/` |
| Styles | `app/globals.css` |

---

## Still Having Issues?

1. **Check Network Tab:** F12 → Network → Try action → Look for red requests
2. **Check Console:** F12 → Console → Look for error messages
3. **Check Backend Logs:** See if request reaches backend
4. **Test Backend Directly:** Use curl/Postman to test endpoints
5. **Read Error Response:** Backend error message often says what's wrong

Need more details? See `BACKEND_SETUP_GUIDE.md`
