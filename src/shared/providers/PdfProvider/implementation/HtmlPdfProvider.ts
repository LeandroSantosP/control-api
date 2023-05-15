import { IPdfProviderProvider, SendPdfProps } from '../IPdfProviderProvider';
import Handlebars from 'handlebars';
import fs from 'fs';
import pdf from 'html-pdf';

export class HtmlPdfProvider implements IPdfProviderProvider {
   async SendPdf({
      templatePath,
      variables,
   }: SendPdfProps): Promise<string | Buffer> {
      const template = fs.readFileSync(templatePath).toString();

      const templateParse = Handlebars.compile(template);
      const html = templateParse({
         author: variables.author,
         title: variables.title,
         transactions: variables.transactions,
         subject: variables.subject,
      });

      return new Promise((resolve, reject) => {
         pdf.create(html, {
            type: 'pdf',
            format: 'A4',
            header: {
               contents: variables.title,
               height: '2rem',
            },
            orientation: 'portrait',
            quality: '100%',
            childProcessOptions: {
               env: {
                  OPENSSL_CONF: '/dev/null',
               },
            },
         } as any).toStream((err, res) => {
            if (err) {
               reject(err);
            }
            res.on('data', (buffer) => resolve(buffer)).on('error', (err) =>
               reject(err)
            );
         });
      });
   }
}
