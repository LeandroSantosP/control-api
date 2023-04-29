import { Profile, User, UserTokens } from '@prisma/client';
import { IUserDTO } from '../dtos/IUserDTO';
import { UserEntity } from '../Entity/UserEntity';

export interface RemoveInput {
   email: string;
   id: string;
}

export interface UpdatedInput {
   name?: string;
   email?: string;
   password?: string;
}

export interface UserCreateTokenInput {
   user_id: string;
   token: string;
   expire_date: Date;
}

export type GetUserByIdOutput =
   | (User & {
        profile: Profile | null;
     })
   | null
   | null;

abstract class IUserRepository {
   abstract create({
      email,
      name,
      password,
   }: IUserDTO): Promise<User | UserEntity>;
   abstract list(): Promise<User[] | UserEntity[]>;
   abstract GetUserByEmail(email: string): Promise<User | null>;
   abstract GetUserById(user_id: string): Promise<GetUserByIdOutput>;
   abstract remove({ email, id }: RemoveInput): Promise<void>;
   abstract update(data: UpdatedInput, user_id: string): Promise<User>;
   abstract userCreateToken(params: UserCreateTokenInput): Promise<void>;
   abstract userGetTokens(user_id: string): Promise<
      {
         token: string;
         expire_date: Date;
      }[]
   >;
}

export { IUserRepository };
