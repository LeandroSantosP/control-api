import { User as UserPrisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Email } from './Email';
import { Name } from './Name';
import { Password } from './Password';

export class User {
   private constructor(
      readonly name: Name,
      readonly email: Email,
      readonly password: Password,
      readonly profileId?: string | null,
      readonly id?: string,
      readonly admin?: boolean,
      readonly created_at?: Date,
      readonly updated_at?: Date,
      readonly deleted_at?: Date | null
   ) {
      if (!this.admin) {
         this.admin = false;
      }
      if (!this.id) {
         this.id = randomUUID();
      }
      if (!this.profileId) {
         this.profileId = null;
      }
      if (!this.created_at) {
         this.created_at = new Date();
      }
      if (!this.updated_at) {
         this.updated_at = new Date();
      }
      if (!this.deleted_at) {
         this.deleted_at = null;
      }
   }

   static async create({
      name,
      email,
      password,
      admin,
      created_at,
      deleted_at,
      id,
      profileId,
      updated_at,
   }: Input) {
      return new User(
         new Name(name),
         new Email(email),
         await Password.create(password),
         profileId,
         id,
         admin,
         created_at,
         updated_at,
         deleted_at
      );
   }
}

type Input = {
   id?: string;
   name: string;
   email: string;
   password: string;
   admin?: boolean;
   profileId?: string | null;
   created_at?: Date;
   updated_at?: Date;
   deleted_at?: Date | null;
};
