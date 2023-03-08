import { Context } from 'koa';
import { container } from 'tsyringe';
import { SessionUseCase } from './SessionUseCase';

/* test 2 */

export class SessionController {
  async handle(ctx: Context) {
    const authenticationBase64 = ctx.request.headers.authorization;

    const Authentication = container.resolve(SessionUseCase);
    const credentials = await Authentication.execute({ authenticationBase64 });

    ctx.status = 200;
    return (ctx.response.body = credentials);
  }
}
