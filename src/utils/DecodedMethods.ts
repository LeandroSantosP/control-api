import { AppError } from '@/shared/infra/middleware/AppError';
import { injectable } from 'tsyringe';

@injectable()
export class DecodedMethods {
   IsValidBase64(base64: string): boolean {
      const ValidChars = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!ValidChars.test(base64)) {
         return false;
      }

      const mod4 = base64.length % 4;
      if (mod4 !== 0) {
         return false;
      }

      return true;
   }

   DecodedBase64Basis(base64: string) {
      const IsCurrentFormat = this.IsValidBase64(base64);

      if (!IsCurrentFormat) {
         throw new AppError('Credentials are in the wrong format');
      }

      const decoded = Buffer.from(base64, 'base64').toString('utf-8');

      if (decoded.indexOf(':') === -1) {
         throw new AppError('Credentials are in the wrong format');
      }

      const [email, password] = decoded.split(':');

      return {
         email,
         password,
      };
   }
}
