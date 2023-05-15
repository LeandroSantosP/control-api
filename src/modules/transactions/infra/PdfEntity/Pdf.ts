import { AppError } from '@/shared/infra/middleware/AppError';
import {
   IPdfProviderProvider,
   settingsPros,
} from '@/shared/providers/PdfProvider/IPdfProviderProvider';

export class Pdf {
   private _pdfStream: Buffer | undefined;

   constructor(
      private readonly HtmlPdfProvider: IPdfProviderProvider,
      private readonly settings: settingsPros
   ) {
      if (this.settings.transactions.length === 0) {
         throw new AppError('No transactions provided');
      } else if (this.settings.author === '') {
         throw new AppError('Author is required');
      } else if (this.settings.title === '') {
         throw new AppError('Title is required');
      } else if (this.settings.subject === '') {
         throw new AppError('Subject is required');
      }
   }

   async create({
      templatePath,
   }: {
      templatePath: string;
   }): Promise<this | AppError> {
      const pdf = await this.HtmlPdfProvider.SendPdf({
         templatePath,
         variables: { ...this.settings },
      });

      if (pdf instanceof Buffer) {
         this._pdfStream = pdf;
      } else {
         throw new AppError('Error creating pdf');
      }

      return this;
   }

   get getPdf() {
      if (this._pdfStream === undefined) {
         throw new AppError('No pdf created');
      }

      return this._pdfStream as Buffer;
   }
}
