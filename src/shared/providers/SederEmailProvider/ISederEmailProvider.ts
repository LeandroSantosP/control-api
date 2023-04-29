export interface ISendEmail {
   subject: string;
   html: string;
   variables: any;
   templatePath: string;
}

export abstract class ISederEmailProvider {
   abstract sendEmail(params: ISendEmail): Promise<void>;
}
