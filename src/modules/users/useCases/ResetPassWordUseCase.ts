import auth from '@/settings/auth';
import { AppError } from '@/shared/infra/middleware/AppError';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { TokenManege } from '../infra/Entity/Token';
import { IUserRepository } from '../infra/repository/IUserRepository';

interface IRequest {
   token: string;
   newPassword: string;
}

@injectable()
export class ResetPasswordUseCase {
   constructor(
      @inject('UserRepository')
      private readonly useRepository: IUserRepository
   ) {}

   async execute({ token, newPassword }: IRequest): Promise<void | Error> {
      if (!newPassword) {
         throw new AppError('Invalid password!');
      }
      const TokenInst = new TokenManege();

      const userToken = await this.useRepository.GetToken(token);

      const tokenCredentialValidate = await TokenInst.ValidateToken({
         token,
         userToken,
      });

      const user = await this.useRepository.GetUserById(
         tokenCredentialValidate?.userId
      );

      if (!user) {
         throw new AppError('User does not exits!');
      }

      const deleteTokenResponse = await this.useRepository.DeleteTokenById(
         tokenCredentialValidate.id
      );

      if (deleteTokenResponse !== 'Token Deleted') {
         throw new AppError('Error deleting token!');
      }
      const { saltRounds } = auth;
      const passwordHash = await hash(newPassword, saltRounds);

      await this.useRepository.UploadPassword(user.id, passwordHash);
      return Promise.resolve(undefined);
   }
}
