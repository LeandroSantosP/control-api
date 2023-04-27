import { AppError } from '@/shared/infra/middleware/AppError';
import path from 'path';
import fs from 'fs';

export class Avatar {
   private _value: Express.Multer.File | undefined;

   constructor(value: Express.Multer.File | undefined) {
      if (value === undefined) {
         return;
      }

      //validar se o image buffer e valido

      if (value.size > 217900) {
         throw new AppError('Image size is too large');
      }
      console.log(value.originalname);

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

   private async format() {
      const imagePath = path.resolve(__dirname, '..', '..', 'avatar/robot.png');
      const imageBuffer = await new Promise<Buffer>((resolve, rejects) => {
         fs.readFile(imagePath, (err, data) => {
            if (err) return rejects(err);
            return resolve(data);
         });
      });

      const file = {
         fieldname: 'avatar',
         originalname: 'example.png',
         encoding: '7bit',
         mimetype: 'image/png',
         buffer: imageBuffer,
         size: imageBuffer.length,
      } as Express.Multer.File;
      return file;
   }

   async getValue() {
      if (this._value == undefined) {
         return (this._value = await this.format());
      }
      return this._value;
   }
}
