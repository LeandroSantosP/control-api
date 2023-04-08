import 'reflect-metadata';

import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '@/modules/transactions/infra/repository/test-db/TransactionsTestDB';
import { ListTransactionsOfUserUseCase } from './ListTransactionOfUserUseCase';
import { prisma } from '@/database/prisma';
import { Transaction } from '@prisma/client';

let userRepository: UserRepositoryTestDB;
let transactionsRepositoryTestDB: TransactionsRepositoryTestDB;
let listTransactionsOfUserUseCase: ListTransactionsOfUserUseCase;
interface createUserProps {
   email?: string;
   password?: string;
   name?: string;
}

async function createUser({
   email = 'test1@example.com',
   name = 'John Doe',
   password = 'senha123',
}: createUserProps) {
   const userTest = await userRepository.create({
      email,
      name,
      password,
   });

   return userTest;
}

interface GenerateTransactionDataExample {
   amount: number;
   user: any;
}

function GenerateTransactionDataExample({
   amount,
   user,
}: GenerateTransactionDataExample) {
   return Array.from({ length: amount }).map((_, index) => {
      return {
         email: user.email,
         description: `Desc${index}`,
         value: (12 + index).toString(),
      };
   });
}

describe('Transactions', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany();
   });
   beforeEach(async () => {
      await prisma.user.deleteMany();
      userRepository = new UserRepositoryTestDB();
      transactionsRepositoryTestDB = new TransactionsRepositoryTestDB();
      userRepository;
      listTransactionsOfUserUseCase = new ListTransactionsOfUserUseCase(
         transactionsRepositoryTestDB
      );
   });

   it('ADM should be able get all transactions of all users.', async () => {
      const userTest1 = await createUser({});
      await transactionsRepositoryTestDB.create({
         description: 'test',
         email: userTest1.email,
         value: '12',
      });

      const userTest2 = await createUser({ email: 'test@test.com' });

      await transactionsRepositoryTestDB.create({
         description: 'test',
         email: userTest2.email,
         value: '12',
      });

      const result = await listTransactionsOfUserUseCase.execute();

      expect(result).toHaveLength(2);
      expect(result![0].id !== result![1].id).toBeTruthy();
   });

   it('ADM should return all Transaction from each users!', async () => {
      /* USer 1 */
      const userTest1 = await createUser({ email: 'tes1@test.com' });

      const transactionsExemplo1 = GenerateTransactionDataExample({
         amount: 2,
         user: userTest1,
      });

      for (let transaction of transactionsExemplo1) {
         await transactionsRepositoryTestDB.create(transaction);
      }

      const allTransactionsOfUser1 =
         await transactionsRepositoryTestDB.ListAllADM(userTest1.id);

      expect(allTransactionsOfUser1).toHaveLength(2);

      /* USer 2 */

      const userTest2 = await createUser({ email: 'test2@example.com' });

      const transactionsExemplo2 = GenerateTransactionDataExample({
         amount: 10,
         user: userTest2,
      });

      for (let transaction of transactionsExemplo2) {
         await transactionsRepositoryTestDB.create(transaction);
      }

      const allTransactionsOfUser2 =
         await transactionsRepositoryTestDB.ListAllADM(userTest2.id);

      expect(allTransactionsOfUser2).toHaveLength(10);
   });

   it('ADM should be able get all transactions of unique user.', async () => {
      const userTest = await createUser({});

      const transactionsExemplo = GenerateTransactionDataExample({
         amount: 3,
         user: userTest,
      });

      for (let transaction of transactionsExemplo) {
         await transactionsRepositoryTestDB.create(transaction);
      }

      const UserTransaction = await listTransactionsOfUserUseCase.execute(
         userTest.id
      );

      const interSection = UserTransaction?.reduce((storage, crr) => {
         if (
            transactionsExemplo.some(
               (transaction) =>
                  transaction.description === crr.description &&
                  transaction.value === crr.value.toString()
            )
         ) {
            storage.push(crr);
         }
         return storage;
      }, [] as Transaction[]);

      const transaction = interSection!.map((transaction) => ({
         description: transaction.description,
         value: transaction.value,
         id: transaction.id,
         isSubscription: transaction.isSubscription,
         resolved: transaction.resolved,
      }));

      const CompareArrays = (firstArray: any[], secondArray: any[]) => {
         const propsEqual = secondArray.map((item) => {
            const filteredItem = {} as any;
            Object.keys(item)
               /* Pegando as keys do primeiro array, que ao comparar com as keys do segundo array retorna o resultado que sao diferentes de undefiled */
               .filter((key) => firstArray[0][key] !== undefined)
               .forEach((key: string) => {
                  filteredItem[key] = item[key];
               });

            return filteredItem;
         });

         return propsEqual;
      };

      const AllTransactions = CompareArrays(transaction, UserTransaction!);

      AllTransactions.forEach((transaction) => {
         for (let params in transaction) {
            expect(params).toBeTruthy();
         }
      });

      expect(AllTransactions[0]).toHaveProperty('id');
      expect(AllTransactions).toHaveLength(3);
   });
});
