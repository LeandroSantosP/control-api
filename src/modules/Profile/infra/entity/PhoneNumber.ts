export class PhoneNumber {
   private _value: string;

   constructor(value: string) {
      this._value = value;
   }

   get getValue(): string {
      return this._value;
   }
}
