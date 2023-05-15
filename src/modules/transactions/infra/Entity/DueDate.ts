import { AppError } from '@/shared/infra/middleware/AppError';

export class DueDate {
   private _value;

   constructor(value: string | undefined) {
      if (!value) {
         return;
      }

      if (typeof value !== 'string') {
         throw new AppError('Invalid type - ( DueDate )');
      }

      const now = new Date();
      const dueDate = new Date(value);

      if (dueDate < now) {
         throw new AppError('Due date cannot be before current date.');
      }

      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
