require('dotenv').config(); 
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const Restaurant = require('./models/Restaurant');

const app = express();
const port = process.env.PORT || 3000;

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// 2. Middleware Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 3. CORS - Trusting your Netlify URL
app.use(cors({ 
  origin: ['https://sitesprouts.netlify.app', 'https://sitesprout.onrender.com'],
  credentials: true 
}));

// 4. Session & Passport Config
app.use(session({
  secret: process.env.SESSION_SECRET || 'sitesprout_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// 5. Google Auth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://sitesprout.onrender.com/auth/google/callback'
  }, (accessToken, refreshToken, profile, cb) => {
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
    const user = { id: profile.id, name: profile.displayName, email };
    return cb(null, user);
  }
));

// 6. Routes
const appRoutes = require('./appRoutes');
app.use('/', appRoutes);

// Catch-all for Restaurant Slugs
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

// 7. Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${port}`);
});