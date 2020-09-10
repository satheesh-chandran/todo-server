const getId = function (client) {
  return new Promise((resolve, reject) => {
    client.incr('curr_id', (err, id) => {
      if (err) {
        reject(err);
      }
      resolve(id);
    });
  });
};

const getAllTasks = function (client) {
  return new Promise((resolve, reject) => {
    client.hvals('tasks', (err, tasks) => {
      if (err) {
        reject(err);
      }
      const taskList = tasks ? tasks.map(JSON.parse) : [];
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

const getHeading = function (client) {
  return new Promise((resolve, reject) => {
    client.get('heading', (err, heading) => {
      if (err) {
        reject(err);
      }
      const head = heading ? { heading } : { heading: 'TODO' };
      resolve(head);
    });
  });
};

const setHeading = function (client, heading) {
  return new Promise((resolve, reject) => {
    client.set('heading', heading, () => resolve({ status: true }));
  });
};

module.exports = { getId, getAllTasks, getTask, getHeading, setHeading };
