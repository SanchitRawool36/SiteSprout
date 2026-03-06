const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    businessType: String,
    themeChoice: String,
    hero: { headline: String },
    menu: { type: Array, default: [] }, // MUST be defined for the JSON builder
    phone: String,
    address: String,
    ownerEmail: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);