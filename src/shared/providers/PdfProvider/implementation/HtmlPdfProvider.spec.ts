import fs from 'fs';
import { resolve } from 'path';
import { HtmlPdfProvider } from './HtmlPdfProvider';

let htmlPdfProvider: HtmlPdfProvider;

describe('HtmlPdfProvider', () => {
   beforeEach(async () => {
      htmlPdfProvider = new HtmlPdfProvider();
   });

   it('should be able to create a pdf', async () => {
      const templatePath = resolve(__dirname, 'PdfTemplate-test.hbs');
      const template = fs.readFileSync(templatePath).toString('utf-8');

      const response = await htmlPdfProvider.SendPdf({
         templatePath,
         variables: {
            name: 'leandro',
            subject: 'oi',
            title: 'titulo',
            transactions: [],
         },
      });

      console.log(response);
   });
});
