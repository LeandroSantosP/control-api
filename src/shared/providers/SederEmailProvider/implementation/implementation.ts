import nodemailer, { Transporter } from 'nodemailer';
import { ISederEmailProvider, ISendEmail } from '../ISederEmailProvider';

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
   async sendEmail({ html, subject, templatePath, variables }: ISendEmail) {
      this.transporter.sendMail(
         {
            subject,
            html,
         },
         (err, message) => {
            if (err) {
               console.log('Error occurred. ' + err.message);
               return process.exit(1);
            }

            console.log('Message sent: %s', message.messageId);
            console.log(
               'Preview URL: %s',
               nodemailer.getTestMessageUrl(message)
            );
         }
      );
   }
}
