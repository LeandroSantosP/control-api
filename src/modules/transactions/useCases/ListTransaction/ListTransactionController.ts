import { AppError } from '@/shared/infra/middleware/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransactionUseCase } from './ListTransactionUseCase';

export class ListTransactionController {
   async handle(req: Request, res: Response) {
      const { id } = req.client;
      const { month } = req.query as { month: number | undefined };

      const useCase = container.resolve(ListTransactionUseCase);
      const { transactions, monthBalense, balense } = await useCase.execute(
         id,
         month
      );

      return res.status(200).json({ monthBalense, balense, transactions });
   }
}
