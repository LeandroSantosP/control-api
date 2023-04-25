import { HTTPRequest } from '@/types/HTTPRequest';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListGoalsUseCase } from './ListGoalsUseCase';

type Output = {
   user: any;
   MonthFormatted: {
      name: string;
      number: number;
      expectated_expense: any;
      expectated_revenue: any;
   }[];
};

type handleResponse = Promise<HTTPRequest<Output>>;

type handleFuncType = (req: Request, res: Response) => handleResponse;

export class ListGoalsController {
   async interceptH(handle: handleFuncType) {
      return (req: Request, res: Response) => {
         return handle(req, res);
      };
   }
   async handle(req: Request, res: Response): handleResponse {
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
