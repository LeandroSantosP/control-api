import { FirebaseStorageProvider } from '@/shared/providers/UploadProvider/implementation/FirebaseStorageProvider';
import CreateUserTest from '@/utils/CrateUserTEST';
import { ProfileRepositoryTestDB } from '../../infra/repository/test-db/ProfileRepositoryTestDB';
import { ConfigurationProfile } from './ConfigurationProfileUseCase';

let profileRepositoryTestDB: ProfileRepositoryTestDB;
let configurationsProfile: ConfigurationProfile;
let firebaseStorageProvider: FirebaseStorageProvider;

describe('CreateProfile', () => {
   beforeEach(async () => {
      profileRepositoryTestDB = new ProfileRepositoryTestDB();
      firebaseStorageProvider = new FirebaseStorageProvider();
      configurationsProfile = new ConfigurationProfile(
         profileRepositoryTestDB,
         firebaseStorageProvider
      );
   });

   it('should be possible to create a initial profile config', async () => {
      const newUSER = await CreateUserTest();

      const file = {
         fieldname: 'avatar',
         originalname: 'example.jpg',
         encoding: '7bit',
         mimetype: 'image/jpeg',
         buffer: Buffer.from('example image buffer'),
         size: 1000,
      } as Express.Multer.File | undefined;

      const sut = await configurationsProfile.execute({
         update: false,
         profileInfos: {
            avatar: file,
            Birthday: '20/09/2000',
            marital_state: 'test',
            phonenumber: '(11) 9999-11989',
            profession: 'test',
            salary: '100',
         },
         user_id: newUSER.id,
      });
   });
});
