const redis = require('redis');
const client = redis.createClient({ db: 1 });
const { getId, getAllTasks, getTask } = require('./dataStore');
const DEFAULT = 'TODO';
const statusCounts = 3;

const hasFields = function (...fields) {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send('bad request');
  };
};

const logger = (req, res, next) => {
  console.log(req.method, req.path);
  next();
};

const addItem = async (req, res) => {
  const id = await getId(client);
  const task = { title: req.body.title, status: 0, id };
  client.hset('tasks', `${id}`, JSON.stringify(task), () => res.send('OK'));
};

const changeStatus = async (req, res) => {
  const { id } = req.body;
  const task = await getTask(client, id);
  task.status = (task.status + 1) % statusCounts;
  client.hset('tasks', `${id}`, JSON.stringify(task), () => res.send('OK'));
};

const clearItems = (req, res) => client.del('tasks', () => res.send('OK'));
const serveTodoItems = async (req, res) => res.json(await getAllTasks(client));
const deleteItem = (req, res) => client.hdel('tasks', `${req.body.id}`, () => res.send('OK'));
const editHeading = (req, res) => client.set('heading', req.body.heading, () => res.send('OK'));
const serveHeading = (req, res) => client.get('heading', (err, heading) => res.json({ heading }));
const resetHeading = (req, res) => client.set('heading', DEFAULT, () => res.send('OK'));

module.exports = {
  hasFields,
  logger,
  addItem,
  clearItems,
  deleteItem,
  editHeading,
  changeStatus,
  serveHeading,
  resetHeading,
  serveTodoItems
};
