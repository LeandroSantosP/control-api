import { storage } from 'firebase-admin';
import stream from 'stream';
import { IUploadProvider, saveInput } from '../IUploadProvider';
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
      return bufferStream
         .pipe(
            file.createWriteStream({
               metadata: {
                  contentType: 'image/jpeg',
               },
               resumable: false,
               predefinedAcl: 'publicRead',
               validation: 'md5',
            })
         )
         .on('error', (erro: Error) => {
            return erro;
         })
         .on('finish', () => {
            console.log(`Imagem ${fileName} enviada com sucesso.`);
            return fileName;
         });
   }

   async save(props: saveInput): Promise<void | string> {
      const fileName = `images/user-?${props.user_id}.jpg`;

      const file = storage().bucket().file(fileName);

      try {
         const imageRef = await FirebaseStorageProvider.mangerBuffer({
            bufferStream: this.bufferStream.end(props?.image?.buffer),
            file,
            fileName,
         });

         return typeof imageRef === 'string' ? imageRef : undefined;
      } catch (error) {
         throw new Error('Erro ao enviar imagem.');
      }
   }
   delete<I, O>(props: I): Promise<O> {
      throw new Error('Method not implemented.');
   }
}
