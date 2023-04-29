import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';
import { Profile } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { Avatar } from '../../infra/entity/Avatar';
import { IProfileModel } from '../../infra/repository/IProfileModel';

type IRequest = {
   user_id: string;
};

@injectable()
export class GetProfileUseCase {
   private readonly Avatar: typeof Avatar = Avatar;

   constructor(
      @inject('UserRepository')
      private readonly UserRepository: IUserRepository,
      @inject('ProfileRepository')
      private readonly ProfileRepository: IProfileModel,
      @inject('FirebaseStorageProvider')
      private readonly FirebaseStorageProvider: IUploadProvider
   ) {}

   async execute(params: IRequest) {
      const user = await this.UserRepository.GetUserById(params.user_id);
      if (!user?.profile) {
         throw new AppError('Profile not found', 404);
      }
      const profile = await this.ProfileRepository.getProfile({
         user_id: params.user_id,
         profile_id: user.profile.id,
      });

      if (profile === null) {
         throw new AppError('Profile not found', 404);
      }
      const { avatar: imageRef } = profile satisfies Profile;

      const imageUrl = await this.FirebaseStorageProvider.getUrl({
         imageRef,
         options: {
            action: 'read',
            content_type: 'image/png',
            expires: '03-17-2025',
         },
      });

      this.Avatar.setImageURL = imageUrl;

      const userToObjInfos = profile.User[0];
      let { User, ...dataFormat } = {
         ...profile,
         user: userToObjInfos,
      };

      return { ...dataFormat, avatar: this.Avatar.getImageURL };
   }
}
