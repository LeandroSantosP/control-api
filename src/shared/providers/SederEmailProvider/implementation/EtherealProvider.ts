import { ISederEmailProvider, ISendEmail } from '../ISederEmailProvider';
import nodemailer, { Transporter } from 'nodemailer';
import Handlebars from 'handlebars';
import fs from 'fs';

export class EtherealProvider implements ISederEmailProvider {
   private Transporter: Transporter | null = null;

   constructor() {
      this.config();
   }

   private config() {
      nodemailer.createTestAccount((err, account) => {
         if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return process.exit(1);
         }
         const port = Number(process.env.NODEMAILER_PORT) || 587;
         const host = process.env.NODEMAILER_HOST || 'smtp.gmail.com';

         let transporter = nodemailer.createTransport({
            host,
            port,
            secure: false,
            auth: {
               user: process.env.NODEMAILER_USER,
               pass: process.env.NODEMAILER_PASS,
            },
         });

         this.Transporter = transporter;
      });

      return;
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

      return await new Promise<void>(async (resolve, reject) => {
         return this.Transporter?.sendMail(
            {
               from: 'Control <spsconttrol@gmail.com>',
               to: 'LeandroBuy5@gmail.com',
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

               resolve();
            }
         );
      });
   }
}
