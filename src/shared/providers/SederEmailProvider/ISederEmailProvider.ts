export interface ISendEmail {
   to: string;
   subject: string;
   variables: any;
   templatePath: string;
}

export abstract class ISederEmailProvider {
   abstract sendEmail(params: ISendEmail): Promise<void>;
}
