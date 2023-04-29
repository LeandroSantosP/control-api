import { IDateProvider } from '../IDateProvider';
import {
   formatISO,
   parse,
   addHours,
   addDays,
} from 'date-fns'; /* Criar um provider */

export class DateFnsProvider implements IDateProvider {
   public readonly now: Date = new Date();

   addDays(days: number): Date {
      return addDays(this.now, days);
   }
   addHours(hours: number): Date {
      return addHours(this.now, hours);
   }
   formatISO(props: any): string {
      return formatISO(props);
   }

   parse(props: any): Date {
      return parse(props.dateString, props.DatePatters, props.CurrentDate);
   }
}
