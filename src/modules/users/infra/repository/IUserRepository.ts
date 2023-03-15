import { User } from '@prisma/client';
import { IUserDTO } from '../dtos/IUserDTO';
import { UserEntity } from '../Entity/UserEntity';

export interface RemoveProps {
  email: string;
  id: string;
}

abstract class IUserRepository {
  abstract create({
    email,
    name,
    password,
  }: IUserDTO): Promise<User | UserEntity>;
  abstract list(): Promise<User[] | UserEntity[]>;
  abstract GetUserByEmail(email: string): Promise<User | UserEntity | null>;
  abstract GetUserById(user_id: string): Promise<User | UserEntity | null>;
  abstract remove({ email, id }: RemoveProps): Promise<void>;
}

export { IUserRepository };
