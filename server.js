const app = require('./source/routes');
const { stdout, env } = process;
const { PORT } = env;

app.listen(PORT, () => stdout.write(`listening on port ${PORT || 8000}...\n`));
