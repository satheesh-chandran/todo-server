const redis = require('redis');
const client = redis.createClient({ db: 1 });
const { getId, getAllTasks, getTask, getHeading } = require('./dataStore');
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

const addItem = (req, res) =>
  getId(client).then(id => {
    const task = JSON.stringify({ title: req.body.title, status: 0, id });
    client.hset('tasks', `${id}`, task, () => res.send('OK'));
  });

const changeStatus = (req, res) => {
  const { id } = req.body;
  getTask(client, id).then(task => {
    task.status = (task.status + 1) % statusCounts;
    client.hset('tasks', `${id}`, JSON.stringify(task), () => res.send('OK'));
  });
};

const clearItems = (req, res) => client.del('tasks', () => res.send('OK'));

const serveTodoItems = (req, res) =>
  getAllTasks(client).then(data => res.json(data));

const serveHeading = (req, res) =>
  getHeading(client).then(data => res.json(data));

const resetHeading = (req, res) =>
  client.set('heading', DEFAULT, () => res.send('OK'));

const deleteItem = (req, res) =>
  client.hdel('tasks', `${req.body.id}`, () => res.send('OK'));

const editHeading = (req, res) =>
  client.set('heading', req.body.heading, () => res.send('OK'));

module.exports = {
  hasFields,
  addItem,
  clearItems,
  deleteItem,
  editHeading,
  changeStatus,
  serveHeading,
  resetHeading,
  serveTodoItems
};
