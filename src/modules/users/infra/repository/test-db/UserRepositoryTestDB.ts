import { prisma } from '@/database/prisma';
import { User } from '@prisma/client';
import { IUserDTO } from '../../dtos/IUserDTO';
import { IUserRepository, RemoveProps, UpdatedProps } from '../IUserRepository';

export class UserRepositoryTestDB implements IUserRepository {
   private prisma;

   constructor() {
      this.prisma = prisma;
   }

   async updateImage(imageRef: string, user_id: string): Promise<User> {
      const updatedUserInfos = this.prisma.user.update({
         where: {
            id: user_id,
         },
         data: {},
      });
      throw new Error('Method not implemented.');
   }

   async DeleteAllUserX() {
      await this.prisma.user.deleteMany();
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

   async GetUserById(user_id: string): Promise<User | null> {
      const user = await this.prisma.user.findUnique({
         where: {
            id: user_id,
         },
      });

      return user;
   }
   async remove({ email, id }: RemoveProps): Promise<void> {
      await this.prisma.user.delete({
         where: {
            id,
         },
      });
   }

   async update(data: UpdatedProps, user_id: string): Promise<User> {
      const dataUpdated = await this.prisma.user.update({
         where: {
            id: user_id,
         },
         data,
      });

      return dataUpdated;
   }

   UploadAvatar({
      user_id,
      avatar_ref,
   }: {
      user_id: string;
      avatar_ref: string;
   }): Promise<{ avatar: string | null }> {
      throw new Error('Method not implemented.');
   }
}
