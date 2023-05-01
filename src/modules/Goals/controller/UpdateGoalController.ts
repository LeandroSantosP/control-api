import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateGoalsUseCase } from '../useCases/UpdateGoalsUseCase';

export class UpdatedGoalsController {
   async handle(req: Request, res: Response): Promise<Response> {
      const {
         createIfNotExist,
         expectated_expense,
         expectated_revenue,
         dataForUpdate,
         goal_id,
      } = req.body;
      const { id } = req.client;

      let formattedParams: any = { user_id: id };

      if (dataForUpdate === undefined) {
         formattedParams = {
            ...formattedParams,
            expectated_expense,
            expectated_revenue,
            goal_id,
         };
      } else {
         formattedParams = {
            ...formattedParams,
            createIfNotExist,
            expectated_expense,
            expectated_revenue,
            dataForUpdate,
         };
      }

      const useCase = container.resolve(UpdateGoalsUseCase);
      const response = await useCase.execute({ ...formattedParams });
      return res.status(201).json(response);
   }
}
