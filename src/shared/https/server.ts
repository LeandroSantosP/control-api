import 'reflect-metadata';
import '@/shared/infra/tsyringe';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
const cors = require('@koa/cors');
import { allRoutes } from '../router';
import { ErrorHandle } from '../infra/middleware/AppError';

const app = new Koa();

app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
  })
);

app.use(ErrorHandle);

app.use(bodyParser());

app.use(allRoutes.routes());
app.use(allRoutes.allowedMethods());

export { app };
