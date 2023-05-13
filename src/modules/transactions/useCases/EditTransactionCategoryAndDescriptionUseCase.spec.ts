import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { EditTransactionCategoryAndDescriptionUseCase } from './EditTransactionCategoryAndDescriptionUseCase';
import CreateTransactionTEST, {
   dataFormatted,
} from '@/utils/CreateTransactionTEST';
import CreateUserTest from '@/utils/CrateUserTEST';
import { AppError } from '@/shared/infra/middleware/AppError';

let transactionRepositoryTest: ITransactionsRepository;
let editTransactionCategoryAndDescription: EditTransactionCategoryAndDescriptionUseCase;

describe('EditTransactionCategoryAndDescription UseCase', () => {
   beforeEach(async () => {
      await prisma.transaction.deleteMany({});
      await prisma.transactionsCategory.deleteMany({});
      await prisma.user.deleteMany({});
      transactionRepositoryTest = new TransactionsRepositoryTestDB();
      editTransactionCategoryAndDescription =
         new EditTransactionCategoryAndDescriptionUseCase(
            transactionRepositoryTest
         );
   });

   it('should throw new erro if transaction does not exits', async () => {
      const newUser = await CreateUserTest();

      await expect(() =>
         editTransactionCategoryAndDescription.execute({
            transaction_id: 'invalid_ID',
            user_id: newUser.id,
            category: 'leisure',
            description: 'new Desc',
         })
      ).rejects.toThrow(new AppError('Invalid Transaction!'));
   });

   it('should throw new erro if userID is not own of transaction!', async () => {
      const newUser = await CreateUserTest({
         name: 'ana',
         email: 'ana@exemplo.com',
      });

      const newUserTwo = await CreateUserTest({
         name: 'joão',
      });

      const newTransactionTwo = await CreateTransactionTEST({
         email: newUserTwo.email,
         dueDate: dataFormatted,
      });

      await expect(() =>
         editTransactionCategoryAndDescription.execute({
            user_id: newUser.id,
            transaction_id: newTransactionTwo.id,
            category: 'leisure',
            description: 'new Desc',
         })
      ).rejects.toThrow(new AppError('Not Authorized!', 401));
   });

   it('should be Able Updated category of a transaction.', async () => {
      const newUser = await CreateUserTest();
      const newTransaction = await CreateTransactionTEST({
         email: newUser.email,
         dueDate: dataFormatted,
      });

      const response = await prisma.transactionsCategory.findFirst({
         where: {
            id: newTransaction.transactionsCategoryId,
         },
      });
      expect(response?.name).toBe('Investments');
      const sut = await editTransactionCategoryAndDescription.execute({
         transaction_id: newTransaction.id,
         user_id: newUser.id,
         category: 'leisure',
         description: 'new Desc',
      });

      expect(sut).toBe(undefined);
      const responseEdit = await transactionRepositoryTest.list({
         user_id: newUser.id,
      });
      expect(responseEdit[0].description).toBe('new Desc');
      expect(responseEdit[0].category.name).toBe('leisure');
   });

   it('should be throw new erro if both category and description is not provider!', async () => {
      const newUser = await CreateUserTest();
      const newTransaction = await CreateTransactionTEST({
         email: newUser.email,
         dueDate: dataFormatted,
      });

      await expect(() =>
         editTransactionCategoryAndDescription.execute({
            transaction_id: newTransaction.id,
            user_id: newUser.id,
         })
      ).rejects.toThrow(
         new AppError('Category or description must be provider!')
      );
   });
});
