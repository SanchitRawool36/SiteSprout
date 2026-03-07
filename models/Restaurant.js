const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    businessType: String,
    themeChoice: String,
    themeColor: { type: String, default: '#333' },
    hero: {
        headline: String,
        subheadline: String,
        imageUrl: String
    },
    logoUrl: String,
    menu: { type: Array, default: [] },
    gallery: [String],
    openingHours: String,
    phone: String,
    address: String,
    social: {
        instagram: String,
        facebook: String
    },
    ownerEmail: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);