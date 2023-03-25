import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import Decimal from 'decimal.js';

@injectable()
export class GetBalenseUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionRepository: ITransactionsRepository
   ) {}

   async execute({ user_id }: { user_id: string }) {
      const allTransactions =
         await this.TransactionRepository.ListUserTransactionsById(user_id);

      const balense = allTransactions?.reduce(
         (storage, current) => {
            storage.balense = storage.balense + Number(current.value);
            return storage;
         },
         { balense: 0 }
      );

      console.log(balense);

      return balense;
   }
}
