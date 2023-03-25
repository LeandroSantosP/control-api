import 'reflect-metadata';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';

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

   it('should be able list all user transactions.', async () => {
      const user = {
         email: 'exemplo222@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      await createNewTransaction({ email: user.email });

      const list = await listTransactionUseCase.execute(newUser.id);

      expect(list?.transactions).toBeTruthy();
   });

   it('should be able list all transaction by mouth', async () => {
      const user = {
         email: 'exemplo2222@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      await createNewTransaction({ email: user.email });
      await createNewTransaction({ email: user.email });

      const transactionByMount = await listTransactionUseCase.execute(
         newUser.id,
         3
      );

      expect(transactionByMount.transactions).toHaveLength(2);
   });

   it('should be able get transaction with invalid data', async () => {
      const user = {
         email: 'exemplo@gmail.com',
         name: 'test',
         password: 'senha123',
      };

      const newUser = await userRepository.create({ ...user });

      try {
         const month = 'invalid format' as any;
         await listTransactionUseCase.execute(newUser.id, month);
      } catch (err: any) {
         expect(err).toBeInstanceOf(AppError);
         expect(err.message).toBe('Invalid format, must be a number!');
      }
   });
});
