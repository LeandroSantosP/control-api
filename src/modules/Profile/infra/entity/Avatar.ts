export class Avatar {
   private _value: string;

   constructor(value: string | undefined) {
      if (value === undefined) {
         this._value = '';
         return;
      }

      this._value = value;
   }

   get getValue(): string | undefined {
      return this._value;
   }
}
