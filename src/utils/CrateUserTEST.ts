import { prisma } from '@/database/prisma';
import { UserEntity } from '@/modules/users/infra/Entity/UserEntity';
import { hash } from 'bcrypt';

export default async function CreateUserTest({
   email = 'test@example.com',
   password = 'senha123',
   name = 'John Smith',
} = {}) {
   const useExits = await prisma.user.findUnique({
      where: { email },
      include: {
         profile: true,
      },
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
         include: {
            profile: true,
         },
      });

      return newUser;
   }

   return useExits;
}
