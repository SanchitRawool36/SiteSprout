const express = require('express');
const router = express.Router();
const Restaurant = require('./models/Restaurant');

// Home Page
router.get('/', (req, res) => {
  res.render('index');
});

// Admin Page
router.get('/admin', (req, res) => {
  res.render('admin');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

// Creation Logic
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
      slug: slug || name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, ''),
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
    res.redirect(`https://sitesprout.onrender.com/${newRestaurant.slug}`);
  } catch (err) {
    console.error("Save Error:", err);
    if (err.code === 11000) {
      return res.status(400).send("Error: This URL Slug is already taken.");
    }
    res.status(500).send("Error creating site.");
  }
});

module.exports = router;