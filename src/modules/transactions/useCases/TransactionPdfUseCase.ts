import { Transaction } from '@prisma/client';
import { AppError } from '@/shared/infra/middleware/AppError';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';
import { container, inject, injectable } from 'tsyringe';
import { FormateDate } from '@/utils/FormattedDate';
import { Pdf } from '../infra/PdfEntity/Pdf';
import { PdfDate } from '../infra/PdfEntity/PdfDate';

import {
   IPdfProviderProvider,
   settingsPros,
} from '@/shared/providers/PdfProvider/IPdfProviderProvider';

interface IRequest {
   user_id: string;
   body: {
      title: string;
      subject: string;
      start_date?: string;
      end_date?: string;
   };
   options?: {
      ByRevenue?: boolean;
      ByExpense?: boolean;
      BySubscription?: boolean;
   };
}

@injectable()
export class TransactionPdfUseCase {
   private FormateDate: FormateDate | null = null;
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

         const value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
         })
            .format(Number(transaction.value))
            .toString();

         return {
            value,
            filingDate,
            dueDate,
            createAt,
            type: transaction.type!,
         };
      });
      return {
         author: params.name,
         title: params.tittle,
         subject: params.subject,
         transactions: [...transactionFormatted],
      };
   }

   async execute({ body, user_id, options }: IRequest): Promise<Buffer> {
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

      let end_date: Date | undefined;
      if (body.end_date) {
         const response = container.resolve(PdfDate);
         response.setDate = body.end_date;
         response.verify();
         this.FormateDate = new FormateDate(response.getDate!);
         end_date = this.FormateDate.formate('yyyy-MM-dd');
      }

      let start_date: Date | undefined;
      if (body.start_date) {
         const response = container.resolve(PdfDate);
         response.setDate = body.start_date;
         response.verify();
         this.FormateDate = new FormateDate(response.getDate!);
         start_date = this.FormateDate.formate('yyyy-MM-dd');
      }

      const data = await this.TransactionRepository.GetPDFInfosFromTransaction({
         user_id,
         options,
         end_date,
         start_date,
      });

      const pdf = new Pdf(
         this.HtmlPdfProvider,
         this.NormalizationData(
            {
               name: user.name,
               tittle: body.title,
               subject: body.subject,
            },
            data
         )
      );

      await pdf.create({
         templatePath: 'public/view/pdfTemplate.hbs',
      });

      return pdf.getPdf;
   }
}
