import { container } from 'tsyringe';

import '../../providers/index';

import { UserRepository } from '@/modules/users/infra/repository/implementation/UserRepository';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { TransactionsRepository } from '@/modules/transactions/infra/repository/implementation/TransactionsRepository';
import { ITransactionsRepository } from '@/modules/transactions/infra/repository/ITransactionsRepository';
import { Transaction } from '@prisma/client';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<ITransactionsRepository<Transaction>>(
   'TransactionsRepository',
   TransactionsRepository
);
