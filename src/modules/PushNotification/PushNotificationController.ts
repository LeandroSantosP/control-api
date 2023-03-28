import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PushNotificationUseCase } from './PushNotificationUseCase';

export class PushNotificationController {
   async handle(req?: Request, res?: Response) {
      const token = req?.headers.authorization as any;

      const useCase = container.resolve(PushNotificationUseCase);

      const response = await useCase.execute(token);

      return res?.status(200).json(response);
   }
}
