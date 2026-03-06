const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Uses the URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected for SiteSprout...");
  } catch (err) {
    console.error("Connection Error:", err.message);
    process.exit(1); // Stop the app if connection fails
  }
};

module.exports = connectDB;
