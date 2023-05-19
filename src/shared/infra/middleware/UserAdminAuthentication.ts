import { prisma } from '@/database/prisma';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';

export class UserAdminAuthentication {
   constructor() {}

   static async verify(req: Request, res: Response, next: NextFunction) {
      const { id } = req.client;
      const user = await prisma.user.findFirst({
         where: {
            id,
         },
      });

      if (user?.admin === false) {
         throw new AppError('Not authorized!');
      }

      return next();
   }
}
