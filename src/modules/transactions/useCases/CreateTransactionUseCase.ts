import * as yup from 'yup';
import { formatISO, parse } from 'date-fns';

import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { Transaction as TransactionCustom } from '../infra/Entity/Transaction';
import { AppError } from '@/shared/infra/middleware/AppError';
import { CategoryProps } from '../infra/Entity/Category';
import { ValidationYup } from '@/utils/ValidationYup';
import { inject, injectable } from 'tsyringe';
import { IDateProvider } from '@/shared/providers/DateProvider/IDateProvider';

export const decimalValidate = () => {
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
   description: yup.string().required(),
   value: decimalValidate().required(),
   email: yup.string().email().required(),

   dueDate: yup
      .string()
      .nullable()
      .matches(
         /^\d{4}-\d{2}-\d{2}$/,
         'Data inválida. O formato deve ser yyyy-MM-dd'
      ),
   filingDate: yup
      .string()
      .nullable()
      .matches(
         /^\d{4}-\d{2}-\d{2}$/,
         'Data inválida. O formato deve ser yyyy-MM-dd'
      ),
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

type CategoryTypes =
   | 'transport'
   | 'food'
   | 'habitation'
   | 'education'
   | 'health'
   | 'leisure'
   | 'products'
   | 'debts'
   | 'Taxes'
   | 'Investments'
   | 'unknown';

interface IRequest {
   description: string;
   value: string;
   email: string;
   categoryType?: CategoryTypes;
   dueDate?: string;
   filingDate?: string;
}

@injectable()
export class CreateTransaction {
   constructor(
      @inject('UserRepository')
      private readonly userRepository: IUserRepository,
      @inject('TransactionsRepository')
      private readonly transactionRepository: ITransactionsRepository,
      @inject('DateFnsProvider')
      private readonly dateFnsProvider: IDateProvider
   ) {}

   private formattedData(date: string): string {
      console.log(date);

      const res = this.dateFnsProvider.formatISO(
         this.dateFnsProvider.parse({
            dateString: date,
            DatePatters: 'yyyy-MM-dd',
            CurrentDate: new Date(),
         })
      );
      console.log(res);

      return res;
   }

   async execute({
      description,
      value,
      email,
      categoryType = 'unknown',
      dueDate,
      filingDate,
   }: IRequest) {
      if (!description || !value || !email) {
         throw new AppError('Invalid Data', 400);
      }

      try {
         const dados = {
            description,
            email,
            value,
            dueDate,
            categoryType,
            filingDate,
         };

         const validadeData = await TransactionSchema.validate(dados, {
            abortEarly: false,
         });

         const user = await this.userRepository.GetUserByEmail(
            validadeData.email
         );

         if (!user) {
            throw new AppError('User does not exites!');
         }

         const isRevenue = Number(value) > 0;

         if (isRevenue && validadeData.dueDate) {
            throw new AppError('Revenue does not have due date!');
         } else if (!isRevenue && validadeData.filingDate) {
            throw new AppError('Expense does not have filling date!');
         }

         if (Number(validadeData.value) < 0 && !validadeData.dueDate) {
            throw new AppError('Expense should have due date!');
         } else if (
            Number(validadeData.value) > 0 &&
            !validadeData.filingDate
         ) {
            throw new AppError('Revenue should have filling date!');
         }

         let FormateDate = null;

         if (validadeData.dueDate) {
            FormateDate = this.formattedData(validadeData.dueDate);
         } else if (validadeData.filingDate) {
            FormateDate = this.formattedData(validadeData.filingDate);
         }

         const FormattedValue = String(Number(validadeData.value).toFixed(2));

         const transactionModel = TransactionCustom.create({
            description: validadeData.description,
            type: 'expense',
            isSubscription: false,
            value: FormattedValue,
            category: validadeData.categoryType as CategoryProps,
            due_date: Number(validadeData.value) < 0 ? FormateDate! : undefined,
            filingDate:
               Number(validadeData.value) > 0 ? FormateDate! : undefined,
         });

         const newTransaction = await this.transactionRepository.create({
            email,
            description: transactionModel.description,
            value: transactionModel.value.getValue,
            dueDate: transactionModel.due_date?.getValue,
            Category: transactionModel.category?.GetCategory,
            filingDate: transactionModel.filingDate?.getValue,
         });

         return {
            ...newTransaction,
            userId: user.id,
         };
      } catch (err: any) {
         new ValidationYup(err);
      }
   }
}
