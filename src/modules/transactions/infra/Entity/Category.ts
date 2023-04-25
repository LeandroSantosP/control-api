let CategoryProps2: {
   transport: 'transport';
   food: 'food';
   habitation: 'habitation';
   education: 'education';
   health: 'health';
   leisure: 'leisure';
   products: 'products';
   debts: 'debts';
   Taxes: 'Taxes';
   Investments: 'Investments';
   unknown: 'unknown';
};

export type CategoryProps =
   (typeof CategoryProps2)[keyof typeof CategoryProps2];

export class Category {
   private value: CategoryProps;

   constructor(category: CategoryProps | undefined) {
      if (!category) {
         this.value = 'unknown';
         return;
      }

      this.value = category;
   }

   get GetCategory() {
      return this.value;
   }
}
