import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import CreateTransactionTEST from '@/utils/CreateTransactionTEST';
import { ListTransitionsBySubscriptionUseCase } from './ListTransitionsBySubscriptionUseCase';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';

let transactionRepository: TransactionsRepositoryTestDB;
let listTransitionsBySubscriptionUseCase: ListTransitionsBySubscriptionUseCase;

const CreateTransactions = async ({
   email,
   amount,
   isSubscription,
   resolved,
   value,
}: {
   email: string;
   amount: number;
   value?: string;
   resolved?: boolean;
   isSubscription?: boolean;
}) => {
   return await Promise.all(
      Array.from({ length: amount }).map(async (_) => {
         return await CreateTransactionTEST({
            email,
            isSubscription,
            value,
            resolved,
         });
      })
   );
};

describe('listTransitionsBySubscriptionUseCase', () => {
   beforeEach(async () => {
      await prisma.transaction.deleteMany({});
      transactionRepository = new TransactionsRepositoryTestDB();
      listTransitionsBySubscriptionUseCase =
         new ListTransitionsBySubscriptionUseCase(transactionRepository);
   });

   it('should be able to list transaction By subscription!', async () => {
      const newUser = await CreateUserTest();

      await CreateTransactions({
         email: newUser.email,
         isSubscription: false,
         amount: 4,
      });

      const sut = await listTransitionsBySubscriptionUseCase.execute({
         user_id: newUser.id,
         month: 4,
      });

      sut.transactions.forEach((transaction: any) => {
         expect(transaction.isSubscription).toBeFalsy();
      });

      expect(sut).toHaveProperty('transactions');
      expect(sut.transactions).toHaveLength(4);
      expect(sut).toHaveProperty('balense', {
         expense: '-48.00',
         revenue: '0.00',
         total: '-48.00',
      });

      /* With subscription */

      await CreateTransactions({
         email: newUser.email,
         isSubscription: true,
         amount: 4,
      });

      const sut2 = await listTransitionsBySubscriptionUseCase.execute({
         user_id: newUser.id,
         month: 4,
         isSubscription: true,
      });
   });

   it('should be possible to list the transactions the are resolved and are revenues!', async () => {
      const newUser = await CreateUserTest({ name: 'joãozinho' });
      await CreateTransactions({
         email: newUser.email,
         amount: 5,
         value: '90',
         resolved: true,
      });
      await CreateTransactions({
         email: newUser.email,
         amount: 1,
      });

      const sut = await listTransitionsBySubscriptionUseCase.execute({
         user_id: newUser.id,
         resolved: true,
         revenue: true,
      });
      expect(sut).toHaveLength(5);
   });

   it('should be possible to list the transactions the are resolved and are not revenue!', async () => {
      /*  */
      const newUser = await CreateUserTest({
         name: 'joãozinho',
         email: 'leandro@gmail.com',
      });
      await CreateTransactions({
         email: newUser.email,
         amount: 5,
         value: '90',
         resolved: true,
      });
      await CreateTransactions({
         email: newUser.email,
         amount: 1,
         value: '-20',
         resolved: true,
      });

      const sut = await listTransitionsBySubscriptionUseCase.execute({
         user_id: newUser.id,
         resolved: true,
         revenue: false,
      });
      expect(sut).toHaveLength(1);
   });
});
