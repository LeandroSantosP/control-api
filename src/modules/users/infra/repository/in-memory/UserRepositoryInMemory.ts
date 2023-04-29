import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { IUserDTO } from '../../dtos/IUserDTO';
import { UserEntity } from '../../Entity/UserEntity';
import { IUserRepository, RemoveInput, UpdatedInput } from '../IUserRepository';

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
   async GetUserByEmail(email: string): Promise<User | null> {
      const user = this.users.find((us) => us.email === email)!;
      return user as User;
   }

   async GetUserById(user_id: string): Promise<User | any> {
      const user = this.users.find((us) => us.id === user_id);

      return user ?? null;
   }

   async remove({ email, id }: RemoveInput): Promise<void> {
      const index = this.users.findIndex(
         (user) => user.id === id && user.email === email
      );
      if (index !== -1) {
         this.users.splice(index, 1);
      }
      return;
   }
   async update(data: UpdatedInput, user_id: string): Promise<User> {
      throw new Error('Method not implemented.');
   }
}
