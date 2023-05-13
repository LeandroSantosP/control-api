import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import CreateTransactionTEST, {
   dataFormatted,
} from '@/utils/CreateTransactionTEST';
import { TransactionsRepositoryTestDB } from '../infra/repository/test-db/TransactionsTestDB';
import { TransactionPdfUseCase } from './TransactionPdfUseCase';

let TransactionRepository: TransactionsRepositoryTestDB;
let transactionPdfUseCase: TransactionPdfUseCase;

let options = {};

describe('TransactionPdfUseCase', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany({});
      TransactionRepository = new TransactionsRepositoryTestDB();
      transactionPdfUseCase = new TransactionPdfUseCase(TransactionRepository);
   });

   it('should be able to create a pdf with all Transactions', async () => {
      const { id, email } = await CreateUserTest();

      await CreateTransactionTEST({
         email,
         filingDate: dataFormatted,
      });

      // const sut = await transactionPdfUseCase.execute({
      //    user_id: id,
      // });

      // console.log(sut);
   });
});
