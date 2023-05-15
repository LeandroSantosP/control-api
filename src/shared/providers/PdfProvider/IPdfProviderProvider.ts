export interface settingsPros {
   author: string;
   title: string;
   subject: string;
   transactions: Array<{
      value: string;
      type: string;
      filingDate: string | null;
      dueDate: string | null;
      createAt: string;
   }>;
}

export interface SendPdfProps {
   variables: settingsPros;
   templatePath: string;
}

export abstract class IPdfProviderProvider {
   abstract SendPdf(params: SendPdfProps): Promise<string | Buffer>;
}
