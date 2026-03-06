const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  themeColor: String,
  businessType: {
    type: String,
    enum: ['Cafe', 'Restaurant', 'FastFood'],
    default: 'Restaurant'
  },
  imageUrl: String,
  logoUrl: String,
  hero: {
    headline: String,
    subheadline: String,
    imageUrl: String
  },
  themeChoice: String,
  social: {
    instagram: String,
    facebook: String
  },
  openingHours: String,
  address: String,
  phone: String,
  gallery: [String],
  // Menu as categorized structure
  menu: [{
    category: String,
    items: [{
      name: String,
      price: Number,
      description: String
    }]
  }],
  ownerEmail: String
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
