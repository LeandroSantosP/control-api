import { Transaction } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '@/modules/transactions/infra/repository/ITransactionsRepository';

@injectable()
export class ListTransactionsOfUserUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionsRepository: ITransactionsRepository
   ) {}

   async execute(user_id?: string): Promise<Transaction[] | null> {
      const allTransaction = await this.TransactionsRepository.ListAllADM(
         user_id
      );

      return allTransaction;
   }
}
