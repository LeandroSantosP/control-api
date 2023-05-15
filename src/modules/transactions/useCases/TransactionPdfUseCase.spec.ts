import 'reflect-metadata';
import '@/shared/infra/tsyringe';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { AppError } from '@/shared/infra/middleware/AppError';
import { TransactionPdfUseCase } from './TransactionPdfUseCase';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { IPdfProviderProvider } from '@/shared/providers/PdfProvider/IPdfProviderProvider';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { HtmlPdfProvider } from '@/shared/providers/PdfProvider/implementation/HtmlPdfProvider';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';

import CreateTransactionTEST, {
   dataFormatted,
} from '@/utils/CreateTransactionTEST';

let useRepositoryTest: IUserRepository;
let TransactionRepository: TransactionsRepositoryTestDB;
let transactionPdfUseCase: TransactionPdfUseCase;
let HtmlPdfProviderTEST: IPdfProviderProvider;

let dateFnsProvider: IDateProvider;

async function CreateUserAndTransaction() {
   const { email, id } = await CreateUserTest();

   await CreateTransactionTEST({
      email,
      filingDate: dataFormatted,
      value: '4300.11',
   });

   await CreateTransactionTEST({
      email,
      filingDate: dataFormatted,
      value: '1000.22',
   });

   await CreateTransactionTEST({
      email,
      dueDate: dataFormatted,
      value: '-1021.33',
   });

   await CreateTransactionTEST({
      email,
      dueDate: dataFormatted,
      value: '-102220.00',
   });

   return { user_id: id, user_email: email };
}

describe('TransactionPdfUseCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      dateFnsProvider = new DateFnsProvider();
      useRepositoryTest = new UserRepositoryTestDB();
      HtmlPdfProviderTEST = new HtmlPdfProvider();
      TransactionRepository = new TransactionsRepositoryTestDB();
      transactionPdfUseCase = new TransactionPdfUseCase(
         useRepositoryTest,
         TransactionRepository,
         HtmlPdfProviderTEST,
         dateFnsProvider
      );
   });

   it('should not be able pass empty options!', async () => {
      const { user_id } = await CreateUserAndTransaction();
      await expect(() =>
         transactionPdfUseCase.execute({
            user_id,
            options: {},
            body: {
               subject: 'teste',
               title: 'titulo',
            },
         })
      ).rejects.toThrow(new AppError('Invalid Options!'));
   });

   it('should be able to get all transactions infos to create a pdf', async () => {
      const { user_id } = await CreateUserAndTransaction();

      const sut = await transactionPdfUseCase.execute({
         user_id,
         body: {
            subject: 'teste',
            title: 'titulo',
         },
      });
      expect(sut).toBeInstanceOf(Buffer);
   });

   it('should be able to get just revenue transactions infos to create a pdf ', async () => {
      const { user_id } = await CreateUserAndTransaction();

      const sut = await transactionPdfUseCase.execute({
         user_id,
         body: {
            subject: 'teste',
            title: 'titulo',
            start_date: '2010-05-05',
            end_date: '2024-05-05',
         },
         options: {
            ByRevenue: true,
         },
      });

      expect(sut).toBeInstanceOf(Buffer);
   });

   it('should be able to get just expense transactions infos to create a pdf ', async () => {
      const { user_id } = await CreateUserAndTransaction();

      const sut = await transactionPdfUseCase.execute({
         user_id,
         body: {
            subject: 'teste',
            title: 'titulo',
            start_date: '2010-05-05',
            end_date: '2024-05-05',
         },
         options: {
            ByExpense: true,
         },
      });

      expect(sut).toBeInstanceOf(Buffer);
   });

   it('should be able to get just expense transactions infos to create a pdf ', async () => {
      const { user_id } = await CreateUserAndTransaction();

      const sut = await transactionPdfUseCase.execute({
         user_id,
         body: {
            subject: 'teste',
            title: 'titulo',
            start_date: '2010-01-05',
            end_date: '2024-05-05',
         },
         options: {
            BySubscription: true,
         },
      });

      expect(sut).toBeInstanceOf(Buffer);
   });
});
