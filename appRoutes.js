const express = require('express');
const router = express.Router();
const passport = require('passport');
const Restaurant = require('./models/Restaurant');

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

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

// --- SITE CREATION LOGIC ---
// Fixes "Error creating site" by properly parsing data
router.post('/create', async (req, res) => {
  try {
    const { name, slug, description, businessType, themeChoice, heroHeadline, phone, address, menuJson } = req.body;
    
    let parsedMenu = [];
    if (menuJson) {
      try {
        parsedMenu = JSON.parse(menuJson);
      } catch (e) {
        console.error("Menu parse error:", e);
      }
    }

    const newRestaurant = new Restaurant({
      name,
      // Cleans the slug to ensure MongoDB doesn't reject it
      slug: (slug || name).toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, ''),
      description,
      businessType,
      themeChoice,
      hero: { headline: heroHeadline },
      menu: parsedMenu,
      phone,
      address,
      ownerEmail: req.user ? req.user.email : null
    });

    await newRestaurant.save();
    // Redirect to the newly created dynamic site
    res.redirect(`/${newRestaurant.slug}`);
  } catch (err) {
    console.error("Save Error:", err);
    if (err.code === 11000) {
      return res.status(400).send("This URL Slug is already taken. Try a different name.");
    }
    res.status(500).send("Error creating site. Please check the Render logs.");
  }
});

module.exports = router;