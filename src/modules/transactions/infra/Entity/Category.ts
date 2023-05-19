import { AppError } from '@/shared/infra/middleware/AppError';

let CategoryPropsModel = {
   transport: 'transport',
   food: 'food',
   habitation: 'habitation',
   education: 'education',
   health: 'health',
   leisure: 'leisure',
   products: 'products',
   debts: 'debts',
   Taxes: 'Taxes',
   Investments: 'Investments',
   unknown: 'unknown',
};

export type CategoryProps = keyof typeof CategoryPropsModel;

export class Category {
   private value: CategoryProps;

   static verityCategory(
      category: string | undefined
   ): category is CategoryProps {
      return Object.values(CategoryPropsModel).includes(
         category as CategoryProps
      );
   }
   constructor(category: CategoryProps | undefined) {
      if (!category) {
         this.value = 'unknown';
         return;
      }

      if (!Category.verityCategory(category)) {
         console.log('ok');

         const validCategory = Object.keys(CategoryPropsModel);
         throw new AppError(
            `Invalid category must be one of [${validCategory}]`
         );
      }

      this.value = category;
   }

   get GetCategory() {
      return this.value;
   }
}
