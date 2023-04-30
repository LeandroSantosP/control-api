import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';
import { IProfileModel } from '../infra/repository/IProfileModel';
import { AppError } from '@/shared/infra/middleware/AppError';
import { Profile } from '../infra/entity/Profile';
import { inject, injectable } from 'tsyringe';

type profileInfos = {
   avatar: Express.Multer.File | undefined;
   profession: string | undefined;
   salary: string;
   phonenumber: string;
   Birthday: string;
};

type IRequest = {
   user_id: string;
   profile_id?: string;
   update: boolean;
   profileInfos: profileInfos;
};

type IResponse = { imageRef: string | void; ProfileEntity: Profile };

@injectable()
export class ConfigurationProfile {
   constructor(
      @inject('ProfileRepository')
      private readonly ProfileRepository: IProfileModel,
      @inject('FirebaseStorageProvider')
      private readonly FirebaseStorageProvider: IUploadProvider,
      @inject('UserRepository')
      private readonly UserRepository: IUserRepository
   ) {}

   static async UseFireBaseStorage({
      profileInfos,
      FirebaseStorageProvider,
      user_id,
      isUpdate = false,
   }: {
      FirebaseStorageProvider: IUploadProvider;
      profileInfos: profileInfos;
      user_id: string;
      isUpdate: boolean;
   }): Promise<IResponse> {
      const ProfileEntity = Profile.create({ ...profileInfos });

      const imageRef = await FirebaseStorageProvider.save({
         image: await ProfileEntity.avatar.getValue(),
         user_id,
         isUpdate,
      });

      return { imageRef, ProfileEntity };
   }

   async execute({
      update,
      profileInfos,
      user_id,
      profile_id,
   }: IRequest): Promise<{
      id: string;
      profession: string | null;
      salary: any;
      phonenumber: string | null;
      dateOfBirth: string | null;
   }> {
      const user = await this.UserRepository.GetUserById(user_id);

      if (update === undefined) {
         throw new AppError('update is required.');
      }

      /* Create new Profile */
      if (update === false && profile_id === undefined) {
         if (user?.profile !== null) {
            throw new AppError('User already has a profile');
         }

         const { ProfileEntity, imageRef } =
            await ConfigurationProfile.UseFireBaseStorage({
               FirebaseStorageProvider: this.FirebaseStorageProvider,
               profileInfos,
               user_id,
               isUpdate: false,
            });

         const { avatar: _, ...profile } = await this.ProfileRepository.create({
            userId: user_id,
            profession: ProfileEntity.profession,
            salary: ProfileEntity.salary.getValue,
            phonenumber: ProfileEntity.phonenumber.getValue,
            Birthday: ProfileEntity.Birthday.getValue,
            avatar: imageRef as string,
         });

         return profile;
      }

      /* Updated User Profile */

      if (user?.profile === null) {
         throw new AppError('User does not have a profile registered!');
      } else if (profile_id === undefined) {
         throw new AppError('profile_id is required.');
      }

      Object.entries(user?.profile!).forEach(([key, value]) => {
         if (key !== 'id') {
            return;
         }
         if (value !== profile_id) {
            throw new AppError('Not Authorized.', 401);
         }
      });

      const { ProfileEntity, imageRef } =
         await ConfigurationProfile.UseFireBaseStorage({
            FirebaseStorageProvider: this.FirebaseStorageProvider,
            user_id,
            profileInfos,
            isUpdate: true,
         });

      const { avatar: _, ...profile } = await this.ProfileRepository.updated({
         profile_id: profile_id,
         avatar: imageRef as string,
         Birthday: ProfileEntity.Birthday.getValue,
         phonenumber: ProfileEntity.phonenumber.getValue,
         profession: ProfileEntity.profession,
         salary: ProfileEntity.salary.getValue,
      });

      return profile;
   }
}
