const express = require('express');
const router = express.Router();
const Restaurant = require('./models/Restaurant');

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { user: req.user || {} });
});

router.post('/create', async (req, res) => {
  try {
    const { name, slug, description, businessType, themeChoice, heroHeadline, phone, address } = req.body;
    const newRestaurant = new Restaurant({
      name,
      slug: slug || name.toLowerCase().split(' ').join('-'),
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
    res.status(500).send("Error creating site. Ensure the slug is unique.");
  }
});

module.exports = router;