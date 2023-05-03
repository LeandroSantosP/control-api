import { AppError } from '@/shared/infra/middleware/AppError';

export class ExpectatedExpense {
   constructor(private readonly _value: number) {
      if (this._value > 0) {
         throw new Error(
            'The value of the expected expense cannot be positive.'
         );
      }

      if (String(this._value).includes('.')) {
         const converterToString = String(this._value).split('.');

         if (converterToString.length > 2) {
            throw new AppError(
               'Invalid Expectated expense, must be a decimal value.'
            );
         }

         if (converterToString[1].length > 2) {
            throw new AppError(
               'Invalid Expectated expense, decimal value is not valid.'
            );
         }
      }
   }

   get GetValue() {
      return this._value;
   }
}
