import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransaction } from './CreateTransactionUseCase';

interface ControllerRequest {
  description: string;
  value: number;
}

export class CreateTransactionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { description, value } = request.body;
    const { email } = request.client;

    const useCase = container.resolve(CreateTransaction);
    const result = await useCase.execute({ description, value, email });

    return response.status(200).json(result);
  }
}
