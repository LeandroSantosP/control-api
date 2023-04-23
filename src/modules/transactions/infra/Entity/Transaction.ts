import { DueDate } from './DueDate';
import { Category } from './Category';
import { Recurrence } from './Recurrence';
import { randomUUID } from 'crypto';
import { FilingDate } from './FilingDate';
import { Value } from './Value';
import { CreatePropsDTO } from '../dto/TransactionsDTO';

export class Transaction {
   private constructor(
      readonly id: string | undefined,
      readonly description: string,
      readonly value: Value,
      readonly installments: number | undefined,
      readonly isSubscription: boolean,
      readonly resolved: boolean,
      readonly type: 'revenue' | 'expense',
      readonly filingDate: FilingDate | undefined,
      readonly recurrence: Recurrence | undefined,
      readonly category: Category | undefined,
      readonly due_date: DueDate | undefined,
      readonly CreateAt: Date | undefined,
      readonly UpdateAt: Date | undefined
   ) {
      if (!this.CreateAt) {
         this.CreateAt = new Date();
      }
      if (this.UpdateAt) {
         this.UpdateAt = new Date();
      }
      if (!this.id) {
         this.id = randomUUID();
      }
   }

   static create({
      id,
      description,
      value,
      category,
      due_date,
      filingDate,
      resolved = false,
      type,
      installments,
      isSubscription,
      recurrence,
      updatedAt,
      createdAt,
   }: CreatePropsDTO) {
      return new Transaction(
         id,
         description,
         new Value(value),
         installments,
         isSubscription,
         resolved,
         type,
         new FilingDate(filingDate),
         new Recurrence(recurrence),
         new Category(category),
         new DueDate(due_date),
         updatedAt,
         createdAt
      );
   }
}
