import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

@injectable()
export class ResolveTransactionUseCase {
   constructor(
      @inject('UserRepository')
      private UserRepository: IUserRepository,
      @inject('TransactionsRepository')
      private TransactionRepository: ITransactionsRepository<Transaction>
   ) {}

   async execute(transaction_id: string, user_id: string): Promise<boolean> {
      const user = await this.UserRepository.GetUserById(user_id);
      if (!user) throw new AppError('Invalid user');

      const transaction = await this.TransactionRepository.GetTransactionById(
         transaction_id
      );

      if (!transaction) {
         throw new AppError('Transaction not found');
      }

      Object.entries(transaction).forEach(([key, value]) => {
         if (key === 'userId' && user_id !== transaction[key]) {
            throw new AppError('Not authorized!');
         }

         if (key !== 'resolved') {
            return;
         }

         if (value === true) {
            throw new AppError('Transaction AllReady Resolved!');
         }
      });

      const transactionUpdated = await this.TransactionRepository.resolved(
         transaction_id
      );

      return transactionUpdated.resolved;
   }
}
