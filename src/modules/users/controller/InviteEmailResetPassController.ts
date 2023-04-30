import { HTTPRequest } from '@/types/HTTPRequest';
import { Request } from 'express';
import { container } from 'tsyringe';
import { InviteEmailResetPassUseCase } from '../useCases/InviteEmailResetPassUseCase';

export class InviteEmailResetPassController {
   async handle(req: Request): Promise<HTTPRequest<void>> {
      const { email } = req.body;

      const useCase = container.resolve(InviteEmailResetPassUseCase);
      await useCase.execute(email);

      return {
         body: undefined,
         statusCode: 200,
         type: 'json',
      };
   }
}
