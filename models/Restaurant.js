const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    slug: { type: String, unique: true },
    businessType: { type: String, enum: ['Cafe', 'Restaurant', 'QSR'] }, // Theme Logic
    themeType: { type: String }, // e.g. 'Modern Cafe' or 'Luxury Restro'
    heroHeadline: String,
    menu: [{ item: String, price: Number, description: String }],
    contact: { phone: String, address: String, instagram: String }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
