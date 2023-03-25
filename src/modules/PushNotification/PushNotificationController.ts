import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { PushNotificationUseCase } from './PushNotificationUseCase';

export class PushNotificationController {
   async handle(req: Request, res: Response) {
      const useCase = container.resolve(PushNotificationUseCase);
      const date = new Date();
      const response = await useCase.execute(date);

      return res.json(response);
   }
}
