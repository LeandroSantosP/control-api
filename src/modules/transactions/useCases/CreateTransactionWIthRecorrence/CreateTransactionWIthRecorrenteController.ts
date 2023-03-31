import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransactionWIthRecorrenteUseCase } from './CreateTransactionWIthRecorrenteUseCase';
import { log } from 'node:console';

export class CreateTransactionWIthRecorrenteController {
   async handle(req: Request, res: Response) {
      const {
         description,
         value,
         due_date,
         categoryType,
         isSubscription,
         recurrence,
         installments,
      } = req.body;
      const { email } = req.client;

      const useCase = container.resolve(CreateTransactionWIthRecorrenteUseCase);
      const result = await useCase.execute({
         email,
         description,
         value,
         due_date,
         categoryType,
         isSubscription,
         recurrence,
         installments,
      });

      return res.status(200).json(result);
   }
}
