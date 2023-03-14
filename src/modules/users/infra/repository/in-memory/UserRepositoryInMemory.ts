import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { IUserDTO } from '../../dtos/IUserDTO';
import { UserEntity } from '../../Entity/UserEntity';
import { IUserRepository } from '../IUserRepository';

export class UserRepositoryInMemory implements IUserRepository {
  private users: UserEntity[] = [];

  async create({ email, name, password }: IUserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();

    const passwordHash = await hash(password, 9);

    Object.assign(newUser, {
      name,
      email,
      password: passwordHash,
    });
    this.users.push(newUser);
    return newUser;
  }
  async list(): Promise<UserEntity[]> {
    return this.users;
  }
  async GetUserByEmail(email: string): Promise<UserEntity | User | null> {
    const user = this.users.find((us) => us.email === email);
    return user || null;
  }

  async GetUserById(user_id: string): Promise<User | UserEntity | null> {
    const user = this.users.find((us) => us.id === user_id);

    return user ?? null;
  }
}
