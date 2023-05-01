import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ResolveTransactionUseCase } from '../useCases/ResolveTransactionUseCase';

export class ResolveTransactionController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { transaction_id } = req.params;
      const { id } = req.client;

      const useCase = container.resolve(ResolveTransactionUseCase);

      await useCase.execute(transaction_id, id);

      return res.status(200).send();
   }
}
