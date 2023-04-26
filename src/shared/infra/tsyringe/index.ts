import { container } from 'tsyringe';

import '../../providers/index';

import { UserRepository } from '@/modules/users/infra/repository/implementation/UserRepository';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { TransactionsRepository } from '@/modules/transactions/infra/repository/implementation/TransactionsRepository';
import { ITransactionsRepository } from '@/modules/transactions/infra/repository/ITransactionsRepository';
import { Transaction } from '@prisma/client';
import { IGoalsRepository } from '@/modules/Goals/infra/repository/IGoalsRepository';
import { GoalsRepository } from '@/modules/Goals/infra/repository/implementations/GoalsRepository';
import { ProfileRepository } from '@/modules/Profile/infra/repository/implementation/ProfileRepository';
import { IProfileModel } from '@/modules/Profile/infra/repository/IProfileModel';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IGoalsRepository>(
   'GoalsRepository',
   GoalsRepository
);

container.registerSingleton<ITransactionsRepository>(
   'TransactionsRepository',
   TransactionsRepository
);

container.registerSingleton<IProfileModel>(
   'ProfileRepository',
   ProfileRepository
);
