const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Adjust based on your needs
}));
app.use(compression()); // Gzip compression
app.use(cors());
app.use(express.json());

// Static files with caching
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akshay:akshay@cluster0.hfehg.mongodb.net/gamesmithsclub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  interest: { type: String, required: true },
  message: { type: String, trim: true },
  joinedAt: { type: Date, default: Date.now }
});

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, trim: true, uppercase: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true, uppercase: true },
  interest: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', memberSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// SSR Route - Render with initial data
app.get('/', async (req, res) => {
  try {
    // Fetch initial data server-side
    const registeredCount = await Registration.countDocuments();
    const memberCount = await Member.countDocuments();
    
    // Calculate countdown server-side
    const now = new Date();
    const year = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 17) 
      ? now.getFullYear() + 1 
      : now.getFullYear();
    const targetDate = new Date(year, 9, 17, 0, 0, 0);
    const diff = targetDate - now;
    
    const countdown = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };

    // Render with server-side data
    res.render('index', {
      title: 'Game Smiths Club',
      registeredCount,
      memberCount,
      countdown,
      year: new Date().getFullYear()
    });
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Server Error');
  }
});

// API Routes
app.post('/api/join', async (req, res) => {
  try {
    const { name, email, interest, message } = req.body;

    if (!name || !email || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and interest are required' 
      });
    }

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    const newMember = new Member({ name, email, interest, message });
    await newMember.save();

    res.status(201).json({ 
      success: true, 
      message: 'Welcome to Game Smiths Club! 🎮',
      data: newMember
    });
  } catch (error) {
    console.error('Error saving member:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, rollNumber, branch, year, section, interest } = req.body;

    if (!name || !email || !phone || !rollNumber || !branch || !year || !section || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const existingEmail = await Registration.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    const existingRoll = await Registration.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      return res.status(400).json({ 
        success: false, 
        message: 'This roll number is already registered!' 
      });
    }

    const newRegistration = new Registration({
      name, email, phone,
      rollNumber: rollNumber.toUpperCase(),
      branch, year,
      section: section.toUpperCase(),
      interest
    });

    await newRegistration.save();

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Welcome to Game Smiths Club! 🎮',
      data: newRegistration
    });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

app.get('/api/registrations/count', async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting registrations' });
  }
});

app.get('/api/members/count', async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting members' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
