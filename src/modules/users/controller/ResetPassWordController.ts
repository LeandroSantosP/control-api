import { HTTPRequest } from '@/types/HTTPRequest';
import { Request } from 'express';
import { container } from 'tsyringe';
import { ResetPasswordUseCase } from '../useCases/ResetPassWordUseCase';

export class ResetPassWordController {
   async handle(req: Request): Promise<HTTPRequest<void>> {
      const { resetToken } = req.params;
      const { newPassword } = req.body;

      const useCase = container.resolve(ResetPasswordUseCase);
      await useCase.execute({
         token: resetToken,
         newPassword,
      });

      return {
         body: undefined,
         statusCode: 201,
         type: 'send',
      };
   }
}
