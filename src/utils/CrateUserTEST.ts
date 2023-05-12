import { prisma } from '@/database/prisma';
import { User } from '@/modules/users/infra/Entity/User';

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
      const props = await User.create({ email, name, password });

      const newUser = await prisma.user.create({
         data: {
            name: props.name.GetValue,
            email: props.email.GetValue,
            password: props.password.GetPassWordHash,
         },
         include: {
            profile: true,
         },
      });

      return newUser;
   }

   return useExits;
}
