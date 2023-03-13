import { prisma } from '@/database/prisma';
import { Transaction } from '@prisma/client';
import {
  ITransactionsRepository,
  ITransactionsRepositoryProps,
} from '../ITransactionsRepository';

export class TransactionsTestDB implements ITransactionsRepository {
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
}
