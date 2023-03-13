import * as yup from 'yup';

import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { TransactionsDTO } from '../../infra/dto/TransactionsDTO';
import { TransactionsEntity } from '../../infra/Entity/TransactionsEntity';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

interface IRequest extends TransactionsDTO {
  email: string;
}

const TransactionSchema = yup.object().shape({
  description: yup.string().required(),
  value: yup.number().required(),
  email: yup.string().email().required(),
});

@injectable()
export class CreateTransaction {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionsRepository
  ) {}

  async execute({ description, value, email }: IRequest) {
    if (!description || !value || !email) {
      throw new AppError('Invalid Data', 400);
    }

    const dados = { description, email, value };

    try {
      const validadeData = await TransactionSchema.validate(dados, {
        abortEarly: false,
      });

      const user = await this.userRepository.GetUserByEmail(validadeData.email);

      if (!user) {
        throw new AppError('User does not exites!');
      }

      const transactionModel = new TransactionsEntity();

      Object.assign(transactionModel, {
        description: validadeData.description,
        value: validadeData.value,
      });

      const newTransaction = await this.transactionRepository.create({
        email,
        description: transactionModel.description,
        value: transactionModel.value,
      });

      return {
        ...newTransaction,
        userId: user.id,
      };
    } catch (err: any) {
      const errorMessages: string[] = [];

      err.inner.forEach(({ path, message }: any) => {
        if (path) {
          errorMessages.push(`${message} \n`);
        }
      });
      throw new InvalidYupError(errorMessages.join(''));
    }
  }
}
