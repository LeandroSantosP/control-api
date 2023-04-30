import 'reflect-metadata';
import { UserRepositoryTestDB } from '../infra/repository/test-db/UserRepositoryTestDB';
import { InviteEmailResetPassUseCase } from './InviteEmailResetPassUseCase';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';
import CreateUserTest from '@/utils/CrateUserTEST';
import { EmailProviderInMemory } from '@/shared/providers/SederEmailProvider/implementation/EtherealProviderInMemory';
import { AppError } from '@/shared/infra/middleware/AppError';
import { prisma } from '@/database/prisma';

let userRepository: UserRepositoryTestDB;
let dayFnsProvider: DateFnsProvider;
let etherealProvider: EmailProviderInMemory;
let inviteEmailResetPassUseCase: InviteEmailResetPassUseCase;

describe('InviteEmailReset', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      await prisma.userTokens.deleteMany({});
      userRepository = new UserRepositoryTestDB();
      dayFnsProvider = new DateFnsProvider();
      etherealProvider = new EmailProviderInMemory();

      inviteEmailResetPassUseCase = new InviteEmailResetPassUseCase(
         userRepository,
         dayFnsProvider,
         etherealProvider
      );
   });

   it('should be able to send an email to reset password.', async () => {
      const newUser = await CreateUserTest({ email: 'joao@gmail.com' });
      const sut = await inviteEmailResetPassUseCase.execute(newUser.email);

      expect(sut).toBe(undefined);
   });

   it('should throw erro if user email does not exits.', async () => {
      await expect(() =>
         inviteEmailResetPassUseCase.execute('user_invalid@gmail.com')
      ).rejects.toThrow(new AppError('User does not exists'));
   });

   it('should throw erro if user email does not exits.', async () => {
      const newUser = await CreateUserTest({ email: 'joao@gmail.com' });
      await inviteEmailResetPassUseCase.execute(newUser.email);

      expect(etherealProvider.message).toHaveLength(1);
      expect(etherealProvider.message[0]).toHaveProperty(
         'subject',
         'Recuperação de senha'
      );
      expect(etherealProvider.message[0]).toHaveProperty(
         'to',
         'joao@gmail.com'
      );
   });
});
