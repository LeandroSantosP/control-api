import 'reflect-metadata';
import auth from '@/config2/auth';
import { UserRepositoryInMemory } from '@/modules/users/infra/repository/in-memory/UserRepositoryInMemory';
import { IAuthProvider } from '@/shared/providers/AuthProvider/IAuthProvider';
import { JwtAuthProvider } from '@/shared/providers/AuthProvider/implementation/JwtAuthProvider';
import { SessionUseCase, IResponse } from './SessionUseCase';
import { AppError } from '@/shared/infra/middleware/AppError';
import { verify } from 'jsonwebtoken';
import { describe } from 'node:test';

let userRepositoryInMemory: UserRepositoryInMemory;
let jwtProvider: IAuthProvider;
let sessionUseCase: SessionUseCase;

const email = 'test@example.com';
const name = 'test';
const password = 'testPassword';

describe('User Session', () => {
   beforeEach(() => {
      userRepositoryInMemory = new UserRepositoryInMemory();
      jwtProvider = new JwtAuthProvider();
      sessionUseCase = new SessionUseCase(userRepositoryInMemory, jwtProvider);
   });
   it('Should return user credentials and used.', async () => {
      await userRepositoryInMemory.create({
         email,
         name,
         password,
      });

      const token = Buffer.from(`${email}:${password}`, 'utf8').toString(
         'base64'
      );

      const CredentialsToken = `Basic ${token}`;

      const credentials = await sessionUseCase.execute({
         authenticationBase64: CredentialsToken,
      });

      expect(credentials).toBeInstanceOf(Object);

      //Should be able use credentials

      const { secretToken } = auth;

      const use = await userRepositoryInMemory.GetUserByEmail(email);

      const { sub: client_id } = verify(credentials.token, secretToken);

      expect(client_id).toEqual(use!.id);
   });

   it('Should not allow authentication if authenticationBase64 is not provided.', async () => {
      const result = () =>
         sessionUseCase.execute({
            authenticationBase64: '',
         });

      await expect(result).rejects.toEqual(
         new AppError('Authentication Failed', 404)
      );
   });

   it('should not allow authentication if user does not exits.', async () => {
      const token = Buffer.from(`${email}:${password}`, 'utf8').toString(
         'base64'
      );

      const CredentialsToken = `Basic ${token}`;

      await expect(
         sessionUseCase.execute({
            authenticationBase64: CredentialsToken,
         })
      ).rejects.toEqual(new AppError('Email or password Is Incorrect!'));
   });

   it('should not allow authentication if password is wrong.', async () => {
      await userRepositoryInMemory.create({
         email,
         name,
         password,
      });

      const token = Buffer.from(`${email}:${password}Wrong`, 'utf8').toString(
         'base64'
      );

      const CredentialsToken = `Basic ${token}`;

      const result = () =>
         sessionUseCase.execute({
            authenticationBase64: CredentialsToken,
         });

      await expect(result).rejects.toEqual(
         new AppError('Email or password Is Incorrect!')
      );
   });

   it('should throw an error if the credentials are in the wrong format', async () => {
      try {
         sessionUseCase.DecodedBase64Basis('WRONG_FORMAT_CREDENTIALS');
      } catch (error: any) {
         expect(error).toBeInstanceOf(AppError);
         expect(error.message).toBe('Credentials are in the wrong format');
      }
   });
});
