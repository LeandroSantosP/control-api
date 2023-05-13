import { prisma } from '@/database/prisma';
import { Prisma } from '@prisma/client';
import { formatISO, parse, format, addMonths } from 'date-fns';

const dateFormateWithOneMoreMonth = format(
   addMonths(new Date(), 1),
   'yyyy-MM-dd'
);

export const dataFormatted = formatISO(
   parse(dateFormateWithOneMoreMonth as string, 'yyyy-MM-dd', new Date())
);

interface ICreateTransactionTEST {
   email: string;
   description?: string;
   value?: string;
   isSubscription?: boolean;
   categoryType?: any;
   recurrence?: any;
   resolved?: boolean | undefined;
   dueDate?: any;
   filingDate?: any;
}

export default async function CreateTransactionTEST({
   email,
   description = 'test',
   value = '-12',
   categoryType = 'Investments',
   recurrence = 'daily',
   isSubscription,
   resolved,
   dueDate,
   filingDate,
}: ICreateTransactionTEST) {
   const useExits = await prisma.transaction.create({
      data: {
         description: description,
         value: new Prisma.Decimal(value),
         due_date: !filingDate ? dueDate : undefined,
         recurrence,
         isSubscription,
         filingDate: !dueDate ? filingDate : undefined,
         resolved,
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
