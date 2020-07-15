import config from './config';

import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

const cors = require('@koa/cors');

import usersController from './controllers/users';

const PORT: number = Number(config.PORT);
const app = new Koa();

app.use(bodyParser());
app.use(cors());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    if (config.DEBUG) {
      global.console.log(ctx.method, ctx.url);
    }
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

app.use(usersController.routes());
app.use(usersController.allowedMethods());

app.on('error', global.console.error);

import databaseConnection from './database/database.connection';
(async () => {
  await databaseConnection;
})();

app.listen(PORT, () => {
  global.console.log('Server listening on port', PORT);
});
