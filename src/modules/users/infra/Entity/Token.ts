import { AppError } from '@/shared/infra/middleware/AppError';
import { IUserRepository } from '../repository/IUserRepository';

export class Token {
   constructor(
      private token: string,
      private userId: string,
      private readonly UserRepository: IUserRepository
   ) {
      if (
         !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8|9|aA|bB][0-9a-f]{3}-[0-9a-f]{12}$/.test(
            token
         )
      ) {
         throw new AppError('Token format must be an uuid.');
      }
   }

   async createToken(expire_date: Date): Promise<void> {
      await this.UserRepository.userCreateToken({
         expire_date,
         token: this.token,
         user_id: this.userId,
      });
      return;
   }

   async getTokenAndExpireDate(): Promise<
      {
         token: string;
         expire_date: Date;
      }[]
   > {
      const result = await this.UserRepository.userGetTokens(this.userId);
      return result;
   }

   get getToken() {
      return this.token;
   }
}
