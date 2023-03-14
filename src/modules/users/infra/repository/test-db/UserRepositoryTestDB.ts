import { prisma } from '@/database/prisma';
import { User } from '@prisma/client';
import { IUserDTO } from '../../dtos/IUserDTO';
import { IUserRepository } from '../IUserRepository';

export class UserRepositoryTestDB implements IUserRepository {
  private prisma;

  constructor() {
    this.prisma = prisma;
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
}
