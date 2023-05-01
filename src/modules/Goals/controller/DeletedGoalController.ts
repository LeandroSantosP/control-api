import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeletedGoalsUseCase } from '../useCases/DeletedGoalsUseCase';

export class DeletedGoalsController {
   async execute(req: Request, res: Response): Promise<Response> {
      const { id } = req.client;
      const { months } = req.body;

      const useCase = container.resolve(DeletedGoalsUseCase);
      await useCase.execute({
         user_id: id,
         goals_id_or_months: months,
      });

      return res.status(201).send();
   }
}
