import * as yup from 'yup';
import { formatISO, parse } from 'date-fns';

import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { TransactionsDTO } from '../../infra/dto/TransactionsDTO';
import { TransactionsEntity } from '../../infra/Entity/TransactionsEntity';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';
import { Transaction } from '@prisma/client';

interface IRequest extends TransactionsDTO {
   email: string;
   dueDate?: string;
   categoryType?: string;
   filingDate?: string;
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
      private transactionRepository: ITransactionsRepository<Transaction>
   ) {}

   private formattedData(date: string) {
      return formatISO(parse(date, 'yyyy-MM-dd', new Date()));
   }

   async execute({
      description,
      value,
      email,
      categoryType,
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

         const user = await this.userRepository.GetUserByEmail(
            validadeData.email
         );

         if (!user) {
            throw new AppError('User does not exites!');
         }

         const transactionModel = new TransactionsEntity();

         let FormateDueDate = null;
         let FormateFellingDate = null;

         if (validadeData.dueDate) {
            FormateDueDate = formatISO(
               parse(validadeData.dueDate, 'yyyy-MM-dd', new Date())
            );
         } else if (validadeData.filingDate) {
            FormateFellingDate = this.formattedData(validadeData.filingDate);
         }

         const FormattedValue = String(Number(validadeData.value).toFixed(2));

         Object.assign(transactionModel, {
            value: FormattedValue,
            description: validadeData.description,
            Category: validadeData.categoryType,
            due_date: FormateDueDate,
            filingDate: FormateFellingDate,
         });

         const newTransaction = await this.transactionRepository.create({
            email,
            description: transactionModel.description,
            value: transactionModel.value,
            dueDate: transactionModel.due_date,
            Category: transactionModel.Category,
            filingDate: transactionModel.filingDate,
         });

         return {
            ...newTransaction,
            userId: user.id,
         };
      } catch (err: any) {
         if (err instanceof yup.ValidationError) {
            const errorMessages: string[] = [];

            err.inner.forEach(({ path, message }: any) => {
               if (path) {
                  errorMessages.push(`${message} \n`);
               }
            });
            throw new InvalidYupError(errorMessages.join(''));
         }

         throw new AppError(err.message, 400);
      }
   }
}
