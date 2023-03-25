import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PushNotificationUseCase } from './PushNotificationUseCase';

export class PushNotificationController {
   async handle(req?: Request, res?: Response) {
      const useCase = container.resolve(PushNotificationUseCase);
      const response = await useCase.execute(
         '49dbb0d1-50cc-4999-90d0-03b7a857d60b'
      );

      return response;
   }
}
