import { AppError } from '@/shared/infra/middleware/AppError';

export class Value {
   private _value;

   constructor(value: string) {
      if (!value) {
         throw new AppError('Value is required!');
      }

      if (typeof value !== 'string') {
         throw new AppError('Value must be a string!');
      }

      if (!/^[-]?\d+(\.\d+)*$/.test(value)) {
         throw new AppError('Value must be a number.');
      }

      if (Number(value) > 0 && Number(value) < 100) {
         throw new AppError('Revenue must be between 0 and 100.');
      }

      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
