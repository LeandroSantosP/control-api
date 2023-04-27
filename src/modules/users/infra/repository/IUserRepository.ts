import { Profile, User } from '@prisma/client';
import { IUserDTO } from '../dtos/IUserDTO';
import { UserEntity } from '../Entity/UserEntity';

export interface RemoveProps {
   email: string;
   id: string;
}

export interface UpdatedProps {
   name?: string;
   email?: string;
   password?: string;
}

abstract class IUserRepository {
   abstract create({
      email,
      name,
      password,
   }: IUserDTO): Promise<User | UserEntity>;
   abstract list(): Promise<User[] | UserEntity[]>;
   abstract GetUserByEmail(email: string): Promise<User | null>;
   abstract GetUserById(user_id: string): Promise<
      | (User & {
           profile: Profile | null;
        })
      | null
      | null
   >;
   abstract remove({ email, id }: RemoveProps): Promise<void>;
   abstract update(data: UpdatedProps, user_id: string): Promise<User>;
}

export { IUserRepository };
