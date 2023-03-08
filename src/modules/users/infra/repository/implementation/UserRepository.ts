import { prisma } from '../../../../../database/prisma';
import { IUserDTO } from '@/modules/users/infra/dtos/IUserDTO';
import { UserEntity } from '@/modules/users/infra/Entity/UserEntity';
import { IUserRepository } from '../IUserRepository';

export class UserRepository implements IUserRepository {
  private prisma;
  constructor() {
    this.prisma = prisma;
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
