/**
 * Game Smiths Club - Express Server
 * 
 * RESTful API server with MongoDB integration for member management
 * Features:
 * - Member registration and storage
 * - Member count retrieval
 * - Server-side rendering with EJS
 * - CORS enabled for API access
 * 
 * @author Game Smiths Club Team
 * @version 2.0.0
 * @requires express
 * @requires mongoose
 * @requires cors
 * @requires dotenv
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// Middleware Configuration
// ========================================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========================================
// MongoDB Connection
// ========================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://akshay:akshay@cluster0.hfehg.mongodb.net/gamesmithsclub?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Exit if database connection fails
});

// ========================================
// Database Schemas
// ========================================

/**
 * Member Schema
 * @typedef {Object} Member
 * @property {String} name - Full name of the member
 * @property {String} email - Email address (unique)
 * @property {String} phone - 10-digit phone number
 * @property {String} branch - Academic branch/department
 * @property {String} section - Class section
 * @property {String} interest - Primary area of interest
 * @property {String} message - Optional message from member
 * @property {Date} joinedAt - Registration timestamp
 */
const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    trim: true,
    uppercase: true
  },
  interest: {
    type: String,
    required: [true, 'Interest area is required']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
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

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * @route POST /api/join
 * @desc Submit join guild form
 * @access Public
 * @body {Object} Member data - { name, email, phone, branch, section, interest, message }
 * @returns {Object} Response - { success: boolean, message: string, data?: Member }
 * @example
 * // Request Body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "phone": "1234567890",
 *   "branch": "CSE",
 *   "section": "A",
 *   "interest": "Game Development",
 *   "message": "Excited to join!"
 * }
 * // Success Response (201):
 * {
 *   "success": true,
 *   "message": "Welcome to Game Smiths Club!",
 *   "data": { ...memberObject }
 * }
 */
app.post('/api/join', async (req, res) => {
  // ============================================================
  // REGISTRATION CLOSED - Comment out this block to re-enable
  // ============================================================
  return res.status(403).json({
    success: false,
    message: 'Registration period has ended. Stay tuned for the next semester!'
  });
  // ============================================================
  
  /* UNCOMMENT TO RE-ENABLE REGISTRATIONS
  try {
    let { name, email, phone, branch, section, interest, message } = req.body;

    // Sanitize and trim all inputs
    name = name ? String(name).trim() : '';
    email = email ? String(email).trim().toLowerCase() : '';
    phone = phone ? String(phone).trim().replace(/\D/g, '') : ''; // Remove non-digits
    branch = branch ? String(branch).trim() : '';
    section = section ? String(section).trim().toUpperCase() : '';
    interest = interest ? String(interest).trim() : '';
    message = message ? String(message).trim() : '';

    // Validate required fields
    if (!name || !email || !phone || !branch || !section || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields except message are required' 
      });
    }

    // Validate email format (more lenient)
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Validate phone number format (accept 10+ digits, extract first 10)
    if (phone.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid phone number (at least 10 digits)' 
      });
    }
    // Use first 10 digits
    phone = phone.substring(0, 10);

    // Check for duplicate email (case-insensitive)
    const existingMember = await Member.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (existingMember) {
      return res.status(409).json({ // 409 Conflict instead of 400
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    // Create member data object
    const memberData = {
      name,
      email,
      phone,
      branch,
      section,
      interest
    };

    // Only add message if it exists and has content
    if (message) {
      memberData.message = message.substring(0, 500); // Limit to 500 chars
    }

    // Create and save new member
    const newMember = new Member(memberData);
    await newMember.save();

    res.status(201).json({ 
      success: true, 
      message: 'Welcome to Game Smiths Club!',
      data: {
        name: newMember.name,
        email: newMember.email,
        branch: newMember.branch,
        interest: newMember.interest
      }
    });

  } catch (error) {
    console.error('Error saving member:', error);
    
    // Handle mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    // Generic error response (500 only for real server errors)
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
  */
  // END COMMENTED REGISTRATION CODE
});

/**
 * @route GET /api/members
 * @desc Get all members (sorted by join date, newest first)
 * @access Public
 * @returns {Object} Response - { success: boolean, count: number, data: Member[] }
 * @example
 * // Success Response (200):
 * {
 *   "success": true,
 *   "count": 42,
 *   "data": [ {...member1}, {...member2}, ... ]
 * }
 */
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.json({ 
      success: true, 
      count: members.length, 
      data: members 
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching members' 
    });
  }
});

/**
 * @route GET /api/members/count
 * @desc Get total member count
 * @access Public
 * @returns {Object} Response - { success: boolean, count: number }
 * @example
 * // Success Response (200):
 * {
 *   "success": true,
 *   "count": 42
 * }
 */
app.get('/api/members/count', async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting members:', error);
    // Return 0 instead of error for better UX
    res.json({ success: true, count: 0 });
  }
});

/**
 * @route POST /api/register
 * @desc Submit registration form with roll number
 * @access Public
 * @body {Object} Registration data - { name, email, phone, rollNumber, branch, year, section, interest }
 * @returns {Object} Response - { success: boolean, message: string, data?: Registration }
 * @example
 * // Request Body:
 * {
 *   "name": "Jane Smith",
 *   "email": "jane@example.com",
 *   "phone": "9876543210",
 *   "rollNumber": "21BCE1234",
 *   "branch": "CSE",
 *   "year": "2nd Year",
 *   "section": "A",
 *   "interest": "Game Design"
 * }
 * // Success Response (201):
 * {
 *   "success": true,
 *   "message": "Registration successful! Welcome to Game Smiths Club! 🎮",
 *   "data": { ...registrationObject }
 * }
 */
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, rollNumber, branch, year, section, interest } = req.body;

    // Validate all required fields
    if (!name || !email || !phone || !rollNumber || !branch || !year || !section || !interest) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Check for duplicate email
    const existingEmail = await Registration.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already registered!' 
      });
    }

    // Check for duplicate roll number
    const existingRoll = await Registration.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      return res.status(400).json({ 
        success: false, 
        message: 'This roll number is already registered!' 
      });
    }

    // Create and save new registration
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

/**
 * @route GET /api/registrations
 * @desc Get all registrations (sorted by registration date, newest first)
 * @access Public
 * @returns {Object} Response - { success: boolean, count: number, data: Registration[] }
 */
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ registeredAt: -1 });
    res.json({ 
      success: true, 
      count: registrations.length, 
      data: registrations 
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching registrations' 
    });
  }
});

/**
 * @route GET /api/registrations/count
 * @desc Get total registration count
 * @access Public
 * @returns {Object} Response - { success: boolean, count: number }
 */
app.get('/api/registrations/count', async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error counting registrations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error counting registrations' 
    });
  }
});

// ============================================================================
// STATIC FILE SERVING
// ============================================================================

/**
 * Serve index.html for root route
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

/**
 * 404 Handler - Catch all unmatched routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * Global Error Handler - Catch any unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
