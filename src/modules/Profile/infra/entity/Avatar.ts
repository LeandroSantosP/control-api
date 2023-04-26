import { AppError } from '@/shared/infra/middleware/AppError';

export class Avatar {
   private _value: Express.Multer.File | undefined;

   constructor(value: Express.Multer.File | undefined) {
      if (value === undefined) {
         return;
      }

      if (value.size > 1000) {
         throw new AppError('Image size is too large');
      }

      const [_, imageFormat] = value?.originalname?.split('.');

      if (
         imageFormat !== 'png' &&
         imageFormat !== 'jpg' &&
         imageFormat !== 'jpeg'
      ) {
         throw new AppError(
            'Image format not allowed, follow formats is allowed: png, jpg, jpeg'
         );
      }

      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
