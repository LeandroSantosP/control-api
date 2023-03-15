import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

@injectable()
export class ListTransactionUseCase {
  constructor(
    @inject('TransactionsRepository')
    private TransactionRepository: ITransactionsRepository
  ) {}

  async execute(user_id: string) {
    const transactions =
      await this.TransactionRepository.ListUserTransactionsById(user_id);

    transactions?.forEach((transaction) => {
      if (transaction.userId !== user_id) {
        throw new AppError('Not Authorization!');
      }
    });

    return { transactions };
  }
}
