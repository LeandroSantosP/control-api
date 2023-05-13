interface settingsPros {
   name: string;
   title: string;
   subject: string;
   transactions: any[];
}

export interface SendPdfProps {
   variables: settingsPros;
   templatePath: string;
}

export abstract class IPdfProviderProvider {
   abstract SendPdf(params: SendPdfProps): Promise<any>;
}
