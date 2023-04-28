import { HTTPRequest } from '@/types/HTTPRequest';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ConfigurationProfile } from './ConfigurationProfileUseCase';

export class ConfigurationProfileController {
   async handle(req: Request, res: Response): Promise<HTTPRequest<any>> {
      const avatar = req.file;
      const data = req.body;
      const { id: user_id } = req.client;

      const useCase = container.resolve(ConfigurationProfile);

      const paramsRequest = {
         user_id,
         update: data.update,
         profileInfos: {
            avatar,
            Birthday: data.Birthday,
            phonenumber: data.phonenumber,
            profession: data.profession,
            salary: data.salary,
         },
      };

      if (data.update === true && data.profile_id) {
         const updatedProfile = await useCase.execute({
            ...paramsRequest,
            update: data.update,
            profile_id: data.profile_id,
         });

         return {
            body: undefined,
            statusCode: 204,
            type: 'json',
         };
      }

      const createProfile = await useCase.execute({
         ...paramsRequest,
         profile_id: undefined,
         update: data.update,
      });

      return {
         body: undefined,
         statusCode: 201,
         type: 'json',
      };
   }
}
