import 'reflect-metadata';
import 'express-async-errors';
import { app } from './server';
import { AppError, InvalidYupError } from '../infra/middleware/AppError';
import { NextFunction, Request, Response } from 'express';

const server_post = process.env.SERVER_PORT;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  } else if (err instanceof InvalidYupError) {
    return res.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    });
  }
  return res.status(500).json({
    status: 'Error',
    message: JSON.stringify(err.message),
  });
});

app.listen(server_post, () =>
  console.log(`Server Is Running In Port ${server_post}! 🚀`)
);
