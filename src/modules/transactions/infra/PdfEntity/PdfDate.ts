import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PdfDate {
   constructor(
      @inject('DateFnsProvider')
      public data: string | undefined
   ) {}

   set setDate(date: string | undefined) {
      this.data = date;
   }

   get getDate() {
      return this.data;
   }

   verify(): this {
      if (this.data && !/^\d{4}-\d{2}-\d{2}$/.test(this.data)) {
         throw new AppError('Invalid date format.');
      }

      return this;
   }
}
