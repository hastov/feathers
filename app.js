const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const { BadRequest } = require('@feathersjs/errors');
const { isDate, hasPassed } = require('./utils');

// Create an Express compatible Feathers application instance.
const app = express(feathers());

// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());

app.use(express.errorHandler());

// https://docs.feathersjs.com/api/hooks.html
app.hooks({
  before: {
    create: [async context => {
      if (!(isDate(context.data.due))) {
        throw new BadRequest(`${context.data.due} is not a valid date`, {
          errors: { due: 'Not a valid date' }
        });
      }
      return context;
    }],
  },
  after: {
    // post /:id
    create: [async context => {
      context.result.expired = hasPassed(new Date(context.result.due));
      return context;
    }],
    // get /:id
    get: [async context => {
      context.result.expired = hasPassed(new Date(context.result.due));
      return context;
    }],
    // get /
    find: [async context => {
      context.result.forEach(todo => { todo.expired = hasPassed(new Date(todo.due)) });
      return context;
    }],
    // patch /:id
    patch: [async context => {
      context.result.expired = hasPassed(new Date(context.result.due));
      return context;
    }],
  },
  error: {
    create: [async context => {
      if (context.error.className == 'bad-request') {
        context.error.statusCode = 400;
      }
      return context;
    }],
    get: [async context => {
      if (context.result == undefined) {
        context.error.statusCode = 404; // context.statusCode = 404; Still returns 500
      }
      return context;
    }],
  }
});
// app.service('todos').hooks({
//   before: {
//     // create: [async context => {
//     //   if (!(isDate(context.data.due))) {
//     //     throw new BadRequest('due is not a valid date', {
//     //       errors: { due: 'Not a valid date' }
//     //     });
//     //   }
//     //   return context;
//     // }],
//     get: [context => {
//       context.data.expired = hasPassed(new Date(context.data.due));
//       console.log(`HERE ${context.data.expired}`);
//       return context;
//     }],
//   },
// });

module.exports = app;