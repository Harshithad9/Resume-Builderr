# Backend Implementation Examples

Reference implementations for your MERN backend to work with this frontend.

---

## Express Server Setup

### Basic Setup with CORS

```javascript
// server.js or index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resume', require('./routes/resume'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## User Model

### MongoDB Schema for Users

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

## Resume Model

### MongoDB Schema for Resumes

```javascript
// models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: String,
  email: String,
  phone: String,
  linkedIn: String,
  github: String,
  education: [{
    school: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
```

---

## Authentication Routes

### Auth Endpoints (Register & Login)

```javascript
// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// SIGNUP/REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }

    // Create user
    user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user and check password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

## Middleware: Authentication

### Protect Routes with JWT

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized to access this route' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Not authorized to access this route' 
    });
  }
};

module.exports = { protect };
```

---

## Resume Routes

### CRUD Operations for Resumes

```javascript
// routes/resume.js
const express = require('express');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Middleware: Apply protection to all routes
router.use(protect);

// GET all resumes for logged-in user
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single resume
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Not authorized to access this resume' 
      });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new resume
router.post('/', async (req, res) => {
  try {
    const resume = new Resume({
      userId: req.userId,
      ...req.body
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE resume
router.put('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Not authorized to update this resume' 
      });
    }

    // Update fields
    Object.assign(resume, req.body);
    resume.updatedAt = Date.now();
    
    await resume.save();
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this resume' 
      });
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

## Environment Variables

### .env file for Backend

```
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

---

## Package.json Dependencies

### Required npm packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  },
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

Install with:
```bash
npm install
```

---

## Quick Start: Complete Backend

### 1. Create project structure
```
backend/
├── models/
│   ├── User.js
│   └── Resume.js
├── routes/
│   ├── auth.js
│   └── resume.js
├── middleware/
│   └── auth.js
├── .env
├── server.js
└── package.json
```

### 2. Install dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

### 3. Create .env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-builder
JWT_SECRET=your_secret_key
```

### 4. Run server
```bash
npm start
# or for development:
npm run dev
```

---

## Testing Endpoints with Postman/cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Resumes (with token)
```bash
curl -X GET http://localhost:5000/api/resume \
  -H "Authorization: eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

### Create Resume
```bash
curl -X POST http://localhost:5000/api/resume \
  -H "Authorization: eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"]
  }'
```

---

## Common Issues & Solutions

### Issue: "Unexpected token" in JWT verification
**Solution:** Make sure the token format is correct without "Bearer " prefix. Frontend sends just the token.

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Ensure MongoDB is running locally or update MONGODB_URI to your cloud DB
- Check connection string is correct in .env

### Issue: CORS error in frontend
**Solution:**
- Make sure `cors()` is added before routes
- Frontend URL is in `origin` array

### Issue: "401 Unauthorized" on protected routes
**Solution:**
- Check Authorization header is being sent
- Verify token hasn't expired
- Make sure JWT_SECRET matches between login and route verification

---

## That's It!

Your backend is now ready to work with the React frontend. Connect using the frontend's API configuration and you're all set!
