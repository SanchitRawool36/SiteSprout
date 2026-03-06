const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Uses the URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected for SiteSprout...");
  } catch (err) {
    console.error("Connection Error:", err.message);
    // Do not call process.exit() inside a serverless function import —
    // allow the caller to handle transient connection failures.
    // Return so imports won't forcefully terminate the runtime.
    return;
  }
};

module.exports = connectDB;
