import auth from '@/config/auth';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { ITransactionsRepository } from '../transactions/infra/repository/ITransactionsRepository';
import { inject, injectable } from 'tsyringe';
import { Transaction } from '@prisma/client';

@injectable()
export class PushNotificationUseCase {
   constructor(
      @inject('TransactionsRepository')
      private TransactionsRepository: ITransactionsRepository<Transaction>,
      @inject('JwtAuthProvider')
      private JwtAuthProvider: IAuthProvider
   ) {}

   async execute(token: string, day: any): Promise<any> {
      const { secretTokenPushNotification } = auth;

      if (!token) {
         throw new AppError('Token must be provided!');
      }
      const [type, PushNotificationToken] = token.split(' ');

      if (type !== 'Bearer') {
         throw new AppError('Invalid Format');
      }

      const { sub: client_id } = this.JwtAuthProvider.VerifyToken(
         PushNotificationToken,
         secretTokenPushNotification
      ) as { sub: string };

      if (!client_id) {
         throw new AppError('Not authenticated');
      }

      const transactions =
         await this.TransactionsRepository.GetDailyTransactions(client_id);

      transactions.forEach((transaction) => {
         if (transaction.userId !== client_id)
            throw new AppError('Not authorized!');
      });

      const result = transactions.reduce(
         (
            storage: {
               author: string;
               due_date: Date | null;
               type: string | null;
               resolved: boolean;
               isSubscription: boolean | null;
               createdAt: Date;
            }[],
            current
         ) => {
            storage.push({
               author: current.author.name,
               due_date: current.due_date,
               type: current.type,
               resolved: current.resolved,
               isSubscription: current.isSubscription,
               createdAt: current.created_at,
            });
            return storage;
         },
         []
      );

      console.log(result);

      return result;
   }
}
