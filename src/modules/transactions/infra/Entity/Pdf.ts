import { resolve } from 'path';

interface settingsPros {
   name: string;
   title: string;
   subject: string;
   transactions: any[];
}

interface SendPdfProps {
   variables: settingsPros;
   templatePath: string;
}

export class Pdf {
   private _pdf: any;

   constructor(private readonly settings: settingsPros) {}

   async create({
      SendPdf,
   }: {
      SendPdf(params: SendPdfProps): Promise<any>;
   }): Promise<void> {
      const templatePath = resolve(
         __dirname,
         '..',
         'views',
         'emails',
         'PdfTemplate.hbs'
      );

      const pdf = await SendPdf({
         templatePath,
         variables: { ...this.settings },
      });

      this._pdf = pdf;
   }

   get getPdf() {
      return this._pdf;
   }
}
