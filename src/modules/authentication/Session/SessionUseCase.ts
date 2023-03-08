import { IUserRepository } from '@/modules/users/infra/repository/IUserRepository';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { AppError } from '@/shared/infra/middleware/AppError';
import { inject, injectable } from 'tsyringe';
import { compare } from 'bcrypt';
import auth from '@/config/auth';
import { DecodedMethods } from '@/utils/DecodedMethods';

export interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

interface IRequest {
  authenticationBase64: string | undefined;
}

@injectable()
export class SessionUseCase extends DecodedMethods {
  constructor(
    @inject('UserRepository')
    private UserRepository: IUserRepository,
    @inject('JwtAuthProvider')
    private JwtAuthProvider: IAuthProvider
  ) {
    super();
  }

  async execute({ authenticationBase64 }: IRequest): Promise<IResponse> {
    if (!authenticationBase64) {
      throw new AppError('Authentication Failed', 404);
    }

    const [type, base64Credential] = authenticationBase64?.split(' ');

    if (type !== 'Basic') {
      throw new AppError('Authentication Failed', 404);
    }

    const { email, password } = super.DecodedBase64Basis(base64Credential);

    const user = await this.UserRepository.GetUserByEmail(email);

    if (!user) {
      throw new AppError('Email or password Is Incorrect!');
    }

    let password_user_db: string = '';
    Object.keys(user).forEach((key) => {
      if (key !== 'password') {
        return;
      }
      password_user_db = user[key];
    });

    const passwordMatch = await compare(password, password_user_db);

    if (!passwordMatch) {
      throw new AppError('Email or password Is Incorrect!');
    }

    const { secretToken } = auth;

    const token = this.JwtAuthProvider.CreateToken({
      payload: { email: user.email },
      secretToken,
      complement: {
        expiresIn: '1d',
        subject: user.id!,
      },
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token: token,
    };
  }
}
