import { randomUUID } from 'crypto';
import { Avatar } from './Avatar';
import { Birthday } from './Birthday';
import { MaritalState } from './MaritalState';
import { PhoneNumber } from './PhoneNumber';
import { Salary } from './Salary';

export class Profile {
   private constructor(
      readonly id: string | undefined,
      readonly avatar: Avatar,
      readonly profession: string | undefined,
      readonly salary: Salary,
      readonly marital_state: MaritalState,
      readonly phonenumber: PhoneNumber,
      readonly Birthday: Birthday
   ) {
      if (!this.id) {
         this.id = randomUUID();
      }
   }

   static create(props: Input) {
      return new Profile(
         undefined,
         new Avatar(props.avatar),
         props.profession,
         new Salary(props.salary),
         new MaritalState(props.marital_state),
         new PhoneNumber(props.phonenumber),
         new Birthday(props.Birthday)
      );
   }
}

type Input = {
   avatar: string | undefined;
   profession: string | undefined;
   salary: string;
   marital_state: string | undefined;
   phonenumber: string;
   Birthday: string;
};
