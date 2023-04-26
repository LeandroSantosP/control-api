import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UploadUserAvatarUseCase } from './UploadUserAvatarUseCase';

export class UploadUserAvatarController {
   async handle(req: Request, res: Response) {
      const image = req.file;
      const { id: user_id } = req.client;

      const useCase = container.resolve(UploadUserAvatarUseCase);
      const avatarRef = await useCase.execute({
         image,
         user_id,
      });

      return res.status(200).send(avatarRef);
   }
}
