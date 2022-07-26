// https://jestjs.io/docs/testing-frameworks#expressjs
// const supertest = require('supertest');

// https://www.npmjs.com/package/sequelize-mock
const SequelizeMock = require('sequelize-mock');
// https://www.npmjs.com/package/feathers-memory
const service = require('feathers-memory');
const request = require("supertest");
const app = require('./app');
// const attributes = require('./db_attributes');

const orm = new SequelizeMock();

const Todo = orm.define('todo', {
  'title': '',
  'completed': false,
  'due': ''
});

app.use('todos', service({
  Model: Todo,
  events: ['testing'],
  // paginate: {
  //   default: 2,
  //   max: 4
  // }
}));

describe("Test the root path", () => {
  test("It should response the POST method", async () => {
    const todo = await app.service('todos').create({
      title: 'Some title',
      completed: false,
      due: '2022-09-23T15:40:37.565Z'
    });
    expect(todo.title).toBe('Some title');
  });
  test("It should throw the POST method", async () => {
    const response = await app.service('todos').create({
      title: 'Some title',
      completed: false,
      due: '2022-09-23T15:40:37.565Z REMOVE'
    });
    expect(response.statusCode).toBe(400);
  });
  test("It should response the GET method", async () => {
    const response =  await request(app).get("/todos");
    expect(response.statusCode).toBe(200);
  });
  test("It should response the GET method", async () => {
    const response =  await request(app).get("/todos/1");
    expect(response.statusCode).toBe(404);
  });
});