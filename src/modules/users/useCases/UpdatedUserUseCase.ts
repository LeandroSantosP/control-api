import * as yup from 'yup';
import auth from '@/config/auth';

import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../infra/repository/IUserRepository';

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

const userSchema = yup.object().shape({
   name: yup.string(),
   email: yup.string().email(),
   password: yup
      .string()
      .matches(
         /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
         'Password should have minimum eight characters, at least one latter and ono number!'
      ),
});

@injectable()
export class UpdatedUserUseCase {
   constructor(
      @inject('UserRepository')
      private USerRepository: IUserRepository
   ) {}

   private updatedUserInfos(data_for_updated: UpdatedProps) {
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

      return DataUpdated;
   }

   private formatNewUserInfos(DataUpdated: UpdatedProps) {
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

      return DataFormattedToReturn;
   }

   async execute({ email, user_id, data_for_updated }: IRequest) {
      try {
         const validateData = await userSchema.validate(data_for_updated, {
            abortEarly: false,
         });
         const user = await this.USerRepository.GetUserByEmail(email);

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

         const passReference = validateData.password;

         if (validateData.password) {
            const { saltRounds } = auth;
            const passwordHash = await hash(validateData.password, saltRounds);

            validateData.password = passwordHash;
         }

         const DataUpdated = this.updatedUserInfos(validateData);

         await this.USerRepository.update(DataUpdated, user_id);

         if (DataUpdated.password) {
            DataUpdated.password = passReference;
         }

         const DataFormattedToReturn = this.formatNewUserInfos(DataUpdated);

         const normalizationReturnData = {
            ...DataFormattedToReturn,
         } as User;

         return normalizationReturnData;
      } catch (error: any) {
         const errorMessages: string[] = [];

         error.inner.forEach(({ path, message }: any) => {
            if (path) {
               errorMessages.push(`${message} \n`);
            }
         });

         if (errorMessages.length > 0) {
            throw new InvalidYupError(errorMessages.join(''));
         }
      }
   }
}
