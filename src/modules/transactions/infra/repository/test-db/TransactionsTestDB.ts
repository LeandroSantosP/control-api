import { prisma } from '@/database/prisma';
import { Transaction, User } from '@prisma/client';
import {
  ITransactionsRepository,
  ITransactionsRepositoryProps,
} from '../ITransactionsRepository';

export class TransactionsRepositoryTestDB implements ITransactionsRepository {
  private prisma;

  constructor() {
    this.prisma = prisma;

    prisma.transaction.deleteMany();
  }

  async create({
    description,

    value,
    email,
  }: ITransactionsRepositoryProps): Promise<Transaction> {
    const newTransaction = await this.prisma.transaction.create({
      data: {
        description,
        value,
        author: {
          connect: {
            email,
          },
        },
      },
    });
    return newTransaction;
  }

  async GetUserTransactionsById(
    user_id: string
  ): Promise<Transaction[] | null> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId: user_id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return transactions;
  }
}
