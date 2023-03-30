import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IUserRepository } from '../../infra/repository/IUserRepository';
import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';

interface IRequest {
   user_id: string;
   avatar_ref: string;
}

@injectable()
export class UploadUserAvatarUseCase {
   constructor(
      @inject('UserRepository')
      private UserRepository: IUserRepository,
      @inject('LocalStorageProvider')
      private LocalStorageProvider: IUploadProvider
   ) {}

   async execute({ avatar_ref, user_id }: IRequest) {
      const user = await this.UserRepository.GetUserById(user_id);

      if (!user) {
         throw new AppError('User not found');
      }

      if (user?.avatar) {
         this.LocalStorageProvider.delete(user.avatar, 'avatar');
      }

      const file = await this.LocalStorageProvider.save(avatar_ref, 'avatar');

      const result = await this.UserRepository.UploadAvatar({
         avatar_ref: file,
         user_id,
      });

      return result;
   }
}
