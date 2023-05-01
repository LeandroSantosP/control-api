import * as yup from 'yup';
import { inject, injectable } from 'tsyringe';

import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { IUserRepository } from '../infra/repository/IUserRepository';
import { User } from '../infra/Entity/User';

interface IRequest {
   name: string;
   email: string;
   password: string;
}

const userSchema = yup.object().shape({
   name: yup.string().required(),
   email: yup.string().email().required(),
   password: yup
      .string()
      .required()
      .matches(
         /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
         'Password should have minimum eight characters, at least one latter and ono number!'
      ),
});

@injectable()
export class CreateUserUseCase {
   private dados: {};
   constructor(
      @inject('UserRepository')
      private UserRepository: IUserRepository
   ) {
      this.dados = {};
   }

   async CreateUser({ email, name, password }: IRequest) {
      const newUser = await User.create({
         name,
         email,
         password,
      });

      await this.UserRepository.create({
         email: newUser.email.GetValue,
         name: newUser.name.GetValue,
         password: newUser.password.GetPassWordHash,
      });
   }

   async execute({ email, name, password }: IRequest): Promise<void> {
      const userExists = await this.UserRepository.GetUserByEmail(email);

      if (userExists) {
         throw new AppError('Email already Exists!');
      }

      this.dados = { email, name, password };

      await userSchema
         .validate(this.dados, { abortEarly: false })
         .then(async (validateData) => {
            await this.CreateUser(validateData);
            return;
         })
         .catch((err: yup.ValidationError) => {
            const errorMessages: string[] = [];

            err.inner.forEach(({ path, message }) => {
               if (path) {
                  errorMessages.push(`${message} \n`);
               }
            });

            if (errorMessages.length > 0) {
               throw new InvalidYupError(errorMessages.join(''));
            }
         });
   }
}
