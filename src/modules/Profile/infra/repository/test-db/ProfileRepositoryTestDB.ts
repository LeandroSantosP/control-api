import { prisma } from '@/database/prisma';
import { AppError } from '@/shared/infra/middleware/AppError';
import { Profile } from '@prisma/client';

import {
   CreateInput,
   getProfile,
   IProfileModel,
   UpdateInput,
} from '../IProfileModel';

export class ProfileRepositoryTestDB implements IProfileModel {
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
            dateOfBirth: props.Birthday,
            avatar: props.avatar,
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
   async updated<I extends UpdateInput, O extends Profile>({
      profile_id,
      ...props
   }: I): Promise<O> {
      const profile = await this.prisma.profile.update({
         where: {
            id: profile_id,
         },
         data: {
            dateOfBirth: props.Birthday,
            avatar: props.avatar,
            phonenumber: props.phonenumber,
            profession: props.profession,
            salary: props.salary,
         },
      });

      const unknownProfile: unknown = profile;
      const convertedProfile = unknownProfile as O;

      return convertedProfile;
   }

   delete<I, O>(props: I): Promise<O> {
      throw new Error('Method not implemented.');
   }

   async getProfile<
      I extends getProfile,
      O extends
         | (Profile & {
              User: {
                 id: string;
                 name: string;
                 email: string;
              }[];
           })
         | null
   >(params: I): Promise<O> {
      const profile = await this.prisma.profile.findFirst({
         where: {
            id: params.profile_id,
            User: {
               some: {
                  id: params.user_id,
               },
            },
         },
         include: {
            User: {
               where: {
                  id: params.user_id,
               },
               select: {
                  name: true,
                  email: true,
                  id: true,
               },
            },
         },
      });

      return profile as O;
   }
}
