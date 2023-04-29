import 'reflect-metadata';
import { prisma } from '@/database/prisma';
import CreateUserTest from '@/utils/CrateUserTEST';
import { describe } from 'node:test';
import { AppError } from '@/shared/infra/middleware/AppError';
import { FirebaseStorageProvider } from '@/shared/providers/UploadProvider/implementation/FirebaseStorageProvider';
import { ProfileRepositoryTestDB } from '../../infra/repository/test-db/ProfileRepositoryTestDB';
import { ConfigurationProfile } from '../ConfigurationProfile/ConfigurationProfileUseCase';
import { CreateProfileExecuteParams } from '../ConfigurationProfile/ConfigurationProfileUseCase.spec';
import { UserRepositoryTestDB } from '@/modules/users/infra/repository/test-db/UserRepositoryTestDB';

import { GetProfileUseCase } from './GetProfileUseCase';

let UserRepository: UserRepositoryTestDB;
let profileRepositoryTestDB: ProfileRepositoryTestDB;
let firebaseStorageProvider: FirebaseStorageProvider;
let getProfileUseCase: GetProfileUseCase;
let configurationsProfile: ConfigurationProfile;

describe('GetProfileUseCase', () => {
   beforeEach(async () => {
      await prisma.user.deleteMany();
      await prisma.profile.deleteMany();
      UserRepository = new UserRepositoryTestDB();
      profileRepositoryTestDB = new ProfileRepositoryTestDB();
      firebaseStorageProvider = new FirebaseStorageProvider();
      configurationsProfile = new ConfigurationProfile(
         profileRepositoryTestDB,
         firebaseStorageProvider,
         UserRepository
      );
      getProfileUseCase = new GetProfileUseCase(
         UserRepository,
         profileRepositoryTestDB,
         firebaseStorageProvider
      );
   });

   it('should return new erro if user not have a profile.', async () => {
      const newUSER = await CreateUserTest();
      await expect(() =>
         getProfileUseCase.execute({ user_id: newUSER.id })
      ).rejects.toThrow(new AppError('Profile not found', 404));
   });

   it('should be able to get user profile', async () => {
      const newUSER = await CreateUserTest();

      const params = await CreateProfileExecuteParams({
         id: newUSER.id,
         update: false,
         file: undefined,
      });

      await configurationsProfile.execute({ ...params });
      const SUT = await getProfileUseCase.execute({ user_id: newUSER.id });

      expect(SUT).toBeTruthy();
   });

   it('should be possible get id,name and email from response.', async () => {
      const newUSER = await CreateUserTest({
         email: 'joão@gmail.com',
         name: 'joão',
      });

      const params = await CreateProfileExecuteParams({
         id: newUSER.id,
         update: false,
         file: undefined,
      });

      await configurationsProfile.execute({ ...params });
      const SUT = await getProfileUseCase.execute({ user_id: newUSER.id });

      expect(SUT.user.email).toBe('joão@gmail.com');
      expect(SUT.user.name).toBe('joão');
      expect(SUT.user.id).toBe(newUSER.id);
   });
});
