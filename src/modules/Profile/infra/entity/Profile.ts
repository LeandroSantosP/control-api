import { randomUUID } from 'crypto';
import { Avatar } from './Avatar';
import { Birthday } from './Birthday';
import { PhoneNumber } from './PhoneNumber';
import { Salary } from './Salary';

export class Profile {
   private constructor(
      readonly id: string | undefined,
      readonly avatar: Avatar,
      readonly profession: string | undefined,
      readonly salary: Salary,
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
         new PhoneNumber(props.phonenumber),
         new Birthday(props.Birthday)
      );
   }
}

type Input = {
   avatar: Express.Multer.File | undefined;
   profession: string | undefined;
   salary: string;
   phonenumber: string;
   Birthday: string;
};
