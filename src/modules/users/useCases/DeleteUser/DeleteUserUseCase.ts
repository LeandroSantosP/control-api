import { AppError } from '@/shared/infra/middleware/AppError';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../infra/repository/IUserRepository';

interface IRequest {
  email: string;
  user_id: string;
  password: string;
}

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject('UserRepository')
    private UserRepository: IUserRepository,
    @inject('JwtAuthProvider')
    private JwtAuthProvider: IAuthProvider
  ) {}

  async execute({ email, user_id, password }: IRequest) {
    const user = await this.UserRepository.GetUserById(user_id);

    if (!user) {
      throw new AppError('User does not exits!');
    }

    const CorrectlyPassword = await this.JwtAuthProvider.CompareBcrypt(
      password,
      user?.password!
    );

    if (!CorrectlyPassword) {
      throw new AppError('Invalid password!');
    }

    await this.UserRepository.remove({ id: user_id, email });

    return { user_id: user.id };
  }
}
