import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PushNotificationUseCase } from './PushNotificationUseCase';

export class PushNotificationController {
   async handle(req?: Request, res?: Response): Promise<Response | undefined> {
      const token = req?.headers.authorization as any;

      const useCase = container.resolve(PushNotificationUseCase);

      return res?.status(200).json();
   }
}
