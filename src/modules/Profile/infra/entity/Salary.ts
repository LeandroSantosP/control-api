import { AppError } from '@/shared/infra/middleware/AppError';

export class Salary {
   private _value: string;

   constructor(value: string) {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
         throw new AppError('Invalid salary, must be in decimal format.');
      }

      this._value = value;
   }

   get getValue(): string {
      return this._value;
   }
}
