const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const Restaurant = require('./models/Restaurant');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS: allow your Netlify frontend to communicate with this Render backend
app.use(cors({
  origin: 'https://sitesprouts.netlify.app'
}));

// Session + Passport setup
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'site-sprout-secret', 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK || 'https://sitesprout.onrender.com/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
  const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
  const user = { id: profile.id, name: profile.displayName, email };
  return cb(null, user);
}));

// FIXED: Import using the actual filename 'appRoutes.js'
const siteRoutes = require('./appRoutes'); 
app.use('/', siteRoutes);

// Catch-all route for generated restaurant sites
app.get('/:slug', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (restaurant) {
      res.render('template', { restaurant });
    } else {
      res.status(404).send('Restaurant not found');
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});