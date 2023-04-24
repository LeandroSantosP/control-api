import { prisma } from '@/database/prisma';

export abstract class Model<I, O> {
   constructor() {}

   abstract create(props: I): Promise<O>;
   abstract updated(props: I): Promise<O>;
   abstract list(props: I): Promise<O[]>;
}

class User implements Model<string, string> {
   private readonly _prisma;

   constructor() {
      this._prisma = prisma;
      Object.defineProperties(this, {
         prisma: {
            configurable: true,
            enumerable: true,
            writable: false,
            value: this._prisma,
         },
      });
   }

   async create(props: string): Promise<string> {
      throw new Error('Method not implemented.');
   }
   async updated(props: string): Promise<string> {
      throw new Error('Method not implemented.');
   }
   async list(props: string): Promise<string[]> {
      throw new Error('Method not implemented.');
   }
}
