import { AppError } from '@/shared/infra/middleware/AppError';

export class Month {
   private readonly validMonths: string[] = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
   ];
   constructor(private readonly _value: string) {
      if (typeof this._value !== 'string') {
         throw new AppError('Months must be a string.');
      }
      if (!this.validMonths.includes(this._value)) {
         throw new AppError(`Months ${this._value} is invalid.`);
      }
   }

   get getValue() {
      return this._value;
   }
}
