'use strict';
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-router')();
const cors = require('koa-cors');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();
const port = process.env.PORT || 3000;

// Logger
app.use(logger());

app.use(cors({origin: '*'}));

const messages = require('./controllers/messages');
const weighing = require('./controllers/weighing');

route
  .get('/', messages.home)
  .get('/weighing', weighing.list)
  .get('/messages', messages.list)
  .get('/messages/:id', messages.fetch)
  .post('/messages', messages.create)
  .get('/async', messages.delay)
  .get('/promise', messages.promise);

app.use(route.routes());

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Compress
app.use(compress());

if (!module.parent) {
  app.listen(port);
  console.log(`listening on port ${port}`);
}
