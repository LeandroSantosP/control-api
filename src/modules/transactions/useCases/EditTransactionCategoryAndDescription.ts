import { AppError } from '@/shared/infra/middleware/AppError';
import { Transaction, TransactionsCategory } from '@prisma/client';
import { Category, CategoryProps } from '../infra/Entity/Category';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';

interface IRequest {
   user_id: string;
   transaction_id: string;
   description?: string;
   category?: CategoryProps;
}

export class EditTransactionCategoryAndDescription {
   constructor(
      private readonly TransactionRepository: ITransactionsRepository
   ) {}

   async execute({
      transaction_id,
      user_id,
      category,
      description,
   }: IRequest): Promise<
      Transaction & {
         category: TransactionsCategory;
      }
   > {
      const transaction = await this.TransactionRepository.GetTransactionById(
         transaction_id
      );

      if (category === undefined && description === undefined) {
         throw new AppError('Category or description must be provider!');
      }

      if (!transaction) {
         throw new AppError('Invalid Transaction!');
      } else if (transaction && transaction.userId !== user_id) {
         throw new AppError('Not Authorized!', 401);
      }

      const newCategory = new Category(category);
      return await this.TransactionRepository.updated({
         transaction_id,
         description,
         category: newCategory.GetCategory,
      });
   }
}
