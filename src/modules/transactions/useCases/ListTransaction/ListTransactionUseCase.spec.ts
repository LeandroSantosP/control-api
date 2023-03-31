import 'reflect-metadata';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';
import { formatISO, parse } from 'date-fns';
import CreateUserTest from '@/utils/CrateUserTEST';

let userRepository: UserRepositoryTestDB;
let TransactionsRepository: TransactionsRepositoryTestDB;
let listTransactionUseCase: ListTransactionUseCase;

interface createNewTransactionProps {
   email?: string;
   description?: string;
   value?: string;
}

const createNewTransaction = async ({
   description = 'desc',
   email = 'email@exemple.com',
   value = '12',
}: createNewTransactionProps) =>
   await TransactionsRepository.create({
      email,
      description,
      value,
   });

describe('List Transactions', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany();
   });
   beforeEach(async () => {
      userRepository = new UserRepositoryTestDB();
      TransactionsRepository = new TransactionsRepositoryTestDB();
      listTransactionUseCase = new ListTransactionUseCase(
         TransactionsRepository
      );
   });

   const dataFormated = formatISO(
      parse('2023-04-23' as string, 'yyyy-MM-dd', new Date())
   );

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

      /* Criar um rota onde liste todos os revenues pois o metado (ListByMonth) ele retorna baseado no due date porem revenue nao tem due date! */

      const newUser = await userRepository.create({ ...user });

      await TransactionsRepository.create({
         email: newUser.email,
         description: 'test',
         value: '-12',
         dueDate: dataFormated,
      });

      await TransactionsRepository.create({
         email: newUser.email,
         description: 'test',
         value: '-12',
         dueDate: dataFormated,
      });

      const transactionByMount = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 3,
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
         value: '-77.29',
         dueDate: dataFormattedTwo,
         isSubscription: true,
         categoryType: 'Investments',
         recurrence: 'monthly',
      });

      /* Just one Month */

      const sut = await listTransactionUseCase.execute({
         user_id: newUser.id,
         month: 5,
         bySubscription: true,
      });

      expect(sut.balense).toBeTruthy();
      expect(sut.transactions).toBeTruthy();
      expect(sut.transactions).toHaveLength(1);
      expect(sut.transactions[0]).toHaveProperty('isSubscription', true);

      expect(sut.balense).toEqual({
         expense: '-12.00',
         revenue: '0.00',
         total: '-12.00',
      });

      /* All Months */

      const sut2 = await listTransactionUseCase.execute({
         user_id: newUser.id,
         bySubscription: true,
      });

      expect(sut2.balense).toBeTruthy();
      expect(sut2.transactions).toBeTruthy();
      expect(sut2.transactions).toHaveLength(2);
      expect(sut2.transactions[1]).toHaveProperty('isSubscription', true);
   });
});
