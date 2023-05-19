import { AppError } from '@/shared/infra/middleware/AppError';

import { inject, injectable } from 'tsyringe';
import { Category, CategoryProps } from '../infra/Entity/Category';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';

interface IRequest {
   user_id: string;
   transaction_id: string;
   description?: string;
   category?: CategoryProps;
}

@injectable()
export class EditTransactionCategoryAndDescriptionUseCase {
   constructor(
      @inject('TransactionsRepository')
      private readonly TransactionRepository: ITransactionsRepository
   ) {}

   async execute({
      transaction_id,
      user_id,
      category,
      description,
   }: IRequest): Promise<void> {
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
      await this.TransactionRepository.updated({
         transaction_id,
         description,
         category: newCategory.GetCategory,
      });
      return;
   }
}
