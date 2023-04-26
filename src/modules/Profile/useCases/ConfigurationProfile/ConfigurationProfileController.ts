import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ConfigurationProfile } from './ConfigurationProfileUseCase';

export class ConfigurationProfileController {
   async handle(req: Request, res: Response) {
      const avatar = req.file;
      const { props } = req.body;
      const { id: user_id } = req.client;

      const dataPassed = JSON.parse(props);
      const useCase = container.resolve(ConfigurationProfile);

      const avatarRef = await useCase.execute({
         user_id,
         update: false,
         profileInfos: {
            avatar,
            Birthday: dataPassed.Birthday,
            phonenumber: dataPassed.phonenumber,
            profession: dataPassed.profession,
            salary: dataPassed.salary,
         },
      });

      return res.status(200).send(avatarRef);
   }
}
