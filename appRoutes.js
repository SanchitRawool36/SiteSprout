const express = require('express');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example placeholder route — move your existing routes here if desired
router.get('/example', (req, res) => {
  res.send('Example route from appRoutes');
});

module.exports = router;
