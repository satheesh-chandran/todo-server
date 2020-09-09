const getId = function (client) {
  return new Promise((resolve, reject) => {
    client.incr('curr_id', (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

const getAllTasks = function (client) {
  return new Promise((resolve, reject) => {
    client.hvals('tasks', (err, tasks) => {
      if (err) {
        reject(err);
      }
      const taskList = tasks ? tasks.map(task => JSON.parse(task)) : [];
      resolve(taskList);
    });
  });
};

const getTask = function (client, id) {
  return new Promise((resolve, reject) => {
    client.hget('tasks', `${id}`, (err, task) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(task));
    });
  });
};

module.exports = { getId, getAllTasks, getTask };
