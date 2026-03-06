const express = require('express');
const router = express.Router();
const Restaurant = require('./models/Restaurant');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Admin Page
router.get('/admin', (req, res) => {
  res.render('admin');
});

// Dashboard Page
router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

// Create Restaurant Site
router.post('/create', async (req, res) => {
  try {
    const { name, slug, description, businessType, themeChoice, heroHeadline, phone, address } = req.body;
    
    const newRestaurant = new Restaurant({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-'),
      description,
      businessType,
      themeChoice,
      hero: { headline: heroHeadline },
      phone,
      address,
      ownerEmail: req.user ? req.user.email : null
    });

    await newRestaurant.save();
    res.redirect(`/${newRestaurant.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating site. Check if slug is unique.");
  }
});

module.exports = router;