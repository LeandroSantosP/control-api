import { AppError } from '@/shared/infra/middleware/AppError';
import path from 'path';
import fs from 'fs';

export class Avatar {
   private _value: Express.Multer.File | undefined;
   private static imagesURL: string;

   constructor(value: Express.Multer.File | undefined) {
      if (value === undefined) {
         return;
      }

      //validar se o image buffer e valido

      if (value.size > 217900) {
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

   static set setImageURL(imageURK: string) {
      if (!imageURK.startsWith('https://storage.googleapis.com')) {
         throw new AppError('Image URL domain is invalid');
      }

      Avatar.imagesURL = imageURK;
      return;
   }

   static get getImageURL() {
      return Avatar.imagesURL;
   }

   private async format() {
      const imagePath = path.resolve(
         __dirname,
         '..',
         '..',
         'avatar/profilePic.jpg'
      );
      const imageBuffer = await new Promise<Buffer>((resolve, rejects) => {
         fs.readFile(imagePath, (err, data) => {
            if (err) return rejects(err);
            return resolve(data);
         });
      });

      const file = {
         fieldname: 'avatar',
         originalname: 'example.jpg',
         encoding: '7bit',
         mimetype: 'image/jpg',
         buffer: imageBuffer,
         size: imageBuffer.length,
      } as Express.Multer.File;
      return file;
   }

   async getValue() {
      if (this._value == undefined) {
         this._value = await this.format();

         return this._value;
      }
      return this._value;
   }
}
