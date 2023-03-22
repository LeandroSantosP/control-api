import { prisma } from '../../../../../database/prisma';
import { IUserDTO } from '@/modules/users/infra/dtos/IUserDTO';
import { UserEntity } from '@/modules/users/infra/Entity/UserEntity';
import { IUserRepository, RemoveProps, UpdatedProps } from '../IUserRepository';
import { User } from '@prisma/client';

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
}
