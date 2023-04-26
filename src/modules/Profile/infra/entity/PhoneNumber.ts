import { AppError } from '@/shared/infra/middleware/AppError';

export class PhoneNumber {
   private _value: string;

   constructor(value: string) {
      const dddRegex = /^\((\d{2})\)/;
      const dddMatch = value.match(dddRegex);

      if (!dddMatch) {
         throw new AppError('Invalid phone number format');
      }

      const phoneNumber = value.slice(3).replace(/\D/g, '');

      if (!this.isValidPhoneNumber(phoneNumber)) {
         throw new AppError('Invalid phone number');
      }

      this._value = value;
   }

   private isValidPhoneNumber(phoneNumber: string): boolean {
      const mobileRegex = /^9\d{8}$/;
      const phoneNumberDigitsOnly = phoneNumber.replace(/\D/g, '');
      if (mobileRegex.test(phoneNumberDigitsOnly)) {
         return true;
      }
      return false;
   }

   get getValue(): string {
      return this._value;
   }
}
