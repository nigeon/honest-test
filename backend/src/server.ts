import config from './config';

import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as passport from 'koa-passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

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

// Configuring Authentication
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
};
passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    done(null, jwtPayload);
  }),
);

//Routes
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
