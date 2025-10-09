const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akshay:akshay@cluster0.hfehg.mongodb.net/gamesmithsclub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Member Schema
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  interest: {
    type: String,
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const Member = mongoose.model('Member', memberSchema);

// Registration Schema
const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true,
    uppercase: true
  },
  interest: {
    type: String,
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Routes
app.post('/api/join', async (req, res) => {
  try {
    const { name, email, interest, message } = req.body;

    // Validate input
    if (!name || !email || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and interest are required' 
      });
    }

    // Check if email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    // Create new member
    const newMember = new Member({
      name,
      email,
      interest,
      message
    });

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

// Get all members (optional - for admin view)
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching members' });
  }
});

// Get member count
app.get('/api/members/count', async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting members' });
  }
});

// Registration Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, rollNumber, branch, year, section, interest } = req.body;

    // Validate input
    if (!name || !email || !phone || !rollNumber || !branch || !year || !section || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check if email already registered
    const existingEmail = await Registration.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    // Check if roll number already registered
    const existingRoll = await Registration.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      return res.status(400).json({ 
        success: false, 
        message: 'This roll number is already registered!' 
      });
    }

    // Create new registration
    const newRegistration = new Registration({
      name,
      email,
      phone,
      rollNumber: rollNumber.toUpperCase(),
      branch,
      year,
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

// Get all registrations (optional - for admin view)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching registrations' });
  }
});

// Get registration count
app.get('/api/registrations/count', async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error counting registrations' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
