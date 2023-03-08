import { IUserDTO } from '../dtos/IUserDTO';
import { UserEntity } from '../Entity/UserEntity';

abstract class IUserRepository {
  abstract create({ email, name, password }: IUserDTO): Promise<UserEntity>;
  abstract list(): Promise<UserEntity[]>;
  abstract GetUserByEmail(email: string): Promise<UserEntity | null>;
}

export { IUserRepository };
