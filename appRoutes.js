const express = require('express');
const router = express.Router();
const passport = require('passport');
const Restaurant = require('./models/Restaurant');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// --- GOOGLE AUTHENTICATION ---
// This handles the "Cannot GET /auth/google" error
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// This handles the Redirect URI from your Google screenshot
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout logic
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// --- PAGE NAVIGATION ---
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/dashboard', async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/google');
  }
  try {
    const restaurant = await Restaurant.findOne({ ownerEmail: req.user.email });
    res.render('dashboard', { user: req.user, restaurant: restaurant });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).send("Server Error");
  }
});

// --- SITE CREATION LOGIC ---
router.post('/create', upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]), async (req, res) => {
  try {
    // 1. Log the data to see exactly what Render is receiving
    console.log("Data received from form:", req.body);
    console.log("Files received:", req.files);

    const { name, slug, description, businessType, themeChoice, themeColor, hero, phone, address, menuJson, openingHours, social } = req.body;
    
    // 2. Safety Check: If name is missing, don't try to run .toLowerCase()
    if (!name) {
      return res.status(400).send("Error: Restaurant Name is required.");
    }

    let parsedMenu = [];
    if (menuJson) {
      try {
        parsedMenu = JSON.parse(menuJson);
      } catch (e) {
        console.error("Menu parse error:", e);
      }
    }

    // 3. Safe Slug Generation
    const finalSlug = (slug || name).toString().toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
    
    const heroImageUrl = req.files['heroImage'] ? '/' + req.files['heroImage'][0].path.replace(/\\/g, "/") : '';
    const galleryImageUrls = req.files['gallery'] ? req.files['gallery'].map(file => '/' + file.path.replace(/\\/g, "/")) : [];

    const newRestaurant = new Restaurant({
      name,
      slug: finalSlug,
      description,
      businessType,
      themeChoice,
      themeColor,
      hero: {
          headline: hero ? hero.headline : '',
          subheadline: hero ? hero.subheadline : '',
          imageUrl: heroImageUrl
      },
      menu: parsedMenu,
      gallery: galleryImageUrls,
      openingHours,
      phone,
      address,
      social,
      ownerEmail: req.user ? req.user.email : null
    });

    await newRestaurant.save();
    res.redirect(`/${newRestaurant.slug}`);
  } catch (err) {
    console.error("Save Error Details:", err);
    if (err.code === 11000) {
      return res.status(400).send("This URL Slug is already taken.");
    }
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
