import * as yup from 'yup';
import { formatISO, parse } from 'date-fns';

import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { TransactionsDTO } from '../../infra/dto/TransactionsDTO';
import { TransactionsEntity } from '../../infra/Entity/TransactionsEntity';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

interface IRequest extends TransactionsDTO {
   email: string;
   dueDate?: string;
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

const TransactionSchema = yup.object().shape({
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
});

@injectable()
export class CreateTransaction {
   constructor(
      @inject('UserRepository')
      private userRepository: IUserRepository,
      @inject('TransactionsRepository')
      private transactionRepository: ITransactionsRepository
   ) {}

   async execute({ description, value, email, dueDate }: IRequest) {
      if (!description || !value || !email) {
         throw new AppError('Invalid Data', 400);
      }

      try {
         const dados = { description, email, value, dueDate };

         const validadeData = await TransactionSchema.validate(dados, {
            abortEarly: false,
         });

         const user = await this.userRepository.GetUserByEmail(
            validadeData.email
         );

         if (!user) {
            throw new AppError('User does not exites!');
         }

         const transactionModel = new TransactionsEntity();

         let DataFormate = null;

         if (validadeData.dueDate) {
            DataFormate = formatISO(
               parse(validadeData.dueDate as string, 'yyyy-MM-dd', new Date())
            );
         }

         Object.assign(transactionModel, {
            description: validadeData.description,
            value: validadeData.value,
            due_date: DataFormate,
         });

         const newTransaction = await this.transactionRepository.create({
            email,
            description: transactionModel.description,
            value: transactionModel.value,
            dueDate: transactionModel.due_date,
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
