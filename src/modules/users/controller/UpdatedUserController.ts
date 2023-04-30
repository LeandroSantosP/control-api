import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdatedUserUseCase } from '../useCases/UpdatedUserUseCase';

export class UpdatedUserController {
   async handle(req: Request, res: Response) {
      const { email: emailForUpdated, password, name } = req.body;
      const { id, email } = req.client;

      const useCase = container.resolve(UpdatedUserUseCase);

      const result = await useCase.execute({
         email,
         user_id: id,
         data_for_updated: { email: emailForUpdated, password, name },
      });

      return res.status(200).json(result);
   }
}
