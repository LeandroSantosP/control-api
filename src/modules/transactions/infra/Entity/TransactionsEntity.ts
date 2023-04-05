import { Category, Recurrence } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import { Transaction } from '@prisma/client';

export class TransactionsEntity {
   id?: string;
   description!: string;
   value!: string;
   installments?: number;
   isSubscription?: boolean;
   due_date: string | undefined;
   resolved!: boolean;
   created_at?: Date;
   updated_at?: Date;
   Category?: Category;
   type!: string;
   recurrence?: Recurrence;
   filingDate: string | undefined;

   constructor() {
      if (!this.id) {
         this.id = uuidV4();
      }
      if (!this.created_at) {
         this.created_at = new Date();
      }
      if (!this.updated_at) {
         this.updated_at = new Date();
      }

      if (!this.isSubscription) {
         this.installments = 0;
      }
      if (!this.resolved) {
         this.resolved = false;
      }
      if (!this.Category) {
         this.Category = 'unknown';
      }
   }
}
