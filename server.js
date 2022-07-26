// https://github.com/feathersjs-ecosystem/feathers-sequelize#example

const path = require('path');
const Sequelize = require('sequelize');
const service = require('feathers-sequelize');
const app = require('./app');
const attributes = require('./db_attributes');

const orm = new Sequelize('sequelize', '', '', {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'db.sqlite'),
  logging: false
});
const Model = orm.define('todo', attributes, {
  freezeTableName: true
});
// Create an in-memory Feathers service with a default page size of 2 items
// and a maximum size of 4
app.use('/todos', service({
  Model: Model,
  // paginate: {
  //   default: 10,
  //   max: 100
  // }
}));

Model.sync({ alter: true })
// .then(() => {
//   Create a dummy Todo
//   app.service('todos').create({
//     text: 'Todo created on server'
//   }).then(todo => console.log('Created todo', todo));
// })
;

// Start the server
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});