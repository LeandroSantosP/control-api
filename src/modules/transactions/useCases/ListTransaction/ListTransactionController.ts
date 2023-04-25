import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { HTTPRequest } from '@/types/HTTPRequest';

export class ListTransactionController {
   async handle(req: Request, res: Response): Promise<HTTPRequest<any>> {
      const { id } = req.client;
      const { month } = req.query as {
         month: number | undefined;
      };

      const useCase = container.resolve(ListTransactionUseCase);
      const { transactions, monthBalense, balense } = await useCase.execute({
         user_id: id,
         month,
      });

      return {
         body: { monthBalense, balense, transactions },
         statusCode: 200,
         type: 'json',
      };
   }
}
