import Router from '@koa/router';
import {
  DefaultContext,
  DefaultState,
  Next,
  ParameterizedContext,
  Request,
} from 'koa';

export type ctxType = ParameterizedContext<
  DefaultState,
  DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
  unknown
>;

declare module 'koa' {
  interface Request {
    request: {
      client: {
        id: string;
      };
    };
  }
}

export interface MyRequest extends Request {
  client: {
    id: string;
  };
}
