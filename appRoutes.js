const express = require('express');
const router = express.Router();
const passport = require('passport');
const Restaurant = require('./models/Restaurant');

// --- AUTH ROUTES ---
// Starts the Google Login process
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handles the return from Google
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// --- PAGE ROUTES ---
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

// --- CREATION LOGIC ---
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
      // Fixed: cleaning the slug to prevent database errors
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
    res.redirect(`/${newRestaurant.slug}`);
  } catch (err) {
    console.error("Detailed Save Error:", err);
    if (err.code === 11000) {
      return res.status(400).send("Error: This URL Slug is already taken. Try a different name.");
    }
    res.status(500).send("Error creating site. Please check the Render logs.");
  }
});

module.exports = router;