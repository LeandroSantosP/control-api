import { AppError } from '@/shared/infra/middleware/AppError';

export class ExpectatedRevenue {
   constructor(private readonly _value: number) {
      if (this._value < 0) {
         throw new AppError(
            'The value of the expected revenue cannot be negative.'
         );
      }

      if (String(this._value).includes('.')) {
         const converterToString = String(this._value).split('.');

         if (converterToString.length > 2) {
            throw new AppError(
               'Invalid Expectated revenue, must be a decimal value.'
            );
         }

         if (converterToString[1].length > 2) {
            throw new AppError(
               'Invalid Expectated revenue, decimal value is not valid.'
            );
         }
      }
   }

   get GetValue() {
      return this._value;
   }
}
