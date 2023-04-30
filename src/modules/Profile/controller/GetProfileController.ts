import { HTTPRequest } from '@/types/HTTPRequest';
import { Profile } from '@prisma/client';
import { Request } from 'express';
import { container } from 'tsyringe';
import { GetProfileUseCase } from '../useCases/GetProfileUseCase';

export class GerProfileController {
   async handle(req: Request): Promise<HTTPRequest<Profile>> {
      const { id } = req.client;

      const useCase = container.resolve(GetProfileUseCase);

      const profile = await useCase.execute({ user_id: id });

      return {
         body: profile,
         statusCode: 200,
         type: 'json',
      };
   }
}
