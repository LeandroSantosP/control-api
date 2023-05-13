import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';

interface IRequest {
   user_id: string;
   start_date?: Date;
   end_Date?: Date;
   options?: any;
}

export class TransactionPdfUseCase {
   constructor(
      private readonly TransactionRepository: ITransactionsRepository
   ) {}

   async execute(params: IRequest) {
      const response =
         await this.TransactionRepository.GetPDFInfosFromTransaction({
            ...params,
         });

      return response;
   }
}
