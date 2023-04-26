import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';
import { Profile } from '../../entity/Profile';
import { CreateInput, Model } from '../Model';

export class ProfileRepositoryTestDB implements Model {
   private prisma;
   constructor() {
      this.prisma = prisma;
   }
   async create<I extends CreateInput, O extends Profile>(
      props: I
   ): Promise<O> {
      const profile = await this.prisma.profile.create({
         data: {
            User: {
               connect: {
                  id: props.userId,
               },
            },
            marital_state: props.marital_state,
            dateOfBirth: props.Birthday,
            avatar: props.avatar!,
            phonenumber: props.phonenumber,
            profession: props.profession,
            salary: props.salary,
         },
      });

      const unknownProfile: unknown = profile;
      const convertedProfile = unknownProfile as O;

      if (typeof convertedProfile !== 'object' || convertedProfile === null) {
         throw new AppError('Cannot convert Profile to output type');
      }

      return convertedProfile;
   }
   updated<I, O>(props: I): Promise<O> {
      throw new Error('Method not implemented.');
   }

   delete<I, O>(props: I): Promise<O> {
      throw new Error('Method not implemented.');
   }
}
let test: Model;

test = new ProfileRepositoryTestDB();
