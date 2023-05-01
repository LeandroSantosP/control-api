import * as yup from 'yup';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { IUserRepository } from '../infra/repository/IUserRepository';
import { UserEntity } from '../infra/Entity/UserEntity';
import auth from '@/config/auth';

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

   async CreateUser(validateData: IRequest) {
      let { saltRounds } = auth;

      const passwordHash = await hash(validateData.password, saltRounds);

      const newUser = new UserEntity();
      Object.assign(newUser, {
         name: validateData.name,
         email: validateData.email,
         password: passwordHash,
      });

      await this.UserRepository.create({
         email: newUser.email,
         name: newUser.name,
         password: newUser.password,
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