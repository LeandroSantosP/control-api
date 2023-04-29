import { prisma } from '@/database/prisma';
import { Profile, User, UserTokens } from '@prisma/client';
import { IUserDTO } from '../../dtos/IUserDTO';
import {
   IUserRepository,
   RemoveInput,
   UpdatedInput,
   UserCreateTokenInput,
} from '../IUserRepository';

export class UserRepositoryTestDB implements IUserRepository {
   private prisma;

   constructor() {
      this.prisma = prisma;
   }
   async userGetTokens(user_id: string): Promise<
      {
         token: string;
         expire_date: Date;
      }[]
   > {
      return await this.prisma.userTokens.findMany({
         where: {
            userId: user_id,
         },
         select: {
            token: true,
            expire_date: true,
         },
      });
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

   async list(): Promise<User[]> {
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
      const res = await this.prisma.userTokens.create({
         data: {
            expire_date,
            user: {
               connect: {
                  id: user_id,
               },
            },
            token,
         },
      });

      return;
   }
}
