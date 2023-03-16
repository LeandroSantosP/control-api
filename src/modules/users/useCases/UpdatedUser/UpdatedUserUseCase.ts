import auth from '@/config/auth';
import { AppError } from '@/shared/infra/middleware/AppError';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../infra/repository/IUserRepository';

interface UpdatedProps {
  name?: string;
  email?: string;
  password?: string;
}

interface IRequest {
  email: string;
  user_id: string;
  data_for_updated: UpdatedProps;
}

interface IResponse {
  updatedData?: User;
}

@injectable()
export class UpdatedUserUseCase {
  constructor(
    @inject('UserRepository')
    private USerRepository: IUserRepository
  ) {}

  async execute({ email, user_id, data_for_updated }: IRequest) {
    const user = await this.USerRepository.GetUserByEmail(email);

    const passReference = data_for_updated.password;

    if (!user) {
      throw new AppError('Not Authorized', 401);
    }

    Object.keys(user).forEach((key: string) => {
      if (key === 'email' && user[key] !== email) {
        throw new AppError('Not Authorized', 401);
      } else if (key === 'id' && user[key] !== user_id) {
        throw new AppError('Not Authorized', 401);
      }
    });

    if (data_for_updated.password) {
      const { saltRounds } = auth;
      const passwordHash = await hash(data_for_updated.password, saltRounds);

      data_for_updated.password = passwordHash;
    }

    let DataUpdated = {} as UpdatedProps;

    Object.keys(data_for_updated).forEach((key) => {
      interface User {
        name: string;
        email: string;
        password: string;
      }
      const keyMap: Record<string, keyof User> = {
        name: 'name',
        email: 'email',
        password: 'password',
      };

      const currentKey = keyMap[key];

      const dataForDB = {
        [key]: data_for_updated[currentKey],
      };
      Object.assign(DataUpdated, dataForDB);
    });

    await this.USerRepository.update(DataUpdated, user_id);

    if (DataUpdated.password) {
      DataUpdated.password = passReference;
    }

    /* Formatted Obj for return */
    const DataFormattedToReturn = {};

    Object.keys(DataUpdated as any).forEach((key) => {
      interface UserUpdatedData {
        newName: string;
        newEmail: string;
        newPassword: string;
      }
      const updatedKey: Record<string, keyof UserUpdatedData> = {
        name: 'newName',
        email: 'newEmail',
        password: 'newPassword',
      };

      const KeyFormatted = updatedKey[key];
      const dataForReturn = {
        // @ts-ignore
        [KeyFormatted]: DataUpdated[key],
      };
      Object.assign(DataFormattedToReturn, dataForReturn);
    });

    const normalizationReturnData = {
      ...DataFormattedToReturn,
    } as User;

    return normalizationReturnData;
  }
}
