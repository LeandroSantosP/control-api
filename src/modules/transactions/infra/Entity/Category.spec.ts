import { Category } from './Category';

test('Must not be able to create a new category if type is invalid', async () => {
   expect(
      () =>
         // @ts-ignore
         new Category('INVALID_TYPE')
   ).toThrowError();
});
