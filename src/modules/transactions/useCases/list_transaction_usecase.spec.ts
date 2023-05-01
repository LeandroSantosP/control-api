import 'reflect-metadata';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';
import { formatISO, parse } from 'date-fns';
import CreateUserTest from '@/utils/CrateUserTEST';
import CreateTransactionTEST from '@/utils/CreateTransactionTEST';

let userRepository: UserRepositoryTestDB;
let TransactionsRepository: TransactionsRepositoryTestDB;
let listTransactionUseCase: ListTransactionUseCase;

describe('List Transactions', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
      userRepository = new UserRepositoryTestDB();
      TransactionsRepository = new TransactionsRepositoryTestDB();
      listTransactionUseCase = new ListTransactionUseCase(
         TransactionsRepository
      );
   });

   it('should be able list all user transactions.', async () => {
      const user = {
         email: 'exemplo222@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      const list = await listTransactionUseCase.execute({
         user_id: newUser.id,
      });

      expect(list?.transactions).toBeTruthy();
   });

   it('should be able list all transaction by mouth', async () => {
      const user = {
         email: 'exemplo22224@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      /* Criar um rota onde liste todos os revenues pois o método (ListByMonth) ele retorna baseado no due date porem revenue nao tem due date! */

      const newUser = await userRepository.create({ ...user });

      await Promise.all(
         Array.from({ length: 2 }).map(async () => {
            return CreateTransactionTEST({
               email: newUser.email,
               isSubscription: false,
            });
         })
      );

      const transactionByMount = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 4,
      });

      expect(transactionByMount?.transactions).toHaveLength(2);
   });

   it('should be able get transaction with invalid data', async () => {
      /* Daqui a dois meses esse test ja era! */
      const user = {
         email: 'exemplo@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      try {
         const month = 'invalid format' as any;
         await listTransactionUseCase.execute({
            user_id: newUser.id,
            month,
         });
      } catch (err: any) {
         expect(err).toBeInstanceOf(AppError);
         expect(err.message).toBe('Invalid format, must be a number!');
      }
   });

   it('should be able do list transaction by subscriptions by month or all transactions!', async () => {
      /* Daqui a dois meses esse test ja era! */
      const newUser = await CreateUserTest();
      const dataFormattedOne = formatISO(
         parse('2023-05-02' as string, 'yyyy-MM-dd', new Date())
      );

      const dataFormattedTwo = formatISO(
         parse('2023-06-02' as string, 'yyyy-MM-dd', new Date())
      );

      await TransactionsRepository.CreateTransactionInstallments({
         email: newUser.email,
         description: 'test',
         value: '-12',
         dueDate: dataFormattedOne,
         isSubscription: true,
         categoryType: 'Investments',
         recurrence: 'monthly',
      });

      await TransactionsRepository.CreateTransactionInstallments({
         email: newUser.email,
         description: 'test',
         value: '-12.00',
         dueDate: dataFormattedTwo,
         isSubscription: true,
         categoryType: 'Investments',
         recurrence: 'monthly',
      });

      /* Just one Month */

      const sut = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 6,
      });

      expect(sut.monthBalense).toBeTruthy();
      expect(sut.transactions).toBeTruthy();
      expect(sut.transactions).toHaveLength(1);
      expect(sut.transactions[0]).toHaveProperty('isSubscription', true);

      expect(sut.monthBalense).toEqual({
         expense: '-12.00',
         revenue: '0.00',
         total: '-12.00',
      });

      /* All Months */

      const sut2 = await listTransactionUseCase.execute({
         user_id: newUser.id,
      });

      expect(sut2.balense).toBeTruthy();
      expect(sut2.transactions).toBeTruthy();
      expect(sut2.transactions).toHaveLength(2);
      expect(sut2.transactions[1]).toHaveProperty('isSubscription', true);
   });

   it('should return positive values', async () => {
      const newUser = await CreateUserTest();

      const dataFormattedOne = formatISO(
         parse('2023-05-02' as string, 'yyyy-MM-dd', new Date())
      );

      await TransactionsRepository.CreateTransactionInstallments({
         email: newUser.email,
         description: 'test',
         value: '-12',
         dueDate: dataFormattedOne,
         isSubscription: true,
         categoryType: 'Investments',
         recurrence: 'monthly',
      });

      await TransactionsRepository.CreateTransactionInstallments({
         email: newUser.email,
         description: 'test',
         value: '122',
         dueDate: dataFormattedOne,
         categoryType: 'food',
         recurrence: 'monthly',
      });

      const sut = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 5,
      });

      expect(sut.transactions.some((i) => Number(i.value) > 0)).toBeTruthy();
   });

   it('should be able to list transaction revenue/expense', async () => {
      const newUser = await CreateUserTest();

      const dataFormattedOne = formatISO(
         parse('2023-08-02' as string, 'yyyy-MM-dd', new Date())
      );

      await TransactionsRepository.create({
         email: newUser.email,
         description: 'test',
         value: '-122',
         filingDate: dataFormattedOne,
      });

      await TransactionsRepository.CreateTransactionInstallments({
         email: newUser.email,
         description: 'test',
         value: '1222.11',
         dueDate: dataFormattedOne,
         categoryType: 'food',
         recurrence: 'monthly',
      });

      const sut = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 8,
      });

      const sutTwo = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 1,
      });

      const sutThree = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 5,
      });

      expect(sut.monthBalense?.revenue).toEqual('1222.11');
      expect(sut.monthBalense?.expense).toEqual('-122.00');
      expect(sut.monthBalense?.total).toEqual('1100.11');

      expect(sut.transactions).toHaveLength(2);
      expect(sutTwo.transactions).toHaveLength(0);
      expect(sutThree.transactions).toHaveLength(0);
   });
});
