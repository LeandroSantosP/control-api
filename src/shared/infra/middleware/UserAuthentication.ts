import { verify } from 'jsonwebtoken';
import auth from '@/config/auth';
import { AppError } from './AppError';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '@/modules/users/infra/repository/implementation/UserRepository';

interface IJwtPayload {
   sub: string;
   email: string;
}

export async function UserAuthentication(
   req: Request,
   res: Response,
   next: NextFunction
) {
   const { authorization } = req.headers;

   if (!authorization) {
      throw new AppError('Token Missing!', 401);
   }

   const tokenValid = authorization.split(' ') as string[];

   if (tokenValid[0] !== 'Bearer' || tokenValid.length !== 2) {
      throw new AppError('Not Authorization or invalid Credentials!', 401);
   }

   const token = authorization.split(' ')[1];
   const { secretToken } = auth;

   try {
      const { sub: client_id, email } = verify(
         token,
         secretToken
      ) as IJwtPayload;

      const repository = new UserRepository();

      const user = await repository.GetUserById(client_id);

      if (!user) {
         throw new AppError('User Not Found!', 404);
      }

      req.client = {
         id: client_id,
         email,
         profileId: user.profileId,
      };
      next();
   } catch (err: any) {
      throw new AppError('Invalid Token', 401);
   }
}
