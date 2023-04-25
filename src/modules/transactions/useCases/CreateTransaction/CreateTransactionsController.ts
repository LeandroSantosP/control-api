import { HTTPRequest } from '@/types/HTTPRequest';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransaction } from './CreateTransactionUseCase';

export class CreateTransactionsController {
   async handle(req: Request, res: Response): Promise<HTTPRequest<any>> {
      const { description, value, dueDate, categoryType, filingDate } =
         req.body;
      const { email } = req.client;

      const useCase = container.resolve(CreateTransaction);
      const result = await useCase.execute({
         description,
         value,
         email,
         dueDate,
         categoryType,
         filingDate,
      });

      return {
         body: result,
         statusCode: 200,
         type: 'json',
      };
   }
}
