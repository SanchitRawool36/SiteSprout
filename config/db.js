const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI not set — skipping DB connection.');
    return;
  }

  // Use a short server selection timeout to fail fast in serverless cold starts.
  return mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
    .then(() => console.log('MongoDB Atlas Connected for SiteSprout...'))
    .catch((err) => {
      console.error('Connection Error:', err && err.message ? err.message : err);
      // Do not throw or exit; allow the caller to handle a missing DB connection.
    });
};

module.exports = connectDB;
