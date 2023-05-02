import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { inject, injectable } from 'tsyringe';

import auth from '@/settings/auth';
import { AppError } from '@/shared/infra/middleware/AppError';
import { DecodedMethods } from '@/utils/DecodedMethods';

export interface IResponse {
   user: {
      name: string;
      email: string;
   };
   token: string;
   PushNotificationToken: string;
}

interface IRequest {
   authenticationBase64: string | undefined;
}

@injectable()
export class SessionUseCase extends DecodedMethods {
   constructor(
      @inject('UserRepository')
      private UserRepository: IUserRepository,
      @inject('JwtAuthProvider')
      private JwtAuthProvider: IAuthProvider
   ) {
      super();
   }

   async execute({ authenticationBase64 }: IRequest): Promise<IResponse> {
      if (!authenticationBase64) {
         throw new AppError('Authentication Failed', 404);
      }

      const [type, base64Credential] = authenticationBase64?.split(' ');

      if (type !== 'Basic') {
         throw new AppError('Authentication Failed', 404);
      }

      const { email, password } = super.DecodedBase64Basis(base64Credential);

      const user = await this.UserRepository.GetUserByEmail(email);

      if (!user) {
         throw new AppError('Email or password Is Incorrect!', 401);
      }

      let password_user_db: string = '';

      Object.keys(user).forEach((key) => {
         if (key !== 'password') {
            return;
         }
         password_user_db = user[key];
      });

      const passwordMatch = await this.JwtAuthProvider.CompareBcrypt(
         password,
         password_user_db
      );

      if (!passwordMatch) {
         throw new AppError('Email or password Is Incorrect!');
      }

      const { secretToken, secretTokenPushNotification } = auth;

      const token = this.JwtAuthProvider.CreateToken({
         payload: { email: user.email },
         secretToken,
         complement: {
            expiresIn: '1h',
            subject: user.id!,
         },
      });

      const PushNotificationToken = this.JwtAuthProvider.CreateToken({
         payload: {},
         secretToken: secretTokenPushNotification,
         complement: {
            expiresIn: '1h',
            subject: user.id!,
         },
      });

      return {
         user: {
            name: user.name,
            email: user.email,
         },
         token: token,
         PushNotificationToken,
      };
   }
}
