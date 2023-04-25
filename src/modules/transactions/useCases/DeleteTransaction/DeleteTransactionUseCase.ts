import { AppError } from '@/shared/infra/middleware/AppError';
import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

interface IRequest {
   transaction_id: string;
   user_id: string;
}

@injectable()
export class DeleteTransactionUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionsRepository: ITransactionsRepository
   ) {}

   async execute({
      transaction_id,
      user_id,
   }: IRequest): Promise<{ transactionId: string }> {
      const transaction = await this.TransactionsRepository.GetTransactionById(
         transaction_id
      );

      if (!transaction) {
         throw new AppError('Transaction does not exites!');
      }

      if (transaction?.userId !== user_id) {
         throw new AppError('Not Authorization!', 401);
      }

      const { id } = await this.TransactionsRepository.delete(transaction_id);

      return { transactionId: id };
   }
}
