const {
  getId,
  getAllTasks,
  getTask,
  getHeading,
  setHeading
} = require('./dataStore');
const { client } = require('./client');

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

const deleteItem = (req, res) => client.hdel('tasks', `${req.body.id}`, () => res.send('OK'));

const serveTodoItems = (req, res) => getAllTasks(client).then(items => res.json(items));

const serveHeading = (req, res) => getHeading(client).then(head => res.json(head));

const resetHeading = (req, res) => setHeading(client, DEFAULT).then(status => res.json(status));

const editHeading = (req, res) => setHeading(client, req.body.heading).then(status => res.json(status));

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
