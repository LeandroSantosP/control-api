import { Transaction } from '@prisma/client';

export interface ITransactionsRepositoryProps {
  value: number;
  description: string;
  email: string;
}

export abstract class ITransactionsRepository {
  abstract create({
    description,
    value,
    email,
  }: ITransactionsRepositoryProps): Promise<Transaction>;

  abstract GetUserTransactionsById(
    user_id: string
  ): Promise<Transaction[] | null>;
}
