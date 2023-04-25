import { Recurrence as RecurrenceProps } from '@prisma/client';

export class Recurrence {
   private _value: RecurrenceProps;
   constructor(recurrence: RecurrenceProps | undefined) {
      if (!recurrence) {
         this._value = 'daily';
         return;
      }

      this._value = recurrence;
   }

   get GetValue() {
      return this._value;
   }
}
