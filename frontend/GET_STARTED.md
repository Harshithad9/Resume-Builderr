# Get Started - Resume Builder Setup Guide

Welcome! This guide will walk you through connecting your React frontend with your MERN backend.

---

## Choose Your Path

### 👉 **I want to start RIGHT NOW** (5 minutes)
Go to → [`QUICK_START.md`](./QUICK_START.md)
- Checklist format
- Quick copy-paste commands
- Essential steps only

### 👉 **I want detailed step-by-step instructions**
Go to → [`BACKEND_SETUP_GUIDE.md`](./BACKEND_SETUP_GUIDE.md)
- 8 detailed steps
- Explanations for each step
- Troubleshooting section
- Common questions answered

### 👉 **I need backend code examples**
Go to → [`BACKEND_EXAMPLES.md`](./BACKEND_EXAMPLES.md)
- Complete Express server setup
- User & Resume models
- All API routes
- Authentication middleware
- Ready-to-copy code

### 👉 **I want to understand the architecture**
Go to → [`SETUP_SUMMARY.md`](./SETUP_SUMMARY.md)
- Architecture diagrams
- Data flow visualizations
- Configuration checklist
- Response format validation
- Deployment info

### 👉 **I want general project info**
Go to → [`README.md`](./README.md)
- Project features
- Tech stack
- File structure
- API endpoints

---

## The 5-Minute Summary

```bash
# 1. Install dependencies
pnpm install

# 2. Update backend URL (edit src/services/api.ts if needed)
# Change baseURL to match your backend

# 3. Add CORS to your backend's Express server
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

# 4. Start frontend (Terminal 1)
pnpm dev

# 5. Start backend (Terminal 2)
npm start

# 6. Open browser and test
# http://localhost:5173
```

---

## Decision Tree

```
Does your backend exist?
├─ NO → See BACKEND_EXAMPLES.md for complete backend code
└─ YES
   │
   Is it running on localhost:5000?
   ├─ NO → Edit src/services/api.ts with correct URL
   └─ YES → Continue
   │
   Does it have CORS enabled?
   ├─ NO → Add CORS middleware to backend
   └─ YES → Continue
   │
   Does it have these 6 API endpoints?
   ├─ POST /api/auth/register
   ├─ POST /api/auth/login
   ├─ GET /api/resume
   ├─ POST /api/resume
   ├─ PUT /api/resume/:id
   └─ DELETE /api/resume/:id
      │
      All exist? → pnpm dev (see QUICK_START.md)
      Some missing? → Add them (see BACKEND_EXAMPLES.md)
```

---

## Common Scenarios

### Scenario 1: Backend doesn't exist yet
**What to do:**
1. Read `BACKEND_EXAMPLES.md`
2. Copy the provided code
3. Create your backend with it
4. Follow `QUICK_START.md` to connect

### Scenario 2: Backend exists but on different port
**What to do:**
1. Edit `src/services/api.ts`
2. Change `baseURL: 'http://localhost:5000/api'` to your port
3. Run `pnpm dev`

### Scenario 3: Getting "Cannot reach backend" error
**What to do:**
1. Check backend is running
2. Verify backend URL in `src/services/api.ts`
3. Add CORS to backend (see BACKEND_SETUP_GUIDE.md Step 4)
4. Check browser console for actual error message

### Scenario 4: Signup/login not working
**What to do:**
1. Open DevTools (F12) → Network tab
2. Try signup
3. Check the request to `/api/auth/register`
4. Look at the response for error message
5. Compare response format with SETUP_SUMMARY.md "Response Format Validation"

### Scenario 5: Dashboard loads but no resumes show
**What to do:**
1. Make sure you're logged in (token in localStorage)
2. Check `/api/resume` GET endpoint exists
3. Verify Authorization header is being sent (Network tab)
4. Check backend logs for errors

---

## File Guide

| File | Purpose | Read Time |
|------|---------|-----------|
| `GET_STARTED.md` (this file) | Navigation & overview | 2 min |
| `QUICK_START.md` | Fast checklist format | 5 min |
| `BACKEND_SETUP_GUIDE.md` | Detailed 8-step guide | 15 min |
| `BACKEND_EXAMPLES.md` | Complete code examples | 20 min |
| `SETUP_SUMMARY.md` | Architecture & diagrams | 10 min |
| `README.md` | Project info & features | 5 min |

