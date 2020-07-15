import * as Koa from 'koa';
import * as Router from 'koa-router';
import { getManager } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { classToClass } from 'class-transformer';

const routerOpts: Router.IRouterOptions = {
  prefix: '/users',
};
const router: Router = new Router(routerOpts);

router.post('/signup', async (ctx: Koa.Context) => {
  if (ctx.request.body.password !== undefined
    && ctx.request.body.password !== ctx.request.body.password2) {

    ctx.throw(400, 'Passwords must be the same!');
  }

  const user: User = await User.signup(ctx.request.body);

  ctx.body = {
    user: classToClass(user),
    token: User.getLoginToken(user),
  };
});

router.post('/login', async (ctx: Koa.Context) => {
  const user: User = await getManager()
    .createQueryBuilder(User, 'user')
    .addSelect('user.password')
    .where('user.email = :email', { email: ctx.request.body.email })
    .getOne();
  if (!user) {
    throw new Error('Could not find the user');
  }

  const match = await bcrypt.compare(ctx.request.body.password, user.password);
  if (!match) {
    throw new Error('Wrong Email/Password combination');
  }

  ctx.body = {
    user: classToClass(user),
    token: User.getLoginToken(user),
  };
});

export default router;
