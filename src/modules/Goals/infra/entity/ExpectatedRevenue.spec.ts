import { AppError } from '@/shared/infra/middleware/AppError';
import { ExpectatedRevenue } from './ExpectatedRevenue';

test('should be able to create a ExpectatedRevenue', async () => {
   const sut = new ExpectatedRevenue(122.22);
   expect(sut.GetValue).toEqual(122.22);
});

test('should not be possible create a negative value', async () => {
   expect(() => new ExpectatedRevenue(-122.22)).toThrow(
      new AppError('The value of the expected revenue cannot be negative.')
   );
});

test('should not be possible send invalid decimal.', async () => {
   expect(() => new ExpectatedRevenue(122.222)).toThrow(
      new AppError('Invalid Expectated revenue, decimal value is not valid.')
   );
});
