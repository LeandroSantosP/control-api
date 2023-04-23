export type CategoryProps =
   | 'transport'
   | 'food'
   | 'habitation'
   | 'education'
   | 'health'
   | 'leisure'
   | 'products'
   | 'debts'
   | 'taxes'
   | 'investments'
   | 'unknown';

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
