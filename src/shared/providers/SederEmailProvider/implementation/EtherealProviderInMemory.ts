import { ISederEmailProvider, ISendEmail } from '../ISederEmailProvider';

export class EmailProviderInMemory implements ISederEmailProvider {
   message: any[] = [];

   async sendEmail(params: ISendEmail): Promise<void> {
      this.message.push({ ...params });
   }
}
