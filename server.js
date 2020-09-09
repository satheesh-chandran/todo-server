const redis = require('redis');
const { stdout, env } = process;
const app = require('./source/routes');
const client = redis.createClient({ db: 1 });
const PORT = env.PORT || 8000;
const DEFAULT = 'TODO';

client.set('heading', DEFAULT, () => {
  app.listen(PORT, () => stdout.write(`listening on port ${PORT}...\n`));
});
