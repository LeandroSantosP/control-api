import { ISederEmailProvider } from '@/shared/providers/SederEmailProvider/ISederEmailProvider';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { IUserRepository } from '../infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { TokenManege } from '../infra/Entity/Token';
import { randomUUID } from 'crypto';
import { resolve } from 'path';

type IResponse = void;

@injectable()
export class InviteEmailResetPassUseCase {
   constructor(
      @inject('UserRepository')
      private readonly UseRepository: IUserRepository,
      @inject('DateFnsProvider')
      private readonly DayFnsProvider: IDateProvider,
      @inject('EtherealProvider')
      private readonly EtherealProvider: ISederEmailProvider
   ) {}

   async execute(email: string): Promise<IResponse> {
      const user = await this.UseRepository.GetUserByEmail(email);

      if (!user) {
         throw new AppError('User does not exists');
      }

      const generateToken = randomUUID();
      const expire_date = this.DayFnsProvider.addDays(3);
      const token = new TokenManege();
      const validToken = await token.ValidateTokenInviteEmail(generateToken);

      await this.UseRepository.userCreateToken({
         expire_date,
         token: validToken,
         user_id: user.id,
      });

      const templatePath = resolve(
         __dirname,
         '..',
         'infra',
         'views',
         'emails',
         'ForgetPasswordTemplate.hbs'
      );

      const variables = {
         name: user.name,
         link: `${process.env.FORGET_EMAIL_URL}/${validToken}`,
      };

      await this.EtherealProvider.sendEmail({
         to: email,
         subject: 'Recuperação de senha',
         variables,
         templatePath,
      });

      return;
   }
}
