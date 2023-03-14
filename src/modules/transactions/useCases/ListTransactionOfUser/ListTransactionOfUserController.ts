import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransactionsOfUserUseCase } from './ListTransactionOfUserUseCase';

export class ListTransactionOfUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.client;

    const useCase = container.resolve(ListTransactionsOfUserUseCase);
    const transaction = await useCase.execute(id);

    return res.status(200).json(transaction);
  }
}
