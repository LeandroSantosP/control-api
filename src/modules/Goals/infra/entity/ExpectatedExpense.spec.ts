import { AppError } from '@/shared/infra/middleware/AppError';
import { ExpectatedExpense } from './ExpectatedExpense';

test('should be able to create a ExpectatedExpense', async () => {
   const sut = new ExpectatedExpense(-122.22);
   expect(sut.GetValue).toEqual(-122.22);
});

test('should not be possible create a positive value', async () => {
   expect(() => new ExpectatedExpense(122.22)).toThrow(
      new AppError('The value of the expected expense cannot be positive.')
   );
});

test('should not be possible send invalid decimal.', async () => {
   expect(() => new ExpectatedExpense(-122.222)).toThrow(
      new AppError('Invalid Expectated expense, decimal value is not valid.')
   );
});
