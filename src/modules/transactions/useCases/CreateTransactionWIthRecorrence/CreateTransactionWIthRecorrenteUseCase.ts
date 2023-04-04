import { Category, Transaction } from '@prisma/client';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { TransactionsEntity } from '../../infra/Entity/TransactionsEntity';
import * as yup from 'yup';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';

interface IRequest {
   isSubscription: boolean;
   installments?: number;
   due_date: string;
   email: string;
   value: string;
   description: string;
   categoryType: Category | undefined;
   recurrence: 'monthly' | 'daily' | 'yearly';
}

const decimalValidate = () => {
   return yup
      .string()
      .test('decimal', 'Deve ser um numero decimal', (value) => {
         if (!value) {
            return true;
         }
         return /^-?\d*\.?\d*$/.test(value);
      });
};

export const TransactionSchema = yup.object().shape({
   isSubscription: yup.boolean().required(),
   description: yup.string().required(),
   value: decimalValidate().required(),
   email: yup.string().email().required(),
   due_date: yup
      .string()
      .nullable()
      .matches(
         /^\d{4}-\d{2}-\d{2}$/,
         'Data inválida. O formato deve ser yyyy-MM-dd'
      )
      .required(),
   categoryType: yup
      .string()
      .oneOf([
         'transport',
         'food',
         'habitation',
         'education',
         'health',
         'leisure',
         'products',
         'debts',
         'Taxes',
         'Investments',
         'unknown',
      ]),
});

const TransactionSchemaWithRecorrente = TransactionSchema.shape({
   installments: yup.number().max(12).optional(),
   recurrence: yup.string().oneOf(['monthly', 'daily', 'yearly']).required(),
});

@injectable()
export class CreateTransactionWIthRecorrenteUseCase {
   constructor(
      @inject('TransactionsRepository')
      private transactionRepository: ITransactionsRepository<Transaction>,
      @inject('DateFnsProvider')
      private DateFnsProvider: IDateProvider
   ) {}

   private async transactionManager(validatedData: any) {
      if (Number(validatedData.value) >= 0) {
         throw new AppError('This Operation cant not be a revenue!');
      }

      let FinalResult;

      const multiplyInstallmentsWithValue =
         validatedData.installments! * Number(validatedData.value);

      if (validatedData.installments) {
         FinalResult = String(multiplyInstallmentsWithValue.toFixed(2));
      } else {
         const formattedValue = Number(validatedData.value).toFixed(2);
         FinalResult = formattedValue;
      }

      const { id: _, ...transaction } = new TransactionsEntity();
      Object.assign(transaction, {
         ...validatedData,
         value: FinalResult,
         Category: validatedData.categoryType,
      });

      let DataFormate = null;

      DataFormate = this.DateFnsProvider.formatISO(
         this.DateFnsProvider.parse({
            dateString: transaction.due_date,
            DatePatters: 'yyyy-MM-dd',
            CurrentDate: new Date(),
         })
      );

      const newTransaction =
         await this.transactionRepository.CreateTransactionInstallments({
            ...transaction,
            dueDate: DataFormate,
            email: validatedData.email,
            recurrence: transaction.recurrence!,
            categoryType: transaction.Category,
         });

      return newTransaction;
   }

   async execute(data: IRequest) {
      try {
         const validatedData = await TransactionSchemaWithRecorrente.validate(
            data,
            {
               abortEarly: false,
            }
         );

         if (
            !validatedData.isSubscription &&
            validatedData.recurrence &&
            validatedData.installments
         ) {
            const newTransaction = await this.transactionManager(validatedData);
            return newTransaction;
         }

         if (!validatedData.isSubscription && !validatedData.installments) {
            throw new AppError(
               'Installments are required for transactions other than a subscription!'
            );
         }

         if (validatedData.isSubscription && validatedData.installments) {
            throw new AppError('Inscriptions must not contain installments!');
         }

         const newTransaction = await this.transactionManager(validatedData);

         return newTransaction;
      } catch (err: any) {
         if (!err.inner) {
            throw new AppError(err.message);
         }

         let messageError: any = {};
         err.inner.forEach(({ path, message }: any) => {
            if (path) {
               messageError[path] = message;
            }
         });

         let finalMessage: string = '';
         Object.entries(messageError).map(([key, value]) => {
            finalMessage += `Error: ${key}, message: ${value}\n`;
         });

         throw new InvalidYupError(finalMessage);
      }
   }
}
