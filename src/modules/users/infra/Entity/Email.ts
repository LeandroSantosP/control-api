export class Email {
   private readonly regex: RegExp =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   constructor(private readonly email: string) {
      if (!email) {
         throw new Error('Email is required.');
      }
      if (this.regex.test(email) === false)
         throw new Error('Invalid email Format.');
   }

   get GetValue() {
      return this.email;
   }
}
