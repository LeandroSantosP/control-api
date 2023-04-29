import { getStorage } from 'firebase-admin/storage';
import { storage } from 'firebase-admin';
import stream from 'stream';
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
               console.log(`Imagem ${fileName} enviada com sucesso.`);
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
      return new Promise((resolves, reflect) => {
         sharp(buffer)
            .jpeg({ quality: 90 })
            .toBuffer()
            .then((res) => {
               const fileName = `images/user-?${user_id}`;
               return resolves(callback(res, fileName));
            })
            .catch((err) => reflect(err));
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
               throw new Error('Erro ao enviar imagem.');
            }
         }
      );
   }

   delete<I, O>(props: I): Promise<O> {
      throw new Error('Method not implemented.');
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
