import { AppError } from '@/shared/infra/middleware/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransitionsBySubscriptionUseCase } from './ListTransitionsBySubscriptionUseCase';

export class ListTransactionsBySubscriptionController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { id } = req.client;
      const { month, isSubscription } = req.query;

      let isSubscriptionResult;

      if (typeof isSubscription === 'string') {
         if (isSubscription === 'false') {
            isSubscriptionResult = JSON.parse(isSubscription);
         } else if (isSubscription === 'true') {
            isSubscriptionResult = Boolean(isSubscription);
         } else {
            throw new AppError('ok');
         }
      }

      const useCase = container.resolve(ListTransitionsBySubscriptionUseCase);
      const result = await useCase.execute({
         user_id: id,
         isSubscription: isSubscriptionResult,
         month: Number(month),
      });

      return res.status(200).json(result);
   }
}
