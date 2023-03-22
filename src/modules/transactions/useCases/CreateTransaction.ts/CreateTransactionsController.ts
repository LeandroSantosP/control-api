import { Request, Response } from 'express';
import { formatISO, parse } from 'date-fns';
import { container } from 'tsyringe';
import { CreateTransaction } from './CreateTransactionUseCase';

export class CreateTransactionsController {
   async handle(request: Request, response: Response): Promise<Response> {
      const { description, value, dueDate } = request.body;
      const { email } = request.client;

      const useCase = container.resolve(CreateTransaction);
      const result = await useCase.execute({
         description,
         value,
         email,
         dueDate,
      });

      return response.status(200).json(result);
   }
}
