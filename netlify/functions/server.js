const serverless = require('serverless-http');

// Lazily require and wrap the Express app so framework detection
// happens at invocation time rather than build/import time.
let handler = null;
module.exports.handler = async (event, context) => {
	try {
		if (!handler) {
			// require here to avoid possible build-time detection issues
			const path = require('path');
			const app = require(path.join(__dirname, '../../server'));
			handler = serverless(app);
		}
		return await handler(event, context);
	} catch (err) {
		console.error('Function wrapper error:', err && err.stack ? err.stack : err);
		return {
			statusCode: 500,
			body: 'Internal function initialization error'
		};
	}
};
