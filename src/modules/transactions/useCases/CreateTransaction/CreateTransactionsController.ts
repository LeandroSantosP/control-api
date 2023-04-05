import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransaction } from './CreateTransactionUseCase';

export class CreateTransactionsController {
   async handle(req: Request, res: Response): Promise<Response> {
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

      return res.status(200).json(result);
   }
}
