import { CategoryProps } from '../Entity/Category';
import { RecurrenceProps } from '../Entity/Recurrence';

export type CreatePropsDTO = {
   id?: string | undefined;
   description: string;
   value: string;
   installments?: number | undefined;
   isSubscription: boolean;
   resolved?: boolean;
   type: 'revenue' | 'expense';
   recurrence: RecurrenceProps;
   filingDate: string | undefined;
   category?: CategoryProps | undefined;
   due_date?: string | undefined;
   updatedAt?: Date | undefined;
   createdAt?: Date | undefined;
};
