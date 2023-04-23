import { AppError } from '@/shared/infra/middleware/AppError';

export class FilingDate {
   private _value;

   constructor(value: string | undefined) {
      if (!value) {
         return;
      }

      if (typeof value !== 'string') {
         throw new AppError('Invalid type - ( DueDate )');
      }

      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)) {
         throw new AppError('Invalid filing date format.');
      }

      const now = new Date();
      const filingDate = new Date(value);

      if (filingDate < now) {
         throw new AppError('Filing Date cannot be before current date.');
      }

      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
