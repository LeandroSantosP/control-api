import { verify } from 'jsonwebtoken';
import auth from '@/config/auth';
import { Next } from 'koa';
import { Context } from 'vm';
import { AppError } from './AppError';

export async function UserAuthentication(ctx: Context, next: Next) {
  const { authorization } = ctx.request.headers;

  const tokenValid = authorization.split(' ') as string[];

  if (tokenValid.length !== 2) {
    throw new AppError('Token Missing!');
  }
  const token = authorization.split(' ')[1];
  const { secretToken } = auth;

  try {
    const { sub: client_id } = verify(token, secretToken);

    ctx.request.client = {
      id: client_id,
    };

    await next();
  } catch (err) {
    throw new AppError('Invalid Token!', 401);
  }
}
