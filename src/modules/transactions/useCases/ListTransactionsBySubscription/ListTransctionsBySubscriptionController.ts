import { AppError } from '@/shared/infra/middleware/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListTransitionsBySubscriptionUseCase } from './ListTransitionsBySubscriptionUseCase';

function validatedValue(value: any, allValue: any[]) {
   if (!allValue.includes(value)) {
      throw new AppError('Invalid Data Formate!');
   }
   return;
}

export class ListTransactionsBySubscriptionController {
   async handle(req: Request, res: Response): Promise<Response> {
      const { id } = req.client;
      const { month, isSubscription, resolved, revenue } = req.query;

      validatedValue(resolved, [undefined, 'true', 'false']);
      validatedValue(revenue, [undefined, 'true', 'false']);
      validatedValue(isSubscription, [undefined, 'true', 'false']);
      let isSubscriptionResult;

      if (typeof isSubscription === 'string') {
         if (isSubscription === 'false') {
            isSubscriptionResult = JSON.parse(isSubscription);
         } else if (isSubscription === 'true') {
            isSubscriptionResult = Boolean(isSubscription);
         } else {
            throw new AppError('Invalid Data Formate!');
         }
      }

      const useCase = container.resolve(ListTransitionsBySubscriptionUseCase);
      const result = await useCase.execute({
         user_id: id,
         month: Number(month),
         isSubscription: isSubscriptionResult,
         resolved: resolved === 'true' ? true : false,
         revenue: revenue === 'true' ? true : false,
      });

      return res.status(200).json(result);
   }
}
