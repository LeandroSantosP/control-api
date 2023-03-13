import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { TransactionsDTO } from '../../infra/dto/TransactionsDTO';
import { TransactionsEntity } from '../../infra/Entity/TransactionsEntity';
import { ITransactionsRepository } from '../../infra/repository/ITransactionsRepository';

interface IRequest extends TransactionsDTO {
  email: string;
}

@injectable()
export class CreateTransaction {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('TransactionsRepository')
    private transactionRepository: ITransactionsRepository
  ) {}

  async execute({ description, value, email }: IRequest) {
    const user = await this.userRepository.GetUserByEmail(email);

    if (!user) {
      throw new AppError('User does not exites!');
    }

    const transactionModel = new TransactionsEntity();

    Object.assign(transactionModel, {
      description,
      value,
    });

    const newTransaction = await this.transactionRepository.create({
      email,
      description: transactionModel.description,
      value: transactionModel.value,
    });

    return newTransaction;
  }
}
