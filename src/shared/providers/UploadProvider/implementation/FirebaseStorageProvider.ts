import { getStorage } from 'firebase-admin/storage';
import { storage } from 'firebase-admin';
import sharp from 'sharp';

import { getUrlProps, IUploadProvider, saveInput } from '../IUploadProvider';

type mangerBufferProps = {
   image: Express.Multer.File | undefined;
   fileName: string;
   file: any;
   bufferToJpg: any;
};

export class FirebaseStorageProvider implements IUploadProvider {
   static async mangerBuffer({
      file,
      fileName,
      image,
      bufferToJpg,
   }: mangerBufferProps): Promise<string | Error> {
      const fileStream = file.createWriteStream({
         metadata: {
            contentType: image?.mimetype,
         },
         validation: 'md5',
      });

      await new Promise<void>((resolve, reject) => {
         fileStream
            .on('finish', () => {
               console.log(`Image ${fileName} send with success.`);
               resolve();
            })
            .on('error', (error: any) => {
               reject(error);
            })
            .end(bufferToJpg);
      });

      return fileStream;
   }

   convertedToJpg(
      buffer: any,
      user_id: string,
      callback: (params: Buffer, fileName: string) => unknown
   ): Promise<any> {
      return new Promise((resolves, reject) => {
         sharp(buffer)
            .jpeg({ quality: 90 })
            .toBuffer()
            .then((res) => {
               const fileName = `images/user-?${user_id}`;
               return resolves(callback(res, fileName));
            })
            .catch((err) => reject(err));
      });
   }

   async save(props: saveInput): Promise<void | string> {
      return await this.convertedToJpg(
         props.image?.buffer,
         props.user_id,
         async (buffer) => {
            try {
               const fileName = `images/user-?${props.user_id}`;
               const file = storage().bucket().file(fileName);

               await FirebaseStorageProvider.mangerBuffer({
                  file,
                  fileName,
                  image: props.image,
                  bufferToJpg: buffer,
               });

               return fileName;
            } catch (error) {
               throw new Error('Error on save image.');
            }
         }
      );
   }

   async deleteAll(): Promise<void | Error> {
      return new Promise(async (resolve, reject) => {
         try {
            await storage().bucket().deleteFiles({
               force: true,
            });

            return resolve(undefined);
         } catch (error: any) {
            return reject(error);
         }
      });
   }

   async getUrl({ imageRef, options }: getUrlProps): Promise<any> {
      const file = getStorage().bucket().file(imageRef);
      return new Promise((resolve, reject) => {
         file.getSignedUrl({ ...options }, (err, url) => {
            if (err) {
               console.error(err);
               reject(err);
               return;
            } else {
               resolve(url);
            }
         });
      });
   }
}
