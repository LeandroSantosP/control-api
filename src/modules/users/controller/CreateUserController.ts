import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';

interface CreateUserRequest {
   name: string;
   email: string;
   password: string;
}

export class CreateUserController {
   async handle(request: Request, response: Response): Promise<Response> {
      const { name, email, password } = request.body as CreateUserRequest;

      const newUser = container.resolve(CreateUserUseCase);
      const result = await newUser.execute({ email, name, password });

      return response.status(200).json(result);
   }
}
