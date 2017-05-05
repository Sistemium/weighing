'use strict';
const views = require('co-views');
const parse = require('co-body');
const messages = [
  {
    id: 0,
    message: 'Koa next generation web framework for node.js'
  },
  {
    id: 1,
    message: 'Koa is a new web framework designed by the team behind Express'
  }
];

const render = views(__dirname + '/../views', {
  map: {html: 'swig'}
});

const request = require('request-promise');

module.exports.home = function *home(ctx) {
  this.body = yield render('list', {'messages': messages});
};

module.exports.list = function *list() {
  this.body = yield messages;
};

module.exports.fetch = function *fetch(id) {
  const message = messages[id];
  if (!message) {
    this.throw(404, 'message with id = ' + id + ' was not found');
  }
  this.body = yield message;
};

module.exports.create = function *create() {
  const message = yield parse(this);
  const id = messages.push(message) - 1;
  message.id = id;
  this.body = message;
};

function asyncOperation() {
  return request({
    uri: 'http://localhost:9090/api/dev/article',
    headers: {
      authorization: process.env.ACCESS_TOKEN
    }
  });
}

const returnsPromise = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => resolve('promise resolved after 2 seconds'), 2000));

module.exports.delay = function *delay() {
  try {
    this.body = yield asyncOperation();
  } catch (err) {
    this.throw(err);
  }
};

module.exports.promise = function *promise() {
  this.body = yield returnsPromise();
};
