import 'reflect-metadata';

import { prisma } from '@/database/prisma';
import { UpdatedUserUseCase } from './UpdatedUserUseCase';
import { UserRepositoryTestDB } from '../infra/repository/test-db/UserRepositoryTestDB';
import CreateUserTest from '@/utils/CrateUserTEST';

let userRepositoryTestDB: UserRepositoryTestDB;
let updatedUserUseCase: UpdatedUserUseCase;

describe('User Updated', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      userRepositoryTestDB = new UserRepositoryTestDB();
      updatedUserUseCase = new UpdatedUserUseCase(userRepositoryTestDB);
   });

   it('should be return updated user data ', async () => {
      await CreateUserTest();

      const user = await userRepositoryTestDB.GetUserByEmail(
         'test@example.com'
      );

      await updatedUserUseCase.execute({
         email: user?.email!,
         user_id: user?.id!,
         data_for_updated: {
            email: 'emailUpdated@example.com',
            name: 'NameUpdated',
            password: 'senha123',
         },
      });

      const userListAfterUpdated = await userRepositoryTestDB.list();
      let { email, password, name } = userListAfterUpdated[0];

      expect(email).toEqual('emailUpdated@example.com');
      expect(name).toEqual('NameUpdated');
   });
});
