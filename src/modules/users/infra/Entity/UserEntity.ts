import { v4 as uuidV4 } from 'uuid';
import {} from 'crypto';

export class UserEntity {
  id?: string;
  name!: string;
  email!: string;
  password!: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
    if (!this.created_at) {
      this.created_at = new Date();
    }
    if (!this.updated_at) {
      this.updated_at = new Date();
    }
  }
}
