import { v4 as uuidV4 } from 'uuid';

export class GoalEntity {
   user_id!: string;
   month!: string;
   expectated_revenue!: number;
   expectated_expense!: number;
   created_at?: Date;
   updated_at?: Date;

   get userId(): string | null {
      return this.userId;
   }

   set setUserId(user_id: string) {
      this.user_id = user_id;
   }

   constructor() {
      if (!this.created_at) {
         this.created_at = new Date();
      }
      if (!this.updated_at) {
         this.updated_at = new Date();
      }
      if (!this.user_id) {
         this.user_id = uuidV4();
      }
   }
}
