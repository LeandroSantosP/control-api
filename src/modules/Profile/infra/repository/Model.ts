import { Profile } from '../entity/Profile';

export type CreateInput = {
   userId: string;
   avatar: string;
   profession: string | undefined;
   salary: string;
   marital_state: string | undefined;
   phonenumber: string;
   Birthday: string;
};

export abstract class Model {
   abstract create<I extends CreateInput, O extends Profile>(
      props: I
   ): Promise<O>;
   abstract updated<I, O>(props: I): Promise<O>;

   abstract delete<I, O>(props: I): Promise<O>;
}
