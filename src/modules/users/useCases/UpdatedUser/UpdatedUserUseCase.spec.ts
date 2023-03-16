import 'reflect-metadata';
import { hash, compare } from 'bcrypt';

import { prisma } from '@/database/prisma';
import { UpdatedUserUseCase } from './UpdatedUserUseCase';
import { UserRepositoryTestDB } from '../../infra/repository/test-db/UserRepositoryTestDB';

let userRepositoryTestDB: UserRepositoryTestDB;
let updatedUserUseCase: UpdatedUserUseCase;

describe('User Updated', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    userRepositoryTestDB = new UserRepositoryTestDB();
    updatedUserUseCase = new UpdatedUserUseCase(userRepositoryTestDB);
  });

  it('should be return updated user data ', async () => {
    const passwordHash = await hash('senha123', 9);
    const userInfos = {
      email: 'test@example.com',
      name: 'test',
      password: passwordHash,
    };

    await userRepositoryTestDB.create({
      ...userInfos,
    });

    const user = await userRepositoryTestDB.GetUserByEmail(userInfos.email);

    await updatedUserUseCase.execute({
      email: user?.email!,
      user_id: user?.id!,
      data_for_updated: {
        email: 'emailUpdated@example.com',
        name: 'NameUpdated',
        password: 'SenhaUpdated',
      },
    });
    const userListAfterUpdated = await userRepositoryTestDB.list();
    let { email, password, name } = userListAfterUpdated[0];

    expect(email).toEqual('emailUpdated@example.com');
    expect(name).toEqual('NameUpdated');
  });
});
