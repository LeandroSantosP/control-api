import 'reflect-metadata';

import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { UserRepositoryTestDB } from '../../../users/infra/repository/test-db/UserRepositoryTestDB';
import { CreateTransaction } from './CreateTransactionUseCase';
import { TransactionsRepositoryTestDB } from '../../infra/repository/test-db/TransactionsTestDB';
import { prisma } from '@/database/prisma';

let transactionRepositoryTestDB: TransactionsRepositoryTestDB;
let userRepositoryTestDB: UserRepositoryTestDB;
let createTransaction: CreateTransaction;

describe('Create Transaction', () => {
    beforeAll(async () => {
        await prisma.user.deleteMany();
    });
    beforeEach(async () => {
        transactionRepositoryTestDB = new TransactionsRepositoryTestDB();
        userRepositoryTestDB = new UserRepositoryTestDB();
        createTransaction = new CreateTransaction(
            userRepositoryTestDB,
            transactionRepositoryTestDB
        );
    });

    it('should not be able create an transaction if user does not logged.', async () => {
        await expect(
            createTransaction.execute({
                email: 'test11@example.com',
                description: 'Desc',
                value: '11',
                dueDate: '2023-03-12',
            })
        ).rejects.toThrow(new AppError('User does not exites!'));
    });

    it('should be able to create a transaction', async () => {
        const newUser = await userRepositoryTestDB.create({
            email: 'mariatest@example.com',
            name: 'John doe',
            password: 'senha123',
        });

        const newTransaction = await createTransaction.execute({
            email: 'mariatest@example.com',
            description: 'Desc',
            value: '11.1',
        });

        expect(newTransaction).toHaveProperty('id');
        expect(newTransaction?.description).toEqual('Desc');
        expect(newTransaction?.value).toBeTruthy();
        expect(newTransaction?.recurrence).toBeNull();
        expect(newTransaction?.installments).toBeNull();
        expect(newTransaction?.isSubscription).toBeNull();
        expect(newTransaction?.due_date).toBeNull();
        expect(newTransaction?.resolved).toBe(false);
        expect(newTransaction?.userId).toEqual(newUser.id);
    });

    it('should not be able create an transaction if data is in incorrect format.', async () => {
        const newUser = await userRepositoryTestDB.create({
            email: 'test14@example.com',
            name: 'John doe',
            password: 'senha123',
        });

        await expect(
            createTransaction.execute({
                email: newUser.email,
                description: 'Desc',
                value: 'wrong format' as any,
                dueDate: '2023-03-12',
            })
        ).rejects.toThrow(InvalidYupError);
    });
});
