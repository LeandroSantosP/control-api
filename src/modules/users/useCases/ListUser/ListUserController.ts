import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListUSerUseCase } from './LIstUserUseCase';

export class ListUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = container.resolve(ListUSerUseCase);
    const ListOfUsers = await useCase.execute();

    return response.status(201).json(ListOfUsers);
  }
}
