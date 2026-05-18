# Resume Builder - Pure React Application

A modern, responsive resume builder application built with **React**, **Vite**, **React Router**, **Tailwind CSS**, and **Axios**.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router DOM v7** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client
- **html2pdf.js** - PDF generation
- **Lucide React** - Icons
- **shadcn/ui** - UI components

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx       # Home page with features
│   ├── SignupPage.tsx        # User registration
│   ├── LoginPage.tsx         # User authentication
│   ├── Dashboard.tsx         # Resume management
│   └── ResumeBuilder.tsx      # Resume editor with live preview
├── components/
│   ├── ProtectedRoute.tsx     # Route protection wrapper
│   ├── ResumePreview.tsx      # Resume preview display
│   └── ui/                    # shadcn/ui components
├── context/
│   └── AuthContext.tsx        # Authentication state management
├── services/
│   └── api.ts                 # Axios API client with interceptors
├── lib/
│   └── utils.ts               # Utility functions
├── App.tsx                    # Main app router
└── main.tsx                   # React entry point
```

## Features

✅ **Beautiful Landing Page** - Showcase your resume builder with modern design
✅ **User Authentication** - Signup, login with token-based auth
✅ **Resume Management** - Create, edit, and delete resumes
✅ **Live Preview** - Real-time resume preview as you type
✅ **PDF Download** - Generate and download resumes as PDF
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Form Fields**:
  - Full Name, Email, Phone
  - LinkedIn & GitHub URLs
  - Education, Experience, Skills
  - Projects, Certifications

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will run on `http://localhost:5173/`

## API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL
})
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login

### Resume Management
- `GET /api/resume` - Get all user resumes
- `POST /api/resume` - Create new resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

## Routing

- `/` - Landing page
- `/signup` - Signup page
- `/login` - Login page
- `/dashboard` - Resume dashboard (protected)
- `/resume/new` - Create new resume (protected)
- `/resume/:id` - Edit resume (protected)

## Protected Routes

Dashboard and Resume Builder pages are protected with authentication. Users without a valid token will be redirected to the login page.

## Authentication Flow

1. User signs up or logs in
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically included in all API requests via Axios interceptor
5. Protected routes check for token before rendering

## Styling

The app uses Tailwind CSS v4 with a professional color scheme:
- Primary: Blue (#0066FF)
- Neutrals: Gray, White
- Accents: Green for success, Red for errors

## Building for Production

```bash
pnpm build
```

The optimized build will be in the `dist/` directory.

## Notes

- The backend API should be running on `http://localhost:5000`
- Update CORS settings on your backend to allow requests from the frontend
- Ensure your backend returns both `token` and `user` in login/signup responses
