const serverless = require('serverless-http');
const path = require('path');
// require the app (server.js exports the express app)
const app = require(path.join(__dirname, '../../server'));

module.exports.handler = serverless(app);
