import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteTransactionUseCase } from './DeleteTransactionUseCase';

export class DeleteTransactionController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { transaction_id } = req.params;
      const { id: user_id } = req.client;

      const useCase = container.resolve(DeleteTransactionUseCase);
      const id = await useCase.execute({ transaction_id, user_id });

      return res.status(204).json(id);
   }
}
