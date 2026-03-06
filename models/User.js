const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, index: true, unique: true },
  displayName: String,
  firstName: String,
  lastName: String,
  email: String,
  photo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
