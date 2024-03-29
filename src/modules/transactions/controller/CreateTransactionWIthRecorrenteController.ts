import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransactionWIthRecorrenteUseCase } from '../useCases/CreateTransactionWIthRecorrenteUseCase';

export class CreateTransactionWIthRecorrenteController {
   async handle(req: Request, res: Response): Promise<Response> {
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

      return res.status(201).json(result);
   }
}
