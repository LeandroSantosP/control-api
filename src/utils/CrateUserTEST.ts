import { prisma } from '@/database/prisma';
import { UserEntity } from '@/modules/users/infra/Entity/UserEntity';
import { hash } from 'bcrypt';

export default async function CreateUserTest({
  email = 'test@example.com',
  password = 'senha123',
  name = 'John Smith',
} = {}) {
  console.log;
  const useExits = await prisma.user.findUnique({
    where: { email },
  });

  if (!useExits) {
    const passwordHash = await hash(password, 9);
    const user = new UserEntity();
    Object.assign(user, {
      name,
      email,
      password: passwordHash,
    });

    const newUser = await prisma.user.create({
      data: {
        ...user,
      },
    });

    return newUser;
  }

  return useExits;
}
