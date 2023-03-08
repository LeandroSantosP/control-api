import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { UserEntity } from '../../infra/Entity/UserEntity';
import { IUserRepository } from '../../infra/repository/IUserRepository';

@injectable()
export class ListUSerUseCase {
  constructor(
    @inject('UserRepository')
    private UserRepository: IUserRepository
  ) {}

  async execute(): Promise<UserEntity[]> {
    const allUser = await this.UserRepository.list();

    return allUser;
  }
}
