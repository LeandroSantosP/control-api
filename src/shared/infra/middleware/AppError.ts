export class AppError extends Error {
   public readonly statusCode: number;

   constructor(message = 'Something Going Wrong!', statusCode = 400) {
      super();
      this.message = message;
      this.statusCode = statusCode;
   }
}

export class InvalidYupError extends Error {
   public readonly statusCode: number;

   constructor(message = 'Something Going Wrong!', statusCode = 400) {
      super();
      this.message = message;
      this.statusCode = statusCode;
   }
}
