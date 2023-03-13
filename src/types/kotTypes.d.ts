import { Context } from 'koa';

declare module 'koa' {
  interface Request extends Context['request'] {
    client: {
      name: string;
      email: string;
    };
  }
}
