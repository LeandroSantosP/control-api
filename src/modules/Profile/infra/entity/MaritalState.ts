export class MaritalState {
   private _value: string | undefined;

   constructor(value: string | undefined) {
      this._value = value;
   }

   get getValue() {
      return this._value;
   }
}
