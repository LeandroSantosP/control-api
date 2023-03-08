import { Next } from 'koa';
import { container } from 'tsyringe';
import { ctxType } from '../../../../types/koaTypes';
import { CreateUserUseCase } from './CreateUserUseCase';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserController {
  async handle(ctx: ctxType, next: Next) {
    const { name, email, password } = ctx.request.body as CreateUserRequest;

    const newUser = container.resolve(CreateUserUseCase);
    const result = await newUser.execute({ email, name, password });

    ctx.status = 200;
    return (ctx.response.body = result);
  }
}
