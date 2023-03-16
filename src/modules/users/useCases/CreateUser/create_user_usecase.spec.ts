import 'reflect-metadata';
import { UserRepositoryTestDB } from '../../infra/repository/test-db/UserRepositoryTestDB';
import { AppError, InvalidYupError } from '@/shared/infra/middleware/AppError';
import { CreateUserUseCase } from './CreateUserUseCase';
import { describe } from 'node:test';
import { compare } from 'bcrypt';
import { prisma } from '@/database/prisma';

let userRepositoryTestDB: UserRepositoryTestDB;

let createUserUseCase: CreateUserUseCase;

let UserTest = {
  email: 'John@example.com',
  name: 'John Doe',
  password: '1234567890senha',
};

describe('Create User', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany();
  });
  beforeEach(async () => {
    await prisma.user.deleteMany();
    userRepositoryTestDB = new UserRepositoryTestDB();
    createUserUseCase = new CreateUserUseCase(userRepositoryTestDB);
    await userRepositoryTestDB.DeleteAllUserX();
  });
  it('should be able to create a new user.', async () => {
    const User = await createUserUseCase.execute({ ...UserTest });

    const AllUserDB = await userRepositoryTestDB.list();

    const passwordMatch = await compare(
      UserTest.password,
      AllUserDB[0].password
    );

    expect(passwordMatch).toBeTruthy();
    expect(User).toBe(undefined);
  });

  it('should not to be able to create a new if them already existing', async () => {
    await userRepositoryTestDB.create({ ...UserTest });

    const User = () => createUserUseCase.execute({ ...UserTest });

    await expect(User).rejects.toEqual(new AppError('Email already Exists!'));
  });

  it('should not to be able create a new user if email or password is invalid', async () => {
    const User = () =>
      createUserUseCase.execute({ ...UserTest, email: 'invalid_email' });

    await expect(User).rejects.toEqual(
      new InvalidYupError('email must be a valid email \n')
    );
  });

  it('should not to be able create a new user if password or password is invalid', async () => {
    const UserTwo = () =>
      createUserUseCase.execute({ ...UserTest, password: 'invalid_pass' });

    await expect(UserTwo).rejects.toEqual(
      new InvalidYupError(
        'Password should have minimum eight characters, at least one latter and ono number! \n'
      )
    );
  });
});
