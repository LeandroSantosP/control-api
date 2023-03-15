import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransactionUseCase } from './ListTransactionUseCase';

export class ListTransactionController {
  async handle(req: Request, res: Response) {
    const { id } = req.client;

    const useCase = container.resolve(ListTransactionUseCase);
    const { transactions } = await useCase.execute(id);

    return res.status(200).json(transactions);
  }
}
