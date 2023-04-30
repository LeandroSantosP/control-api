import 'reflect-metadata';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { JwtAuthProvider } from '@/shared/providers/AuthProvider/implementation/JwtAuthProvider';
import { UserRepositoryInMemory } from '../infra/repository/in-memory/UserRepositoryInMemory';
import { DeleteUserUseCase } from './DeleteUserUseCase';
import { prisma } from '@/database/prisma';

let userRepositoryInMemory: UserRepositoryInMemory;
let jwtAuthProvider: IAuthProvider;
let deleteUserUseCase: DeleteUserUseCase;

describe('Delete User', () => {
   beforeAll(async () => {
      await prisma.user.deleteMany();
   });
   beforeEach(() => {
      userRepositoryInMemory = new UserRepositoryInMemory();
      jwtAuthProvider = new JwtAuthProvider();

      deleteUserUseCase = new DeleteUserUseCase(
         userRepositoryInMemory,
         jwtAuthProvider
      );
   });

   it('should be able authentication user delete hes own account', async () => {
      const userInfos = {
         email: 'test@example.com',
         password: 'senha123',
         name: 'John doe',
      };
      const user = await userRepositoryInMemory.create({ ...userInfos });

      const allUser = await userRepositoryInMemory.list();

      expect(allUser[0]).toHaveProperty('id', user.id);
      expect(allUser[0]).toHaveProperty('email', user.email);
      expect(allUser[0]).toHaveProperty('name', user.name);
      expect(allUser[0]).toHaveProperty('password', user.password);

      await deleteUserUseCase.execute({
         email: user.email,
         password: userInfos.password,
         user_id: user.id!,
      });

      expect(allUser).toHaveLength(0);
      expect(allUser[0]).toBeFalsy();
   });
});
