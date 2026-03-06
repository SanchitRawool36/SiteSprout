const express = require('express');
const router = express.Router();
const Restaurant = require('./models/Restaurant');

// Admin Page
router.get('/admin', (req, res) => {
  res.render('admin');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

// Updated Creation Logic to handle JSON menu data
router.post('/create', async (req, res) => {
  try {
    const { name, slug, description, businessType, themeChoice, heroHeadline, phone, address, menuJson } = req.body;
    
    // Convert the JSON string from the form back into an array for MongoDB
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
      // Generate slug from name if user leaves it blank
      slug: slug || name.toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, ''),
      description,
      businessType,
      themeChoice,
      hero: { headline: heroHeadline },
      menu: parsedMenu, // Use the parsed JSON array
      phone,
      address,
      ownerEmail: req.user ? req.user.email : null
    });

    await newRestaurant.save();
    // Redirect to the newly created site on the live Render URL
    res.redirect(`https://sitesprout.onrender.com/${newRestaurant.slug}`);
  } catch (err) {
    console.error("Save Error:", err);
    // Specifically handle duplicate slug errors (Error 11000)
    if (err.code === 11000) {
      return res.status(400).send("This URL Slug is already taken. Please choose a different restaurant name.");
    }
    res.status(500).send("Error creating site. Please check the console.");
  }
});

module.exports = router;