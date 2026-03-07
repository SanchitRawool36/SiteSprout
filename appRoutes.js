const express = require('express');
const router = express.Router();
const passport = require('passport');
const Restaurant = require('./models/Restaurant');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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


router.get('/admin', async (req, res) => {
  try {
    const { slug } = req.query;
    let restaurant = null;
    if (slug) {
      restaurant = await Restaurant.findOne({ slug });
      if (!restaurant) {
        // Optional: handle case where a slug is provided but no restaurant is found
        return res.status(404).send('Restaurant not found');
      }
    }
    res.render('admin', { restaurant });
  } catch (error) {
    console.error("Admin route error:", error);
    res.status(500).send("Server Error");
  }
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

// --- SITE UPDATE LOGIC ---
router.post('/update', upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]), async (req, res) => {
  try {
    const { restaurantId, name, slug, description, businessType, themeChoice, themeColor, hero, phone, address, menuJson, openingHours, social } = req.body;

    if (!restaurantId) {
      return res.status(400).send("Error: Restaurant ID is missing.");
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send("Restaurant not found.");
    }

    // Basic fields
    restaurant.name = name;
    restaurant.slug = (slug || name).toString().toLowerCase().split(' ').join('-').replace(/[^\w-]+/g, '');
    restaurant.description = description;
    restaurant.businessType = businessType;
    restaurant.themeChoice = themeChoice;
    restaurant.themeColor = themeColor;
    restaurant.openingHours = openingHours;
    restaurant.phone = phone;
    restaurant.address = address;
    
    if (social) {
      restaurant.social = {
        instagram: social.instagram,
        facebook: social.facebook
      };
    }

    if (hero) {
        restaurant.hero.headline = hero.headline;
        restaurant.hero.subheadline = hero.subheadline;
    }

    // Image fields
    if (req.files['heroImage']) {
      restaurant.hero.imageUrl = '/' + req.files['heroImage'][0].path.replace(/\\/g, "/");
    }
    if (req.files['gallery'] && req.files['gallery'].length > 0) {
      const newImageUrls = req.files['gallery'].map(file => '/' + file.path.replace(/\\/g, "/"));
      restaurant.gallery = [...restaurant.gallery, ...newImageUrls];
    }
    
    // Handle removed images
    if (req.body.removedImages) {
      const imagesToRemove = req.body.removedImages.split(',');
      restaurant.gallery = restaurant.gallery.filter(img => !imagesToRemove.includes(img));
      
      // Optional: Delete files from server
      imagesToRemove.forEach(imgUrl => {
        if (imgUrl) {
          const imagePath = path.join(__dirname, '..', imgUrl);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Failed to delete image: ${imagePath}`, err);
            }
          });
        }
      });
    }

    // Menu
    if (menuJson) {
      try {
        restaurant.menu = JSON.parse(menuJson);
      } catch (e) {
        console.error("Menu parse error during update:", e);
      }
    }

    await restaurant.save();
    res.redirect(`/${restaurant.slug}`);

  } catch (err) {
    console.error("Update Error Details:", err);
    if (err.code === 11000) {
      return res.status(400).send("This URL Slug is already taken.");
    }
    res.status(500).send("Server Error: " + err.message);
  }
});

// --- SITE DELETE LOGIC ---
router.get('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }

    // Delete associated images
    const imagesToDelete = [];
    if (restaurant.hero && restaurant.hero.imageUrl) {
      imagesToDelete.push(restaurant.hero.imageUrl);
    }
    if (restaurant.gallery && restaurant.gallery.length > 0) {
      imagesToDelete.push(...restaurant.gallery);
    }

    imagesToDelete.forEach(imgUrl => {
      if (imgUrl) {
        const imagePath = path.join(__dirname, '..', imgUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Failed to delete image: ${imagePath}`, err);
            }
          });
        }
      }
    });

    await Restaurant.findByIdAndDelete(id);

    res.redirect('/dashboard');
  } catch (err) {
    console.error("Delete Error Details:", err);
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
