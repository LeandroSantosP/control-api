import 'reflect-metadata';

import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';
import { UserRepositoryTestDB } from '../infra/repository/test-db/UserRepositoryTestDB';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { ResetPasswordUseCase } from './ResetPassWordUseCase';
import CreateUserTest from '@/utils/CrateUserTEST';
import { prisma } from '@/database/prisma';
import { randomUUID } from 'crypto';
import { compare } from 'bcrypt';
import { AppError } from '@/shared/infra/middleware/AppError';

let dayFnsProvider: IDateProvider;
let userRepository: UserRepositoryTestDB;
let resetPasswordUseCase: ResetPasswordUseCase;

interface CreateInitialSettingProps {
   userSettings: {
      email: string;
      password: string;
   };
   hors?: number;
}

async function CreateInitialSetting({
   userSettings,
   hors = 3,
}: CreateInitialSettingProps): Promise<{
   userBefore: any;
   token: string;
   newUser: any;
}> {
   const newUser = await CreateUserTest({
      ...userSettings,
   });

   const userBefore = await userRepository.GetUserById(newUser.id);

   const token = randomUUID();

   await prisma.user.update({
      where: {
         id: newUser.id,
      },
      data: {
         UserTokens: {
            create: {
               expire_date: dayFnsProvider.addHours(hors),
               token,
            },
         },
      },
   });

   return { userBefore, token, newUser };
}

describe('ResetPassword', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany({});
      await prisma.userTokens.deleteMany({});

      dayFnsProvider = new DateFnsProvider();
      userRepository = new UserRepositoryTestDB();
      resetPasswordUseCase = new ResetPasswordUseCase(userRepository);
   });

   it('should be able to send reset password email', async () => {
      const { userBefore, token, newUser } = await CreateInitialSetting({
         userSettings: {
            email: 'joão@gmail.com',
            password: 'senha123',
         },
      });

      expect(await compare('senha123', userBefore!.password)).toBeTruthy();

      /* Updated password */
      await resetPasswordUseCase.execute({
         token,
         newPassword: 'MyNewPassword',
      });

      const userAfter = await userRepository.GetUserById(newUser.id);

      expect(await compare('MyNewPassword', userAfter!.password)).toBeTruthy();
   });

   it('should throw an error if token is wrong.', async () => {
      await CreateInitialSetting({
         userSettings: {
            email: 'joão@gmail.com',
            password: 'XXXXX3333',
         },
      });

      await expect(() =>
         resetPasswordUseCase.execute({
            token: 'wrongToken',
            newPassword: 'XXXXXXXXXXXXX',
         })
      ).rejects.toThrow(new AppError('Invalid Token!'));
   });

   it('should throw new error if token is expired.', async () => {
      const { token } = await CreateInitialSetting({
         userSettings: {
            email: 'joão@gmail.com',
            password: 'XXXXX3333',
         },
         hors: -3,
      });

      await expect(() =>
         resetPasswordUseCase.execute({
            token,
            newPassword: 'MyNewPassword',
         })
      ).rejects.toThrow(new AppError('Token expired!'));
   });

   it('should throw new error if password id invalid.', async () => {
      const { token } = await CreateInitialSetting({
         userSettings: {
            email: 'joão@gmail.com',
            password: 'XXXXX3333',
         },
         hors: -3,
      });

      await expect(() =>
         resetPasswordUseCase.execute({
            token,
            // @ts-ignore
            newPassword: undefined,
         })
      ).rejects.toThrow(new AppError('Invalid password!'));
   });
});
