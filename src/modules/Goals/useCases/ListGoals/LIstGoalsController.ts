import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListGoalsUseCase } from './ListGoalsUseCase';

export class ListGoalsController {
   async handle(req: Request, res: Response) {
      const { id } = req.client;

      const useCase = container.resolve(ListGoalsUseCase);
      const result = await useCase.execute(id);

      return res.status(200).json(result);
   }
}
