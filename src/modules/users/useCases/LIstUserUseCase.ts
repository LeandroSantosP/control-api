import { User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../infra/repository/IUserRepository';

@injectable()
export class ListUSerUseCase {
   constructor(
      @inject('UserRepository')
      private UserRepository: IUserRepository
   ) {}

   async execute(): Promise<User[]> {
      const allUser = await this.UserRepository.list();

      return allUser;
   }
}
