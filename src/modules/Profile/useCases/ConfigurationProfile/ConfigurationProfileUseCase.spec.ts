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
import { randomUUID } from 'crypto';

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
   profile_id,
}: {
   update: boolean;
   id: string;
   file: any;
   salary?: string;
   profile_id?: string;
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
      profile_id: profile_id,
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
         profile_id: 'test',
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
         profile_id: 'test',
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

      const user = await prisma.user.findFirst({
         where: { id: newUser.id },
         include: { profile: true },
      });

      expect(user).toHaveProperty('profile.salary');
      const profile = await prisma.profile.findFirst({
         where: { id: user?.profile?.id },
      });

      const res2 = await configurationsProfile.execute({
         ...params,
         profileInfos: {
            ...params.profileInfos,
            salary: '9000',
            profession: 'developer',
         },
         profile_id: profile!.id,
      });

      expect(Number(res2.salary)).toBe(9000);
      expect(res2.profession).toBe('developer');
   });

   it('should return an error if profile id is not equal to the user id in question.', async () => {
      const newUserONE = await CreateUserTest({ email: 'leandro@example.com' });

      const params = await CreateProfileExecuteParams({
         id: newUserONE.id,
         update: false,
         file: undefined,
      });
      await configurationsProfile.execute({ ...params });

      const sut = await prisma.user.findFirst({
         where: { id: newUserONE.id },
         include: {
            profile: true,
         },
      });

      await expect(
         configurationsProfile.execute({
            ...params,
            update: true,
            profile_id: randomUUID(),
         })
      ).rejects.toThrow(new AppError('Not Authorized.', 401));
   });
});
