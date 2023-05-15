import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';

export class FormateDate {
   private readonly DateFnsProvider = new DateFnsProvider();
   constructor(private readonly date: string) {}

   formate(formate: 'yyyy-MM-dd'): Date | undefined {
      if (this.date) {
         const response = new Date(
            this.DateFnsProvider.formatISO(
               this.DateFnsProvider.parse({
                  CurrentDate: new Date(),
                  DatePatters: formate,
                  dateString: this.date,
               })
            )
         );
         return response;
      }
   }
}
