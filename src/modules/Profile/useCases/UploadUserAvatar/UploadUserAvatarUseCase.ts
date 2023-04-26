import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IUploadProvider } from '@/shared/providers/UploadProvider/IUploadProvider';
interface IRequest {
   user_id: string;
   image: Express.Multer.File | undefined;
}

@injectable()
export class UploadUserAvatarUseCase {
   constructor(
      @inject('FirebaseStorageProvider')
      private FirebaseStorageProvider: IUploadProvider
   ) {}

   async execute({ image, user_id }: IRequest) {
      if (!image) {
         throw new AppError('Image not found');
      }

      const [_, imageFormat] = image?.originalname?.split('.');

      if (
         imageFormat !== 'png' &&
         imageFormat !== 'jpg' &&
         imageFormat !== 'jpeg'
      ) {
         throw new AppError(
            'Image format not allowed, follow formats is allowed: png, jpg, jpeg'
         );
      }

      const imageRef = await this.FirebaseStorageProvider.save({
         image,
         user_id,
      });

      return;
   }
}
