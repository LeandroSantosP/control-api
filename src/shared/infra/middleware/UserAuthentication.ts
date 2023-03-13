import { verify } from 'jsonwebtoken';
import auth from '@/config/auth';
import { AppError } from './AppError';
import { NextFunction, Request, Response } from 'express';

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
    throw new AppError('Token Missing!');
  }

  const tokenValid = authorization.split(' ') as string[];

  if (tokenValid[0] !== 'Bearer' || tokenValid.length !== 2) {
    throw new AppError('Not Authorization or invalid Credentials!', 401);
  }

  const token = authorization.split(' ')[1];
  const { secretToken } = auth;

  try {
    const { sub: client_id, email } = verify(token, secretToken) as IJwtPayload;

    req.client = {
      id: client_id,
      email,
    };
    next();
  } catch (err: any) {
    throw new AppError('Invalid Token');
  }
}
