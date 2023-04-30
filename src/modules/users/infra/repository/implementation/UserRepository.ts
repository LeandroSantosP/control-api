import { prisma } from '../../../../../database/prisma';
import { IUserDTO } from '@/modules/users/infra/dtos/IUserDTO';
import { UserEntity } from '@/modules/users/infra/Entity/UserEntity';
import {
   GetUserByTokenOutput,
   IUserRepository,
   RemoveInput,
   UpdatedInput,
   UserCreateTokenInput,
} from '../IUserRepository';
import { Profile, User } from '@prisma/client';

export class UserRepository implements IUserRepository {
   private prisma;
   constructor() {
      this.prisma = prisma;
   }

   async create({ email, name, password }: IUserDTO): Promise<User> {
      const user = await this.prisma.user.create({
         data: {
            email,
            name,
            password,
         },
      });

      return user;
   }

   async list(): Promise<UserEntity[]> {
      const allUser = await this.prisma.user.findMany();

      return allUser;
   }
   async GetUserByEmail(email: string): Promise<User | null> {
      const user = await this.prisma.user.findUnique({
         where: {
            email,
         },
      });

      return user;
   }
   async GetUserById(user_id: string): Promise<
      | (User & {
           profile: Profile | null;
        })
      | null
      | null
   > {
      const user = await this.prisma.user.findUnique({
         where: {
            id: user_id,
         },
         include: {
            profile: true,
         },
      });

      return user;
   }
   async remove({ email, id }: RemoveInput): Promise<void> {
      await this.prisma.user.delete({
         where: {
            id,
         },
      });
   }
   async update(data: UpdatedInput, user_id: string): Promise<User> {
      const dataUpdated = await this.prisma.user.update({
         where: {
            id: user_id,
         },
         data,
      });

      return dataUpdated;
   }
   async userCreateToken({
      expire_date,
      token,
      user_id,
   }: UserCreateTokenInput): Promise<void> {
      await this.prisma.userTokens.create({
         data: {
            user: {
               connect: {
                  id: user_id,
               },
            },
            expire_date,
            token,
         },
      });

      return;
   }

   async GetToken(token: string): Promise<GetUserByTokenOutput> {
      return await this.prisma.userTokens.findMany({
         where: {
            token: token,
         },
         select: {
            userId: true,
            token: true,
            expire_date: true,
            id: true,
         },
      });
   }
   async UploadPassword(user_id: string, newPassWord: string): Promise<void> {
      await this.prisma.user.update({
         where: {
            id: user_id,
         },
         data: {
            password: newPassWord,
         },
      });
   }

   async DeleteTokenById(tokenId: string): Promise<string> {
      await this.prisma.userTokens.delete({
         where: {
            id: tokenId,
         },
      });

      return Promise.resolve('Token Deleted');
   }
}
