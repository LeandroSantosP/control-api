import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { SessionUseCase } from './SessionUseCase';

export class SessionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const authenticationBase64 = request.headers.authorization;

    const Authentication = container.resolve(SessionUseCase);
    const credentials = await Authentication.execute({ authenticationBase64 });

    return response.status(200).json(credentials);
  }
}
