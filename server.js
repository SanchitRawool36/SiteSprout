const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// 2. Middleware & View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// 3. Session & Passport (Required for Google Login)
app.use(session({
  secret: 'sitesprout_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// 4. Import and use your Routes
const appRoutes = require('./appRoutes');
app.use('/', appRoutes);

// 5. Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is live on port ${port}`);
});