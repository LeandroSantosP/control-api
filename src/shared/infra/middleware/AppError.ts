import { Context, Next } from 'koa';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message = 'Something Going Wrong!', statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export class InvalidYupError extends Error {
  public readonly statusCode: number;

  constructor(message = 'Something Going Wrong!', statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export async function ErrorHandle(ctx: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.statusCode;
      ctx.body = {
        message: err.message,
      };
    } else if (err instanceof InvalidYupError) {
      ctx.status = err.statusCode;
      ctx.body = {
        message: err.message,
      };
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {
        message: 'Internal Server Error',
      };
    }
  }
}
