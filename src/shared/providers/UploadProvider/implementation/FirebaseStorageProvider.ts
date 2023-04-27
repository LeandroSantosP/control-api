import { getStorage } from 'firebase-admin/storage';
import { storage } from 'firebase-admin';
import stream from 'stream';
import sharp from 'sharp';

import { getUrlProps, IUploadProvider, saveInput } from '../IUploadProvider';

type mangerBufferProps = {
   bufferStream: stream.PassThrough;
   fileName: string;
   file: any;
};

export class FirebaseStorageProvider implements IUploadProvider {
   private readonly bufferStream;

   constructor() {
      this.bufferStream = new stream.PassThrough();
   }

   static mangerBuffer({
      bufferStream,
      file,
      fileName,
   }: mangerBufferProps): Promise<string | Error> {
      return new Promise((resolves, rejects) => {
         bufferStream
            .pipe(
               file.createWriteStream({
                  metadata: {
                     contentType: 'image/jpg',
                  },
                  resumable: false,
                  predefinedAcl: 'publicRead',
                  validation: 'md5',
               })
            )
            .on('error', (erro: Error) => {
               rejects(erro);
            })
            .on('finish', () => {
               console.log(`Imagem ${fileName} enviada com sucesso.`);
               resolves(fileName);
            });
      });
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
               const fileName = `images/user-?${user_id}.jpg`;
               return resolves(callback(res, fileName));
            })
            .catch((err) => reflect(err));
      });
   }

   async save(props: saveInput): Promise<void | string> {
      return await this.convertedToJpg(
         props.image?.buffer,
         props.user_id,
         async (buffer, fileName) => {
            const file = storage().bucket().file(fileName);

            try {
               const imageRef = await FirebaseStorageProvider.mangerBuffer({
                  bufferStream: this.bufferStream.end(buffer),
                  file,
                  fileName,
               });

               return typeof imageRef === 'string' ? imageRef : undefined;
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
