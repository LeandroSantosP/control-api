import 'reflect-metadata';

import { AppError } from '@/shared/infra/middleware/AppError';
import { UserRepositoryTestDB } from '../../../users/infra/repository/test-db/UserRepositoryTestDB';
import { CreateTransaction } from './CreateTransactionUseCase';
import { TransactionsTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { CreateTransactionsController } from './CreateTransactionsController';

let transactionRepositoryTestDB: TransactionsTestDB;
let userRepositoryTestDB: UserRepositoryTestDB;
let createTransaction: CreateTransaction;

describe('Create Transaction', () => {
  beforeEach(() => {
    transactionRepositoryTestDB = new TransactionsTestDB();
    userRepositoryTestDB = new UserRepositoryTestDB();
    createTransaction = new CreateTransaction(
      userRepositoryTestDB,
      transactionRepositoryTestDB
    );
  });

  it('should not be able create an transaction if user does not logged.', async () => {
    expect(
      async () =>
        await createTransaction.execute({
          email: 'test@example.com',
          description: 'Desc',
          value: 11,
        })
    ).rejects.toThrow(new AppError('User does not exites!'));
  });

  it('should be able to create a transaction', async () => {
    const newUser = await userRepositoryTestDB.create({
      email: 'test2@example.com',
      name: 'John doe',
      password: 'senha123',
    });

    const newTransaction = await createTransaction.execute({
      email: 'test2@example.com',
      description: 'Desc',
      value: 11,
    });

    expect(newTransaction).toHaveProperty('id');
    expect(newTransaction?.description).toEqual('Desc');
    expect(newTransaction?.value).toEqual(11);
    expect(newTransaction?.recurrence).toBeNull();
    expect(newTransaction?.installments).toBeNull();
    expect(newTransaction?.isSubscription).toBeNull();
    expect(newTransaction?.due_date).toBeNull();
    expect(newTransaction?.resolved).toBe(false);
    expect(newTransaction?.userId).toEqual(newUser.id);
  });
});
