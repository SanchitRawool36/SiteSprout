const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    ownerEmail: { type: String },
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: String,
    businessType: { type: String, enum: ['Restaurant', 'Cafe', 'FastFood', 'QSR'] }, 
    themeChoice: { type: String }, // Used for "Elite Restro" vs "Cozy Cafe" logic
    hero: {
        headline: String,
        subheadline: String,
        imageUrl: String
    },
    menu: [{
        category: String,
        items: [{ 
            name: String, 
            price: Number, 
            description: String 
        }]
    }],
    phone: String,
    address: String,
    social: {
        instagram: String,
        facebook: String
    },
    themeColor: { type: String, default: '#0a63d3' },
    logoUrl: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);