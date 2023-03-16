import 'reflect-metadata';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { ListTransactionUseCase } from './ListTransactionUseCase';
import { prisma } from '@/database/prisma';

let userRepository: UserRepositoryTestDB;
let TransactionsRepository: TransactionsRepositoryTestDB;
let listTransactionUseCase: ListTransactionUseCase;

describe('List Transactions', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    userRepository = new UserRepositoryTestDB();
    TransactionsRepository = new TransactionsRepositoryTestDB();
    listTransactionUseCase = new ListTransactionUseCase(TransactionsRepository);
  });

  it('should be able list all user transactions.', async () => {
    const user = {
      email: 'exemplo222@gmail.com',
      name: 'test',
      password: 'senha123',
    };

    const newUser = await userRepository.create({ ...user });

    await TransactionsRepository.create({
      email: user.email,
      description: 'desc',
      value: '12',
    });

    const list = await listTransactionUseCase.execute(newUser.id);

    expect(list.transactions).toBeTruthy();
  });
});
