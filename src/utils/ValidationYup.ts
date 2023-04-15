import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import * as yup from 'yup';

export class ValidationYup {
   readonly errorMessages;

   constructor(err: any) {
      const errorMessages: string[] = [];

      if (err instanceof yup.ValidationError) {
         err.inner.forEach(({ path, message }: any) => {
            if (path) {
               errorMessages.push(`${message} \n`);
            }
         });

         this.errorMessages = errorMessages;
         throw new InvalidYupError(errorMessages.join(''));
      }

      throw new AppError(err.message, 400);
   }
}
