import * as yup from 'yup';
import { Category } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';
import { Transaction } from '../../infra/Entity/Transaction';
import { CategoryProps } from '../../infra/Entity/Category';

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

type SchemaType = yup.InferType<typeof TransactionSchemaWithRecorrente>;

@injectable()
export class CreateTransactionWIthRecorrenteUseCase {
   constructor(
      @inject('TransactionsRepository')
      private transactionRepository: ITransactionsRepository,
      @inject('DateFnsProvider')
      private DateFnsProvider: IDateProvider
   ) {}

   private async transactionManager(validatedData: SchemaType) {
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

      const { id: _, ...transaction } = Transaction.create({
         description: validatedData.description,
         value: FinalResult,
         type: 'expense',
         isSubscription: validatedData.isSubscription,
         category: (validatedData.categoryType as CategoryProps) || undefined,
         recurrence: validatedData.recurrence,
         installments: validatedData.installments,
         due_date: validatedData.due_date,
      });

      let DataFormate = null;

      DataFormate = this.DateFnsProvider.formatISO(
         this.DateFnsProvider.parse({
            dateString: transaction.due_date?.getValue,
            DatePatters: 'yyyy-MM-dd',
            CurrentDate: new Date(),
         })
      );

      const newTransaction =
         await this.transactionRepository.CreateTransactionInstallments({
            dueDate: DataFormate,
            email: validatedData.email,
            description: transaction.description,
            isSubscription: transaction.isSubscription,
            categoryType: transaction.category?.GetCategory,
            installments: transaction.installments.getValue,
            recurrence: transaction.recurrence?.GetValue,
            value: transaction.value.getValue,
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
