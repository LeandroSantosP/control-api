import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransitionsBySubscriptionUseCase } from './ListTransitionsBySubscriptionUseCase';
import CreateTransactionTEST from '@/utils/CreateTransactionTEST';

let transactionRepository: TransactionsRepositoryTestDB;
let listTransitionsBySubscriptionUseCase: ListTransitionsBySubscriptionUseCase;

describe('listTransitionsBySubscriptionUseCase', () => {
   beforeEach(async () => {
      await prisma.transaction.deleteMany({});
      transactionRepository = new TransactionsRepositoryTestDB();
      listTransitionsBySubscriptionUseCase =
         new ListTransitionsBySubscriptionUseCase(transactionRepository);
   });

   it('should be able to list transaction By subscription!', async () => {
      const newUser = await CreateUserTest();

      await Promise.all(
         Array.from({ length: 4 }).map(async (_) => {
            return await CreateTransactionTEST({
               email: newUser.email,
               isSubscription: false,
            });
         })
      );

      const sut = await listTransitionsBySubscriptionUseCase.execute({
         user_id: newUser.id,
         month: 4,
      });

      sut.transactions.forEach((transaction) => {
         expect(transaction.isSubscription).toBeFalsy();
      });

      expect(sut).toHaveProperty('transactions');
      expect(sut.transactions).toHaveLength(4);
      expect(sut).toHaveProperty('balense', {
         expense: '-48.00',
         revenue: '0.00',
         total: '-48.00',
      });
   });
});
