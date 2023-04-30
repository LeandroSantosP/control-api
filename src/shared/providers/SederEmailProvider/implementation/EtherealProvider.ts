import { ISederEmailProvider, ISendEmail } from '../ISederEmailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';

export class EtherealProvider implements ISederEmailProvider {
   private transporter!: Transporter;
   constructor() {
      nodemailer.createTestAccount((err, account) => {
         if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
         }

         let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
               user: account.user,
               pass: account.pass,
            },
         });

         this.transporter = transporter;
      });
   }
   async sendEmail({
      subject,
      templatePath,
      variables,
      to,
   }: ISendEmail): Promise<void> {
      const templateFileContent = fs
         .readFileSync(templatePath)
         .toString('utf-8');

      const templateParse = Handlebars.compile(templateFileContent);

      const templateHTML = templateParse(variables);

      return await new Promise<void>((resolve, reject) => {
         this.transporter.sendMail(
            {
               from: 'Control <test@test.com.br>',
               to,
               subject,
               html: templateHTML,
            },
            (err, message) => {
               if (err) {
                  reject(err);
                  console.log('Error occurred. ' + err.message);
                  return process.exit(1);
               }

               console.log('Message sent: %s', message.messageId);
               console.log(
                  'Preview URL: %s',
                  nodemailer.getTestMessageUrl(message)
               );
               resolve(undefined);
            }
         );
      });
   }
}
