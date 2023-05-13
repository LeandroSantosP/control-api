import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { addDays, addMonths } from 'date-fns';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { TransactionPdfUseCase } from './TransactionPdfUseCase';
import CreateTransactionTEST, {
   dataFormatted,
} from '@/utils/CreateTransactionTEST';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';

let useRepositoryTest: IUserRepository;
let TransactionRepository: TransactionsRepositoryTestDB;
let transactionPdfUseCase: TransactionPdfUseCase;

async function CreateUserAndTransaction() {
   const { email, id } = await CreateUserTest();

   await CreateTransactionTEST({
      email,
      filingDate: dataFormatted,
      value: '100',
   });

   await CreateTransactionTEST({
      email,
      filingDate: dataFormatted,
      value: '100',
   });

   await CreateTransactionTEST({
      email,
      dueDate: dataFormatted,
      value: '-100',
   });

   await CreateTransactionTEST({
      email,
      dueDate: dataFormatted,
      value: '-100',
   });

   return { user_id: id, user_email: email };
}

describe('TransactionPdfUseCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      useRepositoryTest = new UserRepositoryTestDB();
      TransactionRepository = new TransactionsRepositoryTestDB();
      transactionPdfUseCase = new TransactionPdfUseCase(
         useRepositoryTest,
         TransactionRepository
      );
   });

   it('should not be able pass empty options!', async () => {
      const { user_id } = await CreateUserAndTransaction();
      await expect(() =>
         transactionPdfUseCase.execute({
            user_id,
            options: {},
         })
      ).rejects.toThrow(new AppError('Invalid Options!'));
   });

   it('should be able to get all transactions infos to create a pdf', async () => {
      const { user_id } = await CreateUserAndTransaction();

      const sut = await transactionPdfUseCase.execute({
         user_id,
      });

      expect(sut).toHaveLength(4);
      expect(String(sut[0].value)).toBe('-100');
      expect(String(sut[1].value)).toBe('-100');
      expect(String(sut[2].value)).toBe('100');
      expect(String(sut[3].value)).toBe('100');
   });

   it('should be able to get just revenue transactions infos to create a pdf ', async () => {
      const { user_email, user_id } = await CreateUserAndTransaction();

      let options = {
         ByRevenue: true,
      };

      const sut = await transactionPdfUseCase.execute({
         user_id,
         start_date: new Date(),
         end_date: addMonths(new Date(), 5),
         options: {
            ByRevenue: true,
         },
      });

      expect(sut).toHaveLength(2);
   });
});
