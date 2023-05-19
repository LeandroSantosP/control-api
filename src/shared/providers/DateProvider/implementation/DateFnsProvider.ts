import {
   addDays,
   addHours,
   format,
   formatISO,
   parse,
} from 'date-fns'; /* Criar um provider */
import { formatParams, IDateProvider, parseProps } from '../IDateProvider';

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

   format(params: formatParams): string {
      return format(params.date, params.format, params.options);
   }

   parse(props: parseProps): Date {
      return parse(props.dateString, props.DatePatters, props.CurrentDate);
   }
}