---

## Critical Info

### Frontend Details
- **Runs on:** `http://localhost:5173`
- **Dev command:** `pnpm dev`
- **Build command:** `pnpm build`
- **Needs:** Node.js 18+

### Backend Requirements
- **Port:** `5000` (default, changeable)
- **CORS:** Must allow `http://localhost:5173`
- **Database:** MongoDB
- **6 API endpoints:** Auth (2) + Resume (4)

### Expected Response Format
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Storage
- Token saved in `localStorage` as key `token`
- Automatically sent in `Authorization` header
- JWT format (no "Bearer " prefix needed)

---

## Command Reference

```bash
# Frontend
pnpm install           # Install dependencies
pnpm dev              # Start dev server (port 5173)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Backend (your code)
npm install           # Install dependencies
npm start             # Start server (port 5000)
npm run dev           # Start with nodemon

# Testing
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'
```

---

## Debugging Checklist

When something isn't working:

- [ ] Is the backend running? (Test: `curl http://localhost:5000`)
- [ ] Is the frontend running? (Test: Open `http://localhost:5173`)
- [ ] Is CORS enabled on backend?
- [ ] Is the API base URL correct in `src/services/api.ts`?
- [ ] Open DevTools (F12) → Network tab
- [ ] Try the action again
- [ ] Look for failed requests (red)
- [ ] Click the request to see response
- [ ] Read the error message carefully
- [ ] Compare with expected response format

---

## FAQ

**Q: My backend is on a different port, what do I do?**
A: Edit `src/services/api.ts` and change the `baseURL` to match your port.

**Q: I'm getting a CORS error, why?**
A: Your backend needs CORS enabled. Add the CORS middleware shown in BACKEND_SETUP_GUIDE.md Step 4.

**Q: How do I know if the token is being sent?**
A: Open DevTools → Network tab → click the request → Headers section → look for Authorization header.

**Q: Can I test the backend without the frontend?**
A: Yes, use Postman or curl (examples in BACKEND_EXAMPLES.md and QUICK_START.md).

**Q: What if I don't know Node.js/Express?**
A: Copy the code from BACKEND_EXAMPLES.md - it's a complete, ready-to-use backend.

**Q: How do I deploy this?**
A: See SETUP_SUMMARY.md "Deployment" section.

---

## What Happens Next

### After Frontend Setup
1. **Start Frontend:** `pnpm dev`
2. **Start Backend:** `npm start`
3. **Test Signup:** Click "Get Started" → "Sign Up" → Fill form → Submit
4. **Check Success:** You should either see success or a backend error message

### After Both Running
1. **Create Resume:** Go to Dashboard → Create New Resume
2. **Fill Form:** Watch preview update in real-time
3. **Save:** Click "Save Resume"
4. **Download:** Click "Download as PDF"
5. **Edit:** Click resume from dashboard
6. **Delete:** Click delete icon

---

## Getting Help

If you're stuck:

1. **Read the error message carefully** - it usually tells you the problem
2. **Check the relevant guide** - use the Decision Tree above
3. **Look in DevTools Network tab** - see the actual error from backend
4. **Check backend logs** - see if request even reaches backend
5. **Compare response format** - ensure it matches expected format in SETUP_SUMMARY.md
6. **Try the curl test** - see if backend endpoint works at all

---

## Quick Navigation

- **First time?** → Start with `QUICK_START.md`
- **Need details?** → Read `BACKEND_SETUP_GUIDE.md`
- **Want to code?** → Copy from `BACKEND_EXAMPLES.md`
- **Understanding flow?** → Check `SETUP_SUMMARY.md`
- **Project info?** → See `README.md`

---

## You're Ready! 🚀

Pick your guide above and get started. Everything is set up and ready to connect!

Any issues? They're probably covered in the troubleshooting sections. Use the Decision Tree to navigate to the right solution.

Happy building! 💻
