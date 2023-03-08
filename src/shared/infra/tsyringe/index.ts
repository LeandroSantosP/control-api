import { container } from 'tsyringe';

import '../../providers/index';

import { UserRepository } from '@/modules/users/infra/repository/implementation/UserRepository';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
