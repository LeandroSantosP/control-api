import { AppError } from '@/shared/infra/middleware/AppError';

export class Birthday {
   private _value: string = '';

   constructor(value: string | undefined) {
      if (value === undefined) {
         this._value = '';
         return;
      }
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
         throw new AppError('Birthday is invalid format, dd/mm/yyyy');
      }

      if (!this.moreThan16(value)) {
         throw new AppError('Birthday must be over 16 years old');
      }

      this._value = value;
   }

   moreThan16(birthday: string): boolean {
      const [day, month, year] = birthday.split('/');

      const birthDate = new Date(`${year}-${month}-${day}`);
      const currentDate = new Date();

      let age = currentDate.getFullYear() - birthDate.getFullYear();

      const monthDiff = currentDate.getMonth() - birthDate.getMonth();

      if (
         monthDiff < 0 ||
         (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
         age--;
      }
      return age >= 16;
   }

   get getValue(): string {
      return this._value;
   }
}
