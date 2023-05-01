export class Name {
   constructor(private readonly name: string) {
      this.name.charAt(0).toUpperCase() + this.name.slice(1);
   }
   get GetValue() {
      return this.name;
   }
}
