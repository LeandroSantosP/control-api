import { v4 as uuidV4 } from 'uuid';

export class TransactionsEntity {
  id?: string;
  description!: string;
  value!: number;
  installments?: number | null;
  isSubscription?: boolean | null;
  due_date?: Date | null;
  resolved!: boolean;
  created_at?: Date;
  updated_at?: Date;

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

    if (!this.isSubscription) {
      this.installments = 0;
    }
    if (!this.resolved) {
      this.resolved = false;
    }
  }
}
