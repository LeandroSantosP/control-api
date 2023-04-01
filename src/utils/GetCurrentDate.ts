import { endOfMonth, startOfMonth } from 'date-fns';

export class GetCurrentDate {
   private today: Date;
   private year: number;
   private day: number;
   private month: number;

   constructor() {
      this.today = new Date();
      this.month = new Date().getMonth();
      this.year = new Date().getFullYear();
      this.day = this.today.getDate();
   }

   public getStartAndEndOfTheMonth(month?: number) {
      const currentYear = this.year;

      if (!month) {
         return;
      }

      const startOfTheMount = startOfMonth(new Date(currentYear, month - 1));
      const endOfTheMount = endOfMonth(new Date(currentYear, month - 1));

      return { startOfTheMount, endOfTheMount };
   }

   public getDayMonthYear() {
      return {
         today: this.today,
         year: this.year,
         month: this.month,
         day: this.day,
      };
   }
}
