import { Context } from 'koa';
import { container } from 'tsyringe';
import { CreateTransaction } from './CreateTransactionUseCase';

interface ControllerRequest {
  description: string;
  value: number;
}

export class CreateTransactionsController {
  async handle(ctx: Context) {
    const { description, value } = ctx.request.body as ControllerRequest;
    const { email } = ctx.request.client;

    const useCase = container.resolve(CreateTransaction);
    const result = await useCase.execute({ description, value, email });

    ctx.status = 200;
    return (ctx.response.body = result);
  }
}
