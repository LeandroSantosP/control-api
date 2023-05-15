import { AppError } from '@/shared/infra/middleware/AppError';
import { HtmlPdfProvider } from '@/shared/providers/PdfProvider/implementation/HtmlPdfProvider';
import { IPdfProviderProvider } from '@/shared/providers/PdfProvider/IPdfProviderProvider';
import { resolve } from 'path';
import { Pdf } from './Pdf';

let HtmlPdfProviderTEST: IPdfProviderProvider;

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

describe('pdf', () => {
   beforeEach(() => {
      HtmlPdfProviderTEST = new HtmlPdfProvider();
   });
   test('should be able to create and get a pdf stream', async () => {
      const templatePath = resolve('public/view/pdfTemplate.hbs');

      const sut = new Pdf(HtmlPdfProviderTEST, {
         author: 'LEANDRO',
         subject: 'test',
         title: 'My pdf',
         transactions: [...transactionsMock],
      });

      const res = await sut.create({
         templatePath,
      });

      // @ts-ignore
      expect(res.getPdf).toBeTruthy();
   });

   test('should throw an error if pdfStream is undefined.', async () => {
      expect(
         () =>
            new Pdf(HtmlPdfProviderTEST, {
               author: 'LEANDRO',
               subject: 'test',
               title: 'My pdf',
               transactions: [...transactionsMock],
            }).getPdf
      ).toThrow(new AppError('No pdf created'));
   });

   /* Validation types */
   function createTemplateForValid(field: string) {
      new Pdf(HtmlPdfProviderTEST, {
         author: field === 'author' ? '' : 'My author',
         subject: field === 'subject' ? '' : 'My subject',
         title: field === 'title' ? '' : 'My pdf',
         transactions: field === 'transactions' ? [] : [...transactionsMock],
      });
   }

   test('should throw an error if transactions is empty.', async () => {
      expect(() => createTemplateForValid('transactions')).toThrow(
         new AppError('No transactions provided')
      );
   });

   test('should throw an error if author is empty.', async () => {
      expect(() => createTemplateForValid('author')).toThrow(
         new AppError('Author is required')
      );
   });

   test('should throw an error if title is empty.', async () => {
      expect(() => createTemplateForValid('title')).toThrow(
         new AppError('Title is required')
      );
   });

   test('should throw an error if subject is empty.', async () => {
      expect(() => createTemplateForValid('subject')).toThrow(
         new AppError('Subject is required')
      );
   });
});
