import { AppError } from '@/shared/infra/middleware/AppError';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { DateFnsProvider } from '@/shared/providers/DateProvider/implementation/DateFnsProvider';
import { GetUserByTokenOutput } from '../repository/IUserRepository';

class Token {
   constructor(private token: string) {
      if (
         !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[8|9|aA|bB][0-9a-f]{3}-[0-9a-f]{12}$/.test(
            token
         )
      ) {
         throw new AppError('Token format must be an uuid.');
      }
   }
   get getToken() {
      return this.token;
   }
}

interface ValidateTokenInput {
   token: string;
   userToken: GetUserByTokenOutput;
}

export class TokenManege {
   private DayFns: IDateProvider;
   constructor() {
      this.DayFns = new DateFnsProvider();
   }

   private static verifyExpiration(expire_date: Date, currentDate: Date) {
      if (expire_date < currentDate) {
         return true;
      }
      return false;
   }

   async ValidateTokenInviteEmail(token: string) {
      return new Token(token).getToken;
   }

   async ValidateToken({ userToken, token }: ValidateTokenInput) {
      const credentials = userToken.find((tokens) => tokens.token === token);

      if (!credentials) {
         throw new AppError('Invalid Token!');
      }

      const TokenAlreadyExpire = TokenManege.verifyExpiration(
         credentials?.expire_date,
         this.DayFns.now
      );

      if (TokenAlreadyExpire) {
         throw new AppError('Token expired!');
      }

      return credentials;
   }
}
