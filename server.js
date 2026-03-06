const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const Restaurant = require('./models/Restaurant');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const app = express();
const port = 3000;

// Connect to MongoDB (make sure you have a MongoDB instance running)
// Removed deprecated options `useNewUrlParser` and `useUnifiedTopology` —
// modern MongoDB driver / mongoose handle these automatically.
// Connect to MongoDB using connectDB module
connectDB();

// Set a permissive Content Security Policy for development so fonts and
// local assets can load. Adjust for production as needed.
app.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "font-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "connect-src 'self' http://localhost:3000 ws:",
    "img-src 'self' data:"
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
  next();
});

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session + Passport setup (requires GOOGLE_CLIENT_ID/SECRET in env)
app.use(session({ secret: process.env.SESSION_SECRET || 'site-sprout-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google OAuth strategy (use env vars for real credentials)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: process.env.GOOGLE_CALLBACK || 'http://localhost:3000/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => {
  // Minimal user object: include email if available
  const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
  const user = { id: profile.id, name: profile.displayName, email };
  return cb(null, user);
}));

// Multer setup for handling file uploads
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});
const upload = multer({ storage });

// Routes
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Auth routes for Google sign-in
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
  // After successful auth, check if user has an existing restaurant
  try {
    const email = req.user && req.user.email;
    if (!email) return res.redirect('/');
    const restaurant = await Restaurant.findOne({ ownerEmail: email }).lean();
    if (restaurant) {
      // existing user -> dashboard
      req.user.restaurantSlug = restaurant.slug;
      return res.redirect('/dashboard');
    }
    // first time -> send to admin builder
    return res.redirect('/admin');
  } catch (err) {
    return res.redirect('/');
  }
});

// Optional sign out
app.get('/logout', (req, res) => {
  req.logout?.();
  req.session?.destroy?.(() => res.redirect('/'));
});

app.get('/dashboard', (req, res) => {
  // Pass `req.user` through if authentication is present; otherwise pass empty object
  res.render('dashboard', { user: req.user || {} });
});

// Redirect root to the admin page to avoid 404 at '/'
app.get('/', (req, res) => {
  res.render('index');
});

// Debug route to return outgoing response headers (helps verify CSP)
app.get('/debug-headers', (req, res) => {
  res.json(res.getHeaders());
});

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

app.post('/create', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }, { name: 'heroImage', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, slug: rawSlug, description, themeColor, businessType, themeChoice, heroHeadline, heroSubheadline, openingHours, address, phone, instagram, facebook, menuJson } = req.body;

    // If files were uploaded, build the public paths
    let imageUrl = undefined;
    let logoUrl = undefined;
    let heroImageUrl = undefined;
    if (req.files) {
      if (req.files['image'] && req.files['image'][0]) imageUrl = `/uploads/${req.files['image'][0].filename}`;
      if (req.files['logo'] && req.files['logo'][0]) logoUrl = `/uploads/${req.files['logo'][0].filename}`;
      if (req.files['heroImage'] && req.files['heroImage'][0]) heroImageUrl = `/uploads/${req.files['heroImage'][0].filename}`;
    }

    // Server-side validation: name is required
    if (!name || !name.trim()) {
      return res.status(400).send('Restaurant name is required.');
    }

    // Generate slug from name when not provided
    const makeSlug = (s) => {
      return String(s)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace to hyphen
        .replace(/-+/g, '-'); // collapse multiple hyphens
    };

    let slug = rawSlug && String(rawSlug).trim();
    if (!slug) {
      slug = makeSlug(name);
    }

    // Ensure slug is present after generation
    if (!slug) {
      return res.status(400).send('Slug is required or could not be generated from name.');
    }

    // Build menu structure: prefer structured JSON from the client, fallback to legacy flat fields
    let menu = [];
    if (menuJson) {
      try {
        const parsed = JSON.parse(menuJson);
        if (Array.isArray(parsed)) menu = parsed;
      } catch (e) {
        // ignore parse errors and fallback
      }
    }

    // Legacy support: if no structured menu provided, try the old flat fields
    if (!menu.length && (req.body.menuName || req.body.menuPrice)) {
      const menuName = req.body.menuName; const menuPrice = req.body.menuPrice;
      if (Array.isArray(menuName)) {
        for (let i = 0; i < menuName.length; i++) {
          if (menuName[i]) {
            menu.push({ category: 'Mains', items: [{ name: menuName[i], price: Number(menuPrice[i] || 0) }] });
          }
        }
      } else if (menuName) {
        menu.push({ category: 'Mains', items: [{ name: menuName, price: Number(menuPrice || 0) }] });
      }
    }

    // Determine owner identifier (requires auth integration to populate `req.user`)
    const ownerEmail = (req.user && req.user.email) || (req.body && req.body.ownerEmail) || null;

    const newRestaurant = new Restaurant({
      name,
      slug,
      description,
      themeColor,
      businessType,
      themeChoice,
      hero: { headline: heroHeadline, subheadline: heroSubheadline, imageUrl: heroImageUrl },
      openingHours,
      address,
      phone,
      social: { instagram, facebook },
      menu,
      imageUrl,
      logoUrl,
      ownerEmail
    });

    await newRestaurant.save();
    res.redirect(`/${slug}`);
  } catch (error) {
    // Handle potential duplicate slug error
    if (error.code === 11000) {
      return res.status(400).send('Slug already exists.');
    }
    res.status(500).send('Server error');
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
