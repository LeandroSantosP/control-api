import fs from 'fs';
import { resolve } from 'path';

import upload from '@/config/UploadConfig';
import { IUploadProvider } from '../IUploadProvider';

export class LocalStorageProvider implements IUploadProvider {
   async save(file: string, folder: string): Promise<string> {
      await fs.promises.rename(
         resolve(upload.uploadFolder, file),
         resolve(`${upload.uploadFolder}/${folder}`, file)
      );
      return file;
   }
   async delete(file: string, folder: string): Promise<void> {
      const fileName = resolve(`${upload.uploadFolder}/${folder}`, file);

      try {
         await fs.promises.unlink(fileName);
      } catch (error) {
         return;
      }
   }
}
