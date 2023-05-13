import { IPdfProviderProvider, SendPdfProps } from '../IPdfProviderProvider';
import Handlebars from 'handlebars';
import pdf from 'html-pdf';
import fs from 'fs';

export class HtmlPdfProvider implements IPdfProviderProvider {
   async SendPdf({ templatePath, variables }: SendPdfProps): Promise<any> {
      const template = fs.readFileSync(templatePath).toString();
      const templateParse = Handlebars.compile(template);
      const html = templateParse({
         name: variables.name,
         title: variables.title,
         transactions: variables.transactions,
         subject: variables.subject,
      });

      return new Promise((resolve, reject) => {
         pdf.create(html.toString(), {
            type: 'pdf',
            format: 'A4',
            orientation: 'portrait',
            childProcessOptions: {
               env: {
                  OPENSSL_CONF: '/dev/null',
               },
            },
         } as any).toFile('./pdf.pdf', (err, res) => {
            if (err) reject(err);
            return resolve(res);
         });
      });
   }
}
