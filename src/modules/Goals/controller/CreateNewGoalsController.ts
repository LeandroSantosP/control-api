import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateNewGoalsUseCase } from '../useCases/CreateNewGoalsUseCase';

export class CreateNewGoalsController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { expectated_expense, expectated_revenue, month } = req.body;
      const { id } = req.client;

      await container.resolve(CreateNewGoalsUseCase).execute({
         user_id: id,
         expectated_expense,
         expectated_revenue,
         month,
      });

      return res.status(201).send();
   }
}
