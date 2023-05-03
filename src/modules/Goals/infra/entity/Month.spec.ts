import { Month } from './Month';

test('should be able create a valid month.', () => {
   const sut = new Month('02');

   expect(sut.getValue).toEqual('02');
});

test('should new be able create a invalid month.', () => {
   expect(() => new Month('111')).toThrowError();
});
