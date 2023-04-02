import { prisma } from '@/database/prisma';
import { Prisma } from '@prisma/client';
import { formatISO, parse } from 'date-fns';

const dataFormatted = formatISO(
   parse('2023-04-23' as string, 'yyyy-MM-dd', new Date())
);

interface ICreateTransactionTEST {
   email: string;
   description?: string;
   value?: string;
   isSubscription: boolean;
   categoryType?: any;
   recurrence?: any;
   dueDate?: any;
}

export default async function CreateTransactionTEST({
   email,
   description = 'test',
   value = '-12',
   categoryType = 'Investments',
   recurrence = 'daily',
   isSubscription,
   dueDate = dataFormatted,
}: ICreateTransactionTEST) {
   const useExits = await prisma.transaction.create({
      data: {
         description: description,
         value: new Prisma.Decimal(value),
         due_date: dueDate,
         recurrence,
         isSubscription,
         author: {
            connect: {
               email,
            },
         },
         category: {
            connectOrCreate: {
               create: {
                  name: categoryType,
               },
               where: {
                  name: categoryType,
               },
            },
         },
      },
   });

   return useExits;
}
