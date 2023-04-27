import 'reflect-metadata';
import { Prisma } from '@prisma/client';

import { prisma } from '@/database/prisma';
import '@/jobs/firebase/firebase-init-test';
import CreateUserTest from '@/utils/CrateUserTEST';
import { AppError } from '@/shared/infra/middleware/AppError';
import { ConfigurationProfile } from './ConfigurationProfileUseCase';
import { ProfileRepositoryTestDB } from '../../infra/repository/test-db/ProfileRepositoryTestDB';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';
import { FirebaseStorageProvider } from '@/shared/providers/UploadProvider/implementation/FirebaseStorageProvider';

type ExpressMulterExpectedFile = Express.Multer.File | undefined;

let UserRepository: UserRepositoryTestDB;
let profileRepositoryTestDB: ProfileRepositoryTestDB;
let configurationsProfile: ConfigurationProfile;
let firebaseStorageProvider: FirebaseStorageProvider;

const file = {
   fieldname: 'avatar',
   originalname: 'example.jpg',
   encoding: '7bit',
   mimetype: 'image/jpeg',
   buffer: Buffer.from('example image buffer'),
   size: 1000,
} as ExpressMulterExpectedFile;

async function CreateProfileExecuteParams({
   file,
   id,
   salary = '100',
   update,
}: {
   update: boolean;
   id: string;
   file: any;
   salary?: string;
}) {
   return {
      update,
      profileInfos: {
         avatar: file,
         Birthday: '20/09/2000',
         phonenumber: '(11) 9999-11989',
         profession: 'test',
         salary,
      },
      user_id: id,
   };
}

describe('CreateProfile', () => {
   beforeEach(async () => {
      await prisma.profile.deleteMany({});
      await prisma.user.deleteMany({});
      UserRepository = new UserRepositoryTestDB();
      profileRepositoryTestDB = new ProfileRepositoryTestDB();
      firebaseStorageProvider = new FirebaseStorageProvider();
      configurationsProfile = new ConfigurationProfile(
         profileRepositoryTestDB,
         firebaseStorageProvider,
         UserRepository
      );
   });

   it('should be possible to create a initial profile config', async () => {
      const newUSER = await CreateUserTest();
      const params = await CreateProfileExecuteParams({
         id: newUSER.id,
         update: false,
         file: undefined,
      });

      const sutOne = await prisma.user.findFirst({
         where: { id: newUSER.id },
         include: {
            profile: true,
         },
      });

      expect(sutOne).toHaveProperty('profile', null);

      await expect(
         configurationsProfile.execute({ ...params })
      ).resolves.not.toThrowError();

      const sutTwo = await prisma.user.findFirst({
         where: { id: newUSER.id },
         include: {
            profile: true,
         },
      });
      expect(sutTwo).toHaveProperty(
         'profile.avatar',
         `images/user-?${newUSER.id}.jpg`
      );
   });

   it('Creating a new profile should not be possible if the user already has one.', async () => {
      const newUSER = await CreateUserTest();
      const params = await CreateProfileExecuteParams({
         id: newUSER.id,
         update: false,
         file: undefined,
      });

      await configurationsProfile.execute({ ...params });

      await expect(
         configurationsProfile.execute({ ...params })
      ).rejects.toThrowError();
   }) as Express.Multer.File | undefined;

   it('should not be possible to  updated a profile settings if the user does not have one.', async () => {
      const newUser = await CreateUserTest();
      const params = await CreateProfileExecuteParams({
         id: newUser.id,
         update: true,
         file,
      });

      await expect(
         configurationsProfile.execute({ ...params })
      ).rejects.toThrow(
         new AppError('User does not have a profile registered!')
      );
   });

   it('should be able to updated an user profile settings.', async () => {
      const newUser = await CreateUserTest();
      const params = await CreateProfileExecuteParams({
         id: newUser.id,
         update: true,
         file: undefined,
      });

      await prisma.profile.create({
         data: {
            User: {
               connect: {
                  id: newUser.id,
               },
            },
            avatar: 'test',
            dateOfBirth: 'test',
            phonenumber: null,
            profession: null,
            salary: new Prisma.Decimal('2000'),
         },
      });

      await expect(
         prisma.user.findFirst({
            where: { id: newUser.id },
            include: { profile: true },
         })
      ).resolves.toHaveProperty('profile.salary');

      const res2 = await configurationsProfile.execute({ ...params });
   });
});
