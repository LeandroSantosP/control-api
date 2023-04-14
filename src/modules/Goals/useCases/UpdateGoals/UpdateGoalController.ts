import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateGoalsUseCase } from './UpdateGoalsUseCase';

export class UpdatedGoalsController {
   async handle(req: Request, res: Response) {
      const {
         createIfNotExist,
         expectated_expense,
         expectated_revenue,
         dataForUpdate,
         goal_id,
      } = req.body;
      const { id } = req.client;

      const useCase = container.resolve(UpdateGoalsUseCase);
      const response = await useCase.execute({
         user_id: id,
         createIfNotExist,
         expectated_expense,
         expectated_revenue,
         dataForUpdate,
         goal_id,
      });
      return res.status(201).json(response);
   }
}
