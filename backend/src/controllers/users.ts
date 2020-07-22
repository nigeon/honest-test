import * as Koa from 'koa';
import * as Router from 'koa-router';
import { DefaultState, Context } from 'koa';
import * as passport from 'koa-passport';
import { getManager, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { classToClass } from 'class-transformer';

const routerOpts: Router.IRouterOptions = {
  prefix: '/users',
};
const router = new Router<DefaultState, Context>(routerOpts);

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

router.get('/:id', 
  passport.authenticate('jwt', { session: false }),
  async (ctx: Koa.Context) => {
    if (ctx.params.id !== ctx.state.user.id) {
      throw new Error('Only logged in users can get their account');
    }

    const userRepository: Repository<User> = getManager().getRepository(User);
    const user: User = await userRepository.findOneOrFail({
      where: { id: ctx.params.id },
    });

    ctx.body = {
      user: classToClass(user),
    };
});


export default router;
