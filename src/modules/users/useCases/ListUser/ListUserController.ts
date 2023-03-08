import { Context, Next } from 'koa';
import { container } from 'tsyringe';
import { UserEntity } from '../../infra/Entity/UserEntity';
import { ListUSerUseCase } from './LIstUserUseCase';

export class ListUserController {
  async handle(ctx: Context, next: Next): Promise<UserEntity[]> {
    const useCase = container.resolve(ListUSerUseCase);
    const ListOfUsers = await useCase.execute();

    ctx.status = 200;
    return (ctx.body = ListOfUsers);
  }
}
