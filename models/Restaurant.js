const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    ownerEmail: String,
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    businessType: { type: String, enum: ['Restaurant', 'Cafe', 'FastFood', 'QSR'] }, 
    themeChoice: String,
    hero: { headline: String, subheadline: String, imageUrl: String },
    phone: String,
    address: String,
    themeColor: { type: String, default: '#0a63d3' }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);