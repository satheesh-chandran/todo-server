const redis = require('redis');
const { env } = process;
const { REDIS_URL } = env;
const options = { db: 1, url: REDIS_URL || null };
const client = redis.createClient(options);

exports.client = client;
