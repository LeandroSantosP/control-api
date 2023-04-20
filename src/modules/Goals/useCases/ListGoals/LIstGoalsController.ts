import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListGoalsUseCase } from './ListGoalsUseCase';

interface HTTPRequest<T> {
   statusCode: number;
   body: T;
   type: 'json' | 'send';
}

export class ListGoalsController {
   async handle(
      req: Request,
      res: Response
   ): Promise<
      HTTPRequest<{
         user: any;
         MonthFormatted: {
            name: string;
            number: number;
            expectated_expense: any;
            expectated_revenue: any;
         }[];
      }>
   > {
      const { id } = req.client;
      const useCase = container.resolve(ListGoalsUseCase);
      const result = await useCase.execute(id);

      return {
         statusCode: 200,
         body: { ...result },
         type: 'json',
      };
   }
}
