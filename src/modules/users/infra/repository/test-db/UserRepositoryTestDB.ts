import 'dotenv/config';
import { exec } from 'child_process';
process.env.DATABASE_URL = `${process.env.DATABASE_URL}_testdb?schema=test_schema`;

/* @TODO transform in async to avoid race condition */
exec('yarn prisma migrate dev');

import { prisma } from '@/database/prisma';
import { IUserDTO } from '../../dtos/IUserDTO';
import { UserEntity } from '../../Entity/UserEntity';
import { IUserRepository } from '../IUserRepository';

export class UserRepositoryTestDB implements IUserRepository {
  private prisma;

  constructor() {
    this.prisma = prisma;
  }

  async DeleteAllUserX() {
    await this.prisma.user.deleteMany();
  }

  async create({ email, name, password }: IUserDTO): Promise<UserEntity> {
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

  async GetUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
}
