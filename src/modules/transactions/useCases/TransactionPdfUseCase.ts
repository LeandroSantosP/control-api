import { Transaction } from '@prisma/client';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';
import { Pdf } from '../infra/Entity/Pdf';
import {
   IPdfProviderProvider,
   settingsPros,
} from '@/shared/providers/PdfProvider/IPdfProviderProvider';
import { inject, injectable } from 'tsyringe';

interface IRequest {
   user_id: string;
   start_date?: Date;
   end_date?: Date;
   body: {
      title: string;
      subject: string;
   };
   options?: {
      ByRevenue?: boolean;
      ByExpense?: boolean;
      BySubscription?: boolean;
   };
}

@injectable()
export class TransactionPdfUseCase {
   constructor(
      @inject('UserRepository')
      private readonly UserRepository: IUserRepository,
      @inject('TransactionsRepository')
      private readonly TransactionRepository: ITransactionsRepository,
      @inject('HtmlPdfProvider')
      private readonly HtmlPdfProvider: IPdfProviderProvider,
      @inject('DateFnsProvider')
      private readonly DateFnsProvider: IDateProvider
   ) {}

   private NormalizationData(
      params: {
         name: string;
         tittle: string;
         subject: string;
      },
      data: Transaction[]
   ): settingsPros {
      const transactionFormatted = data.map((transaction) => {
         const filingDate: string | null = transaction.filingDate
            ? this.DateFnsProvider.format({
                 date: transaction.filingDate,
                 format: 'dd/MM/yyyy',
              })
            : null;

         const dueDate: string | null = transaction.due_date
            ? this.DateFnsProvider.format({
                 date: transaction.due_date,
                 format: 'dd/MM/yyyy',
              })
            : null;

         const createAt = this.DateFnsProvider.format({
            date: transaction.created_at,
            format: 'dd/MM/yyyy',
         });

         return {
            value: transaction.value.toString(),
            type: transaction.type!,
            filingDate,
            dueDate,
            createAt,
         };
      });
      return {
         author: params.name,
         title: params.tittle,
         subject: params.subject,
         transactions: [...transactionFormatted],
      };
   }

   async execute({
      body,
      user_id,
      end_date,
      options,
      start_date,
   }: IRequest): Promise<any> {
      const user = await this.UserRepository.GetUserById(user_id);

      if (!user) {
         throw new AppError('User not found!');
      }
      /* ctrl + X */ /* recortar uma linha e guardar ela no ctrl + v */
      /* ctrl + 1 */ /* abrir o terminal integrado do vsCode */
      if (
         options &&
         !options.ByExpense &&
         !options.BySubscription &&
         !options.ByRevenue
      ) {
         throw new AppError('Invalid Options!');
      }
      const response =
         await this.TransactionRepository.GetPDFInfosFromTransaction({
            user_id: user_id,
            end_date: end_date,
            start_date: start_date,
            options: options,
         });

      const pdf = new Pdf(
         this.HtmlPdfProvider,
         this.NormalizationData(
            {
               name: user.name,
               tittle: body.title,
               subject: body.subject,
            },
            response
         )
      );

      await pdf.create({
         templatePath: 'public/view/pdfTemplate.hbs',
      });
      await new Promise((resolve, reject) => {
         pdf.getPdf.on('data', (res) => {
            resolve(res);
         });
      }).then((res: any) => {
         console.log(typeof res === 'object');

         return;
      });

      return pdf.getPdf;
   }
}
