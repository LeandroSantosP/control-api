import * as yup from 'yup';
import { formatISO, parse } from 'date-fns';

import { ITransactionsRepository } from '../infra/repository/ITransactionsRepository';
import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { Transaction as TransactionCustom } from '../infra/Entity/Transaction';
import { AppError } from '@/shared/infra/middleware/AppError';
import { CategoryProps } from '../infra/Entity/Category';
import { ValidationYup } from '@/utils/ValidationYup';
import { inject, injectable } from 'tsyringe';

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

@injectable()
export class CreateTransaction {
   constructor(
      @inject('UserRepository')
      private userRepository: IUserRepository,
      @inject('TransactionsRepository')
      private transactionRepository: ITransactionsRepository
   ) {}

   private static formattedData(date: string) {
      return formatISO(parse(date, 'yyyy-MM-dd', new Date()));
   }

   async execute({
      description,
      value,
      email,
      categoryType,
      dueDate,
      filingDate,
   }: any) {
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

         let FormateDueDate = null;
         let FormateFellingDate = null;

         if (validadeData.dueDate) {
            FormateFellingDate = CreateTransaction.formattedData(
               validadeData.dueDate
            );
         } else if (validadeData.filingDate) {
            FormateFellingDate = CreateTransaction.formattedData(
               validadeData.filingDate
            );
         }

         const FormattedValue = String(Number(validadeData.value).toFixed(2));

         const transactionModel = TransactionCustom.create({
            description: validadeData.description,
            type: 'expense',
            isSubscription: false,
            value: FormattedValue,
            category: validadeData.categoryType as CategoryProps,
            due_date: FormateDueDate || undefined,
            filingDate: FormateFellingDate || undefined,
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
