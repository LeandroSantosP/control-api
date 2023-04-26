import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';
import { Profile } from '../../infra/entity/Profile';
import { IProfileModel } from '../../infra/repository/IProfileModel';

type profileInfos = {
   avatar: Express.Multer.File | undefined;
   profession: string | undefined;
   salary: string;
   phonenumber: string;
   Birthday: string;
};

type IRequest = {
   user_id: string;
   update: boolean;
   profileInfos?: profileInfos;
};

export class ConfigurationProfile {
   constructor(
      private readonly ProfileRepository: IProfileModel,
      private FirebaseStorageProvider: IUploadProvider
   ) {}

   async execute({ update, profileInfos }: IRequest) {
      if (update === false && profileInfos !== undefined) {
         const ProfileEntity = Profile.create({ ...profileInfos });
         return ProfileEntity;
      }

      // const profile = await this.ProfileRepository.create({})

      return;
   }
}
