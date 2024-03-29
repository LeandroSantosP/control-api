import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteUserUseCase } from '../useCases/DeleteUserUseCase';

export class DeleteUserController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { id, email } = req.client;
      const { pass } = req.params;

      const useCase = container.resolve(DeleteUserUseCase);
      const { user_id } = await useCase.execute({
         email,
         password: pass,
         user_id: id,
      });

      return res.status(204).json({ user_id });
   }
}
