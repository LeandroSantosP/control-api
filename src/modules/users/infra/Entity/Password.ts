import { hash, compare } from 'bcrypt';
import auth from '@/config/auth';
import { AppError } from '@/shared/infra/middleware/AppError';

export class Password {
   private static salt: typeof auth = auth;

   constructor(private readonly value: string) {}

   static async create(
      password: string,
      saltCustom?: number
   ): Promise<Password> {
      if (!password) throw new Error('Password is required');

      if (password.length < 8)
         throw new Error('Password must be at least 8 characters long');

      const [...props] = password.split('');

      const numbers = props.map(Number).filter((num) => !isNaN(num));

      if (numbers.length < 3) {
         throw new AppError('Password must contain at least 3 numbers!');
      }

      let { saltRounds } = Password.salt;
      const passwordHash = await hash(
         password,
         saltCustom ? saltCustom : saltRounds
      );

      return new Promise((resolve) => {
         resolve(new Password(passwordHash));
      });
   }

   get GetPassWordHash() {
      return this.value;
   }

   async validade(password: string, passwordHash: string): Promise<boolean> {
      return await compare(password, passwordHash);
   }
}
