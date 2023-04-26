import multer from 'multer';
import { resolve } from 'path';
const uploadFolder = resolve(__dirname, '..', 'tmp');

export default {
   uploadFolder,
   storage: multer.memoryStorage(),
};

/*
multer.diskStorage({
      destination: uploadFolder,
      filename: (req, file, callback) => {
         const fileHash = crypto.randomBytes(16).toString('hex');
         const fileName = `${fileHash}-${file.originalname}`;

         return callback(null, fileName);
      },
   })

*/
