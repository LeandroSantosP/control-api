import { Profile } from '@prisma/client';

export type CreateInput = {
   userId: string;
   avatar: string;
   profession: string | undefined;
   salary: string;
   phonenumber: string;
   Birthday: string;
};

export type UpdateInput = {
   profile_id: string;
   avatar: string;
   profession?: string | undefined;
   salary?: string;
   phonenumber?: string;
   Birthday?: string;
};

export type getProfile = {
   user_id: string;
   profile_id: string;
};

export abstract class IProfileModel {
   abstract create<I extends CreateInput, O extends Profile>(
      props: I
   ): Promise<O>;
   abstract updated<I extends UpdateInput, O extends Profile>(
      props: I
   ): Promise<O>;

   abstract delete<I, O>(props: I): Promise<O>;

   abstract getProfile<
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
   >(params: I): Promise<O>;
}
