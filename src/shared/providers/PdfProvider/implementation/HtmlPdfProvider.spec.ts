import fs from 'fs';
import { resolve } from 'path';
import { HtmlPdfProvider } from './HtmlPdfProvider';

let htmlPdfProvider: HtmlPdfProvider;

const transactionsMock = [
   {
      value: '100',
      dueDate: null,
      type: 'revenue',
      filingDate: '21-06-2021',
      createAt: '21-04-2021',
   },
   {
      value: '-200',
      dueDate: '21-06-2021',
      type: 'expense',
      filingDate: null,
      createAt: '21-04-2021',
   },
];

describe('HtmlPdfProvider', () => {
   beforeEach(async () => {
      htmlPdfProvider = new HtmlPdfProvider();
   });

   it('should be able to create a steam  pdf(pdf)', async () => {
      const templatePath = resolve('public/view/pdfTemplate.hbs');

      const response = await htmlPdfProvider.SendPdf({
         templatePath,
         variables: {
            title: 'Meu pdf',
            author: 'joão',
            subject:
               'TESTANDO TESTANDO TESTANDO TESTANDO TESTANDO TESTANDO TESTANDO TESTANDO TESTANDO ',
            transactions: transactionsMock,
         },
      });

      expect(response).toBeInstanceOf(fs.ReadStream);
   });
});
