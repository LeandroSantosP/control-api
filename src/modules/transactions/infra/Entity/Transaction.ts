import { DueDate } from './DueDate';
import { Category } from './Category';
import { Recurrence } from './Recurrence';
import { randomUUID } from 'crypto';
import { FilingDate } from './FilingDate';
import { Value } from './Value';
import { CreatePropsDTO } from '../dto/TransactionsDTO';
import { Installments } from './Installments';
import { AppError } from '@/shared/infra/middleware/AppError';

export class Transaction {
   private constructor(
      readonly id: string | undefined,
      readonly description: string,
      readonly value: Value,
      readonly installments: Installments,
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
      const IsSubscriptionAndHaveInstallments = this.validateData(
         isSubscription,
         installments
      );

      if (IsSubscriptionAndHaveInstallments)
         throw new AppError('Subscription must not be have installments.');

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

   validateData(isSubscription: boolean, installments: Installments) {
      if (isSubscription && installments.getValue) {
         return true;
      }

      return false;
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
         new Installments(installments),
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
