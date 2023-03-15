import 'reflect-metadata';

import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionsOfUserUseCase } from './ListTransactionOfUserUseCase';
import { prisma } from '@/database/prisma';
import { Transaction } from '@prisma/client';

let userRepository: UserRepositoryTestDB;
let transactionsRepositoryTestDB: TransactionsRepositoryTestDB;
let listTransactionsOfUserUseCase: ListTransactionsOfUserUseCase;

describe('Transactions', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    userRepository = new UserRepositoryTestDB();
    transactionsRepositoryTestDB = new TransactionsRepositoryTestDB();
    userRepository;
    listTransactionsOfUserUseCase = new ListTransactionsOfUserUseCase(
      transactionsRepositoryTestDB
    );
  });

  it('should be able get all user transactions.', async () => {
    const userTest = await userRepository.create({
      email: 'test1@example.com',
      name: 'John Doe',
      password: 'senha123',
    });

    const transactionsExemplo = [
      { email: userTest.email, description: 'Desc1', value: 12 },
      { email: userTest.email, description: 'Desc2', value: 13 },
      { email: userTest.email, description: 'Desc3', value: 14 },
    ];

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
            transaction.value === crr.value
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
