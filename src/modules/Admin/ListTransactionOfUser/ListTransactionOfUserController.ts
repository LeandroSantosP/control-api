import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransactionsOfUserUseCase } from './ListTransactionOfUserUseCase';

export class ListTransactionOfUserController {
  async handle(req: Request, res: Response) {
    const { user_id } = req.params;

    const useCase = container.resolve(ListTransactionsOfUserUseCase);
    const transaction = await useCase.execute(user_id);

    return res.status(200).json(transaction);
  }
}
