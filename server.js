const app = require('./source/routes');
const { stdout, env } = process;
const PORT = env.PORT || 8000;

app.listen(PORT, () => stdout.write(`listening on port ${PORT}...\n`));
