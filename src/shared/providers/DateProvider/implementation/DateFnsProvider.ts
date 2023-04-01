import { IDateProvider } from '../IDateProvider';
import { formatISO, parse } from 'date-fns'; /* Criar um provider */

export class DateFnsProvider implements IDateProvider {
   formatISO(props: any): string {
      return formatISO(props);
   }

   parse(props: any): Date {
      return parse(props.dateString, props.DatePatters, props.CurrentDate);
   }
}
