import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { ISederEmailProvider } from '@/shared/providers/SederEmailProvider/ISederEmailProvider';
import { randomUUID } from 'crypto';
import { resolve } from 'path';
import { Token } from '../../infra/Entity/Token';
import { IUserRepository } from '../../infra/repository/IUserRepository';

type IResponse = any;

type IRequest = {
   user_id: string;
};

export class InviteEmailResetPass {
   constructor(
      private readonly UseRepository: IUserRepository,
      private readonly DayFnsProvider: IDateProvider,
      private readonly EtherealProvider: ISederEmailProvider
   ) {}

   async execute({ user_id }: IRequest): Promise<IResponse> {
      const generateToken = randomUUID();
      const expire_date = this.DayFnsProvider.addDays(3);
      const token = new Token(generateToken, user_id, this.UseRepository);
      await token.createToken(expire_date);

      const templatePath = resolve(
         __dirname,
         '..',
         '..',
         'views',
         'emails',
         'ForgetPasswordTemplate.hbs'
      );

      const tokes = await token.getTokenAndExpireDate();

      const variables = {
         name: client.name,
         link: `${process.env.FORGET_EMAIL_URL}${token}`,
      };

      this.EtherealProvider.sendEmail({
         subject: 'Recuperação de senha',
         html: templatePath,
         variables,
         templatePath,
      });

      console.log(tokes);
   }
}
