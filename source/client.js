exports.client = require('redis').createClient(process.env.REDIS_URL);
