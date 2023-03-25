import { inject } from 'tsyringe';
import { admin } from '@/interfaces/firebase';
import { ITransactionsRepository } from '../transactions/infra/repository/ITransactionsRepository';

export class PushNotificationUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionsRepository: ITransactionsRepository
   ) {}
   async execute(user_id: string) {
      const transactions =
         await this.TransactionsRepository.GetDailyTransactions(user_id);

      const messages = transactions.map((transaction) => ({
         data: {
            title: 'Uma conta vence Hoje',
            body: `Sua conta ${transaction.description} Vence Hoje!`,
         },
         token: transaction.author.fireBaseToken!,
      }));

      admin
         .messaging()
         .sendAll(messages)
         .then((response) => {
            console.log(
               'Successfully sent message ' + JSON.stringify(response)
            );
         })
         .catch((err) => {
            console.log(err);
         });
      return;
   }
}
