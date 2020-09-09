const express = require('express');
const app = express();

const {
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
} = require('./handler');

app.use(express.json());

app.use(logger);

app.get('/api/heading', serveHeading);
app.get('/api/clearItems', clearItems);
app.get('/api/resetHeading', resetHeading);
app.get('/api/getAllItems', serveTodoItems);
app.post('/api/addItem', hasFields('title'), addItem);
app.post('/api/editHeading', hasFields('heading'), editHeading);
app.post('/api/deleteItem', hasFields('id'), deleteItem);
app.post('/api/changeStatus', hasFields('id'), changeStatus);

module.exports = app;
