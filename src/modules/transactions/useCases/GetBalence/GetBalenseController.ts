import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetBalenseUseCase } from './GetBalenseUseCase';

export class GetBalenseController {
   async handle(req: Request, res: Response) {
      const { id } = req.client;

      console.log(id);

      const useCase = container.resolve(GetBalenseUseCase);
      const result = await useCase.execute({ user_id: id });

      return res.status(200).json(result);
   }
}
