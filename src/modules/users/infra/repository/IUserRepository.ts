import { Profile, User } from '@prisma/client';
import { IUserDTO } from '../dtos/IUserDTO';

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

export type GetUserByTokenOutput = {
   id: string;
   expire_date: Date;
   token: string;
   userId: string;
}[];

abstract class IUserRepository {
   abstract create({ email, name, password }: IUserDTO): Promise<User>;
   abstract list(): Promise<User[]>;
   abstract GetUserByEmail(email: string): Promise<User | null>;
   abstract GetUserById(user_id: string): Promise<
      | (User & {
           profile: Profile | null;
        })
      | null
      | null
   >;
   abstract remove({ email, id }: RemoveInput): Promise<void>;
   abstract update(data: UpdatedInput, user_id: string): Promise<User>;
   abstract userCreateToken(params: UserCreateTokenInput): Promise<void>;
   abstract GetToken(token: string): Promise<GetUserByTokenOutput>;
   abstract DeleteTokenById(tokenId: string): Promise<string>;
   abstract UploadPassword(user_id: string, newPassWord: string): Promise<void>;
}

export { IUserRepository };
