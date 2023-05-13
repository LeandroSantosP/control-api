import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { Pdf } from '../infra/Entity/Pdf';
import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';

interface IRequest {
   user_id: string;
   start_date?: Date;
   end_date?: Date;
   options?: {
      ByRevenue?: boolean;
      ByExpense?: boolean;
      BySubscription?: boolean;
   };
}

export class TransactionPdfUseCase {
   constructor(
      private readonly UserRepository: IUserRepository,
      private readonly TransactionRepository: ITransactionsRepository
   ) {}

   async execute({ user_id, end_date, options, start_date }: IRequest) {
      const user = await this.UserRepository.GetUserById(user_id);
      if (
         options &&
         !options.ByExpense &&
         !options.BySubscription &&
         !options.ByRevenue
      ) {
         throw new AppError('Invalid Options!');
      }

      if (options) {
      }

      const pdf = new Pdf({
         name: user!.name,
         subject: 'data de entre!<><><><>',
         title: 'UM titulo',
         transactions: [],
      });
      // pdf.create({})

      // console.log(pdf.getPdf);

      const response =
         await this.TransactionRepository.GetPDFInfosFromTransaction({
            user_id: user_id,
            end_date: end_date,
            start_date: start_date,
            options: options,
         });

      return response;
   }
}
