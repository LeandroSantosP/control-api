declare namespace Express {
   export interface Request {
      client: {
         id: string;
         email: string;
         profileId: string | null;
      };
   }
}
