import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';
import { inject, injectable } from 'tsyringe';
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

@injectable()
export class ConfigurationProfile {
   constructor(
      @inject('ProfileRepository')
      private readonly ProfileRepository: IProfileModel,
      @inject('FirebaseStorageProvider')
      private FirebaseStorageProvider: IUploadProvider
   ) {}

   async execute({ update, profileInfos, user_id }: IRequest) {
      if (update === false && profileInfos !== undefined) {
         const ProfileEntity = Profile.create({ ...profileInfos });

         const imageRef = await this.FirebaseStorageProvider.save({
            image: ProfileEntity.avatar.getValue,
            user_id,
         });

         const profile = await this.ProfileRepository.create({
            userId: user_id,
            profession: ProfileEntity.profession,
            salary: ProfileEntity.salary.getValue,
            phonenumber: ProfileEntity.phonenumber.getValue,
            Birthday: ProfileEntity.Birthday.getValue,
            avatar: imageRef as string,
         });

         return profile;
      }

      return;
   }
}
