import { AppError } from '@/shared/infra/middleware/AppError';

export class Installments {
   private readonly _value;
   constructor(value: number | undefined) {
      if (!value) {
         return;
      }

      Object.defineProperties(this, {
         _value: {
            writable: true,
            configurable: true,
            enumerable: true,
            value,
         },
      });

      Object.entries(this).forEach(([key, value]) => {
         console.log(key, value);
      });

      if (value < 2) {
         throw new AppError('Installments must be greater then 1');
      }

      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
