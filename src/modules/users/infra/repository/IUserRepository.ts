import { User } from '@prisma/client';
import { IUserDTO } from '../dtos/IUserDTO';
import { UserEntity } from '../Entity/UserEntity';

abstract class IUserRepository {
  abstract create({
    email,
    name,
    password,
  }: IUserDTO): Promise<User | UserEntity>;
  abstract list(): Promise<User[] | UserEntity[]>;
  abstract GetUserByEmail(email: string): Promise<User | UserEntity | null>;
  abstract GetUserById(user_id: string): Promise<User | UserEntity | null>;
}

export { IUserRepository };
